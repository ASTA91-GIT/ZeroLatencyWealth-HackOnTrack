import csv
import io
import uuid
import logging
from typing import List, Dict, Any
from backend.database import SessionLocal
from backend.db_models import DBHolding, DBAsset
from backend.models import ImportResponse

logger = logging.getLogger("zerolatency.import")

SIMULATED_BROKER_DATA = {
    "Broker A": [
        {"symbol": "INFY", "name": "Infosys Ltd (Demo)", "type": "EQUITY", "units": 45, "buy_price": 1780.0, "current_price": 1890.0, "sector": "Information Technology", "yield": 2.2},
        {"symbol": "KOTAKBANK", "name": "Kotak Mahindra Bank (Demo)", "type": "EQUITY", "units": 25, "buy_price": 1720.0, "current_price": 1795.0, "sector": "Banking & Finance", "yield": 0.9}
    ],
    "Broker B": [
        {"symbol": "BIRET", "name": "Nexus Select Trust REIT (Demo)", "type": "REIT", "units": 100, "buy_price": 132.0, "current_price": 139.5, "sector": "Retail Mall Real Estate", "yield": 7.8},
        {"symbol": "SGB-NOV29", "name": "Sovereign Gold Bond 2.50% (Demo)", "type": "BOND", "units": 15, "buy_price": 6200.0, "current_price": 7450.0, "sector": "Precious Metals / Sovereign", "yield": 2.5}
    ],
    "Depository": [
        {"symbol": "NHAI-INVIT", "name": "National Highways Infra Trust (Demo)", "type": "INVIT", "units": 200, "buy_price": 120.0, "current_price": 126.5, "sector": "National Highways", "yield": 9.4},
        {"symbol": "REC-BOND-2027", "name": "REC Ltd 7.79% Tax-Free Bond (Demo)", "type": "BOND", "units": 40, "buy_price": 1050.0, "current_price": 1085.0, "sector": "Public Financial Institution", "yield": 7.79}
    ]
}

def simulate_source_sync(source_name: str, user_id: str = "demo-user-001") -> ImportResponse:
    db = SessionLocal()
    try:
        items = SIMULATED_BROKER_DATA.get(source_name, SIMULATED_BROKER_DATA["Broker A"])
        added_holdings = []

        for item in items:
            asset = db.query(DBAsset).filter(DBAsset.symbol == item["symbol"]).first()
            if not asset:
                asset_id = f"IMP_{uuid.uuid4().hex[:6].upper()}"
                asset = DBAsset(
                    id=asset_id,
                    symbol=item["symbol"],
                    name=item["name"],
                    asset_type=item["type"],
                    category="Imported Portfolio Asset",
                    sector=item.get("sector", "Diversified"),
                    description=f"Simulated imported holding from {source_name}",
                    risk_level="Moderate",
                    annual_yield=item.get("yield", 4.5),
                    liquidity_score="Moderate",
                    price=item["current_price"],
                    change_24h=0.45
                )
                db.add(asset)
                db.flush()

            existing_holding = db.query(DBHolding).filter(
                DBHolding.user_id == user_id,
                DBHolding.asset_id == asset.id,
                DBHolding.source == source_name
            ).first()

            if existing_holding:
                existing_holding.units += item["units"]
                holding_id = existing_holding.id
            else:
                holding_id = f"HLD_{uuid.uuid4().hex[:8]}"
                new_holding = DBHolding(
                    id=holding_id,
                    user_id=user_id,
                    asset_id=asset.id,
                    source=source_name,
                    units=item["units"],
                    avg_buy_price=item["buy_price"],
                    current_price=item["current_price"]
                )
                db.add(new_holding)

            added_holdings.append({
                "holding_id": holding_id,
                "symbol": item["symbol"],
                "name": item["name"],
                "type": item["type"],
                "source": source_name,
                "units": item["units"],
                "value": round(item["units"] * item["current_price"], 2)
            })

        db.commit()

        return ImportResponse(
            status="success",
            imported_count=len(added_holdings),
            source=source_name,
            message=f"Successfully aggregated and normalized {len(added_holdings)} instruments from {source_name}.",
            holdings_added=added_holdings
        )
    finally:
        db.close()

def parse_and_import_csv(csv_content: str, user_id: str = "demo-user-001") -> ImportResponse:
    """Parse, validate, and securely ingest CSV holdings with row limits and type guards."""
    if not csv_content.strip():
        return ImportResponse(
            status="error",
            imported_count=0,
            source="Imported CSV",
            message="Uploaded CSV file is empty.",
            holdings_added=[]
        )

    db = SessionLocal()
    try:
        reader = csv.DictReader(io.StringIO(csv_content))
        added = []
        skipped = 0
        MAX_ROWS = 1000

        for idx, row in enumerate(reader):
            if idx >= MAX_ROWS:
                logger.warning(f"CSV row limit of {MAX_ROWS} reached for user {user_id}")
                break

            symbol = (row.get("Symbol") or row.get("symbol") or row.get("Ticker") or "").strip().upper()
            if not symbol:
                skipped += 1
                continue

            name = (row.get("Name") or row.get("name") or symbol).strip()
            asset_type = (row.get("AssetType") or row.get("asset_type") or row.get("Type") or "EQUITY").strip().upper()
            if asset_type not in ["EQUITY", "BOND", "REIT", "INVIT", "OTHER"]:
                asset_type = "EQUITY"

            try:
                raw_units = row.get("Units") or row.get("units") or "1.0"
                raw_buy = row.get("BuyPrice") or row.get("buy_price") or row.get("Price") or "100.0"
                raw_curr = row.get("CurrentPrice") or row.get("current_price") or raw_buy

                units = float(raw_units)
                buy_price = float(raw_buy)
                current_price = float(raw_curr)

                if units <= 0 or buy_price <= 0:
                    skipped += 1
                    continue
            except (ValueError, TypeError):
                skipped += 1
                continue

            asset = db.query(DBAsset).filter(DBAsset.symbol == symbol).first()
            if not asset:
                asset_id = f"CSV_{uuid.uuid4().hex[:6].upper()}"
                asset = DBAsset(
                    id=asset_id,
                    symbol=symbol,
                    name=name,
                    asset_type=asset_type,
                    category="CSV Ingested",
                    sector="Diversified",
                    description=f"Uploaded asset via CSV import: {name}",
                    risk_level="Moderate",
                    annual_yield=3.5,
                    liquidity_score="Moderate",
                    price=current_price,
                    change_24h=0.0
                )
                db.add(asset)
                db.flush()

            holding_id = f"CSV_{uuid.uuid4().hex[:8]}"
            new_holding = DBHolding(
                id=holding_id,
                user_id=user_id,
                asset_id=asset.id,
                source="Imported CSV",
                units=units,
                avg_buy_price=buy_price,
                current_price=current_price
            )
            db.add(new_holding)

            added.append({
                "holding_id": holding_id,
                "symbol": symbol,
                "name": name,
                "type": asset_type,
                "source": "Imported CSV",
                "units": units,
                "value": round(units * current_price, 2)
            })

        db.commit()

        status_str = "success" if added else "warning"
        msg = f"Successfully parsed and ingested {len(added)} holdings from uploaded CSV file."
        if skipped > 0:
            msg += f" ({skipped} invalid or header rows safely skipped)."

        return ImportResponse(
            status=status_str,
            imported_count=len(added),
            source="Imported CSV",
            message=msg,
            holdings_added=added
        )
    finally:
        db.close()
