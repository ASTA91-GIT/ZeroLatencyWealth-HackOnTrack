import csv
import io
import uuid
from typing import List, Dict, Any
from backend.database import get_connection
from backend.models import ImportResponse

# Fictional import pools for simulated broker connectors
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
    conn = get_connection()
    cursor = conn.cursor()

    items = SIMULATED_BROKER_DATA.get(source_name, SIMULATED_BROKER_DATA["Broker A"])
    added_holdings = []

    for item in items:
        # Check or create asset
        cursor.execute("SELECT id FROM assets WHERE symbol = ?", (item["symbol"],))
        existing_asset = cursor.fetchone()
        
        if existing_asset:
            asset_id = existing_asset["id"]
        else:
            asset_id = f"IMP_{uuid.uuid4().hex[:6].upper()}"
            cursor.execute("""
            INSERT INTO assets (id, symbol, name, asset_type, category, sector, description, risk_level, annual_yield, liquidity_score, price, change_24h)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                asset_id, item["symbol"], item["name"], item["type"], "Imported Portfolio Asset",
                item.get("sector", "Diversified"), f"Simulated imported holding from {source_name}",
                "Moderate", item.get("yield", 4.5), "Moderate", item["current_price"], 0.45
            ))

        # Check if holding already exists from this source
        cursor.execute("SELECT id, units FROM holdings WHERE user_id = ? AND asset_id = ? AND source = ?", (user_id, asset_id, source_name))
        existing_holding = cursor.fetchone()

        if existing_holding:
            new_units = existing_holding["units"] + item["units"]
            cursor.execute("UPDATE holdings SET units = ? WHERE id = ?", (new_units, existing_holding["id"]))
            holding_id = existing_holding["id"]
        else:
            holding_id = f"HLD_{uuid.uuid4().hex[:8]}"
            cursor.execute("""
            INSERT INTO holdings (id, user_id, asset_id, source, units, avg_buy_price, current_price)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (holding_id, user_id, asset_id, source_name, item["units"], item["buy_price"], item["current_price"]))

        added_holdings.append({
            "holding_id": holding_id,
            "symbol": item["symbol"],
            "name": item["name"],
            "type": item["type"],
            "source": source_name,
            "units": item["units"],
            "value": round(item["units"] * item["current_price"], 2)
        })

    conn.commit()
    conn.close()

    return ImportResponse(
        status="success",
        imported_count=len(added_holdings),
        source=source_name,
        message=f"Successfully aggregated and normalized {len(added_holdings)} instruments from {source_name}.",
        holdings_added=added_holdings
    )

def parse_and_import_csv(csv_content: str, user_id: str = "demo-user-001") -> ImportResponse:
    conn = get_connection()
    cursor = conn.cursor()

    reader = csv.DictReader(io.StringIO(csv_content))
    added = []

    for row in reader:
        # Standardize expected columns: Symbol, Name, AssetType, Units, BuyPrice, CurrentPrice
        symbol = row.get("Symbol") or row.get("symbol") or row.get("Ticker") or "CSV_ASSET"
        name = row.get("Name") or row.get("name") or symbol
        asset_type = (row.get("AssetType") or row.get("asset_type") or row.get("Type") or "EQUITY").upper()
        if asset_type not in ["EQUITY", "BOND", "REIT", "INVIT", "OTHER"]:
            asset_type = "EQUITY"

        try:
            units = float(row.get("Units") or row.get("units") or 1.0)
            buy_price = float(row.get("BuyPrice") or row.get("buy_price") or row.get("Price") or 100.0)
            current_price = float(row.get("CurrentPrice") or row.get("current_price") or buy_price)
        except ValueError:
            continue

        # Check or create asset
        cursor.execute("SELECT id FROM assets WHERE symbol = ?", (symbol,))
        row_asset = cursor.fetchone()
        if row_asset:
            asset_id = row_asset["id"]
        else:
            asset_id = f"CSV_{uuid.uuid4().hex[:6].upper()}"
            cursor.execute("""
            INSERT INTO assets (id, symbol, name, asset_type, category, sector, description, risk_level, annual_yield, liquidity_score, price, change_24h)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (asset_id, symbol, name, asset_type, "CSV Imported", "General", f"Imported asset from CSV file: {name}", "Moderate", 3.5, "High", current_price, 0.0))

        holding_id = f"CSV_{uuid.uuid4().hex[:8]}"
        cursor.execute("""
        INSERT INTO holdings (id, user_id, asset_id, source, units, avg_buy_price, current_price)
        VALUES (?, ?, ?, 'Imported CSV', ?, ?, ?)
        """, (holding_id, user_id, asset_id, units, buy_price, current_price))

        added.append({
            "holding_id": holding_id,
            "symbol": symbol,
            "name": name,
            "type": asset_type,
            "source": "Imported CSV",
            "units": units,
            "value": round(units * current_price, 2)
        })

    conn.commit()
    conn.close()

    return ImportResponse(
        status="success",
        imported_count=len(added),
        source="Imported CSV",
        message=f"Successfully parsed and ingested {len(added)} holdings from uploaded CSV file.",
        holdings_added=added
    )
