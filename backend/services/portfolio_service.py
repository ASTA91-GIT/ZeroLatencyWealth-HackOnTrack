from datetime import datetime
from typing import List, Optional, Dict, Any
from backend.database import get_connection, seed_demo_data
from backend.models import PortfolioSummary, HoldingModel, AllocationBreakdown, SourceBreakdown, AssetModel

def get_user_portfolio_summary(user_id: str = "demo-user-001") -> PortfolioSummary:
    conn = get_connection()
    cursor = conn.cursor()

    # Query all holdings with asset info
    query = """
    SELECT 
        h.id, h.user_id, h.asset_id, h.source, h.units, h.avg_buy_price, h.current_price,
        a.symbol, a.name, a.asset_type, a.category, a.sector, a.risk_level, a.annual_yield, a.change_24h
    FROM holdings h
    JOIN assets a ON h.asset_id = a.id
    WHERE h.user_id = ?
    """
    rows = cursor.execute(query, (user_id,)).fetchall()

    if not rows:
        conn.close()
        return PortfolioSummary(
            total_value=0.0,
            total_invested=0.0,
            unrealized_pl=0.0,
            unrealized_pl_percent=0.0,
            day_change_amount=0.0,
            day_change_percent=0.0,
            total_assets=0,
            projected_annual_income=0.0,
            weighted_yield=0.0,
            allocations=[],
            sources=[],
            last_updated=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            is_demo=True
        )

    total_value = 0.0
    total_invested = 0.0
    total_day_change = 0.0
    total_annual_income = 0.0

    alloc_map: Dict[str, Dict[str, Any]] = {}
    source_map: Dict[str, Dict[str, Any]] = {}

    for r in rows:
        units = float(r["units"])
        avg_price = float(r["avg_buy_price"])
        cur_price = float(r["current_price"])
        day_chg_pct = float(r["change_24h"] or 0.0)
        annual_yield = float(r["annual_yield"] or 0.0)

        inv_val = units * avg_price
        cur_val = units * cur_price
        day_chg = cur_val * (day_chg_pct / 100.0)
        annual_income = cur_val * (annual_yield / 100.0)

        total_invested += inv_val
        total_value += cur_val
        total_day_change += day_chg
        total_annual_income += annual_income

        atype = r["asset_type"]
        if atype not in alloc_map:
            alloc_map[atype] = {"current_val": 0.0, "invested_val": 0.0, "count": 0}
        alloc_map[atype]["current_val"] += cur_val
        alloc_map[atype]["invested_val"] += inv_val
        alloc_map[atype]["count"] += 1

        src = r["source"]
        if src not in source_map:
            source_map[src] = {"current_val": 0.0, "count": 0}
        source_map[src]["current_val"] += cur_val
        source_map[src]["count"] += 1

    unrealized_pl = total_value - total_invested
    unrealized_pl_percent = (unrealized_pl / total_invested * 100) if total_invested > 0 else 0.0
    day_change_percent = (total_day_change / (total_value - total_day_change) * 100) if (total_value - total_day_change) > 0 else 0.0
    weighted_yield = (total_annual_income / total_value * 100) if total_value > 0 else 0.0

    allocations: List[AllocationBreakdown] = []
    for atype, data in alloc_map.items():
        pct = (data["current_val"] / total_value * 100) if total_value > 0 else 0.0
        pl = data["current_val"] - data["invested_val"]
        pl_pct = (pl / data["invested_val"] * 100) if data["invested_val"] > 0 else 0.0
        allocations.append(AllocationBreakdown(
            asset_type=atype,
            current_value=round(data["current_val"], 2),
            invested_value=round(data["invested_val"], 2),
            percentage=round(pct, 1),
            unrealized_pl=round(pl, 2),
            unrealized_pl_percent=round(pl_pct, 2),
            asset_count=data["count"]
        ))

    # Sort allocations: EQUITY, BOND, REIT, INVIT, OTHER
    order = {"EQUITY": 1, "BOND": 2, "REIT": 3, "INVIT": 4, "OTHER": 5}
    allocations.sort(key=lambda x: order.get(x.asset_type, 99))

    sources: List[SourceBreakdown] = []
    for src, data in source_map.items():
        pct = (data["current_val"] / total_value * 100) if total_value > 0 else 0.0
        sources.append(SourceBreakdown(
            source=src,
            current_value=round(data["current_val"], 2),
            percentage=round(pct, 1),
            asset_count=data["count"]
        ))
    sources.sort(key=lambda x: x.current_value, reverse=True)

    conn.close()

    return PortfolioSummary(
        total_value=round(total_value, 2),
        total_invested=round(total_invested, 2),
        unrealized_pl=round(unrealized_pl, 2),
        unrealized_pl_percent=round(unrealized_pl_percent, 2),
        day_change_amount=round(total_day_change, 2),
        day_change_percent=round(day_change_percent, 2),
        total_assets=len(rows),
        projected_annual_income=round(total_annual_income, 2),
        weighted_yield=round(weighted_yield, 2),
        allocations=allocations,
        sources=sources,
        last_updated=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        is_demo=True
    )

def get_user_holdings(
    user_id: str = "demo-user-001",
    asset_type: Optional[str] = None,
    source: Optional[str] = None,
    search: Optional[str] = None
) -> List[HoldingModel]:
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    SELECT 
        h.id, h.user_id, h.asset_id, h.source, h.units, h.avg_buy_price, h.current_price,
        a.symbol, a.name, a.asset_type, a.sector, a.risk_level, a.annual_yield
    FROM holdings h
    JOIN assets a ON h.asset_id = a.id
    WHERE h.user_id = ?
    """
    params = [user_id]

    if asset_type and asset_type.upper() != "ALL":
        query += " AND a.asset_type = ?"
        params.append(asset_type.upper())

    if source and source != "All Sources":
        query += " AND h.source = ?"
        params.append(source)

    if search:
        query += " AND (a.name LIKE ? OR a.symbol LIKE ? OR a.sector LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term])

    rows = cursor.execute(query, params).fetchall()

    # Get total value for allocation calculation
    summary = get_user_portfolio_summary(user_id)
    total_val = summary.total_value if summary.total_value > 0 else 1.0

    result: List[HoldingModel] = []
    for r in rows:
        units = float(r["units"])
        avg_price = float(r["avg_buy_price"])
        cur_price = float(r["current_price"])

        inv_val = units * avg_price
        cur_val = units * cur_price
        unrealized_pl = cur_val - inv_val
        unrealized_pl_pct = (unrealized_pl / inv_val * 100) if inv_val > 0 else 0.0
        alloc_pct = (cur_val / total_val * 100)

        result.append(HoldingModel(
            id=r["id"],
            user_id=r["user_id"],
            asset_id=r["asset_id"],
            symbol=r["symbol"],
            name=r["name"],
            asset_type=r["asset_type"],
            sector=r["sector"],
            source=r["source"],
            units=units,
            avg_buy_price=round(avg_price, 2),
            current_price=round(cur_price, 2),
            invested_value=round(inv_val, 2),
            current_value=round(cur_val, 2),
            unrealized_pl=round(unrealized_pl, 2),
            unrealized_pl_percent=round(unrealized_pl_pct, 2),
            allocation_percent=round(alloc_pct, 1),
            annual_yield=float(r["annual_yield"] or 0.0),
            risk_level=r["risk_level"]
        ))

    conn.close()
    return result

def get_asset_by_id(asset_id: str) -> Optional[AssetModel]:
    conn = get_connection()
    cursor = conn.cursor()
    row = cursor.execute("SELECT * FROM assets WHERE id = ? OR symbol = ?", (asset_id, asset_id)).fetchone()
    conn.close()
    if not row:
        return None
    return AssetModel(
        id=row["id"],
        symbol=row["symbol"],
        name=row["name"],
        asset_type=row["asset_type"],
        category=row["category"],
        sector=row["sector"],
        description=row["description"],
        risk_level=row["risk_level"],
        annual_yield=float(row["annual_yield"] or 0.0),
        liquidity_score=row["liquidity_score"],
        price=float(row["price"]),
        change_24h=float(row["change_24h"] or 0.0)
    )

def get_all_assets() -> List[AssetModel]:
    conn = get_connection()
    cursor = conn.cursor()
    rows = cursor.execute("SELECT * FROM assets ORDER BY asset_type, symbol").fetchall()
    conn.close()
    return [
        AssetModel(
            id=r["id"],
            symbol=r["symbol"],
            name=r["name"],
            asset_type=r["asset_type"],
            category=r["category"],
            sector=r["sector"],
            description=r["description"],
            risk_level=r["risk_level"],
            annual_yield=float(r["annual_yield"] or 0.0),
            liquidity_score=r["liquidity_score"],
            price=float(r["price"]),
            change_24h=float(r["change_24h"] or 0.0)
        )
        for r in rows
    ]

def reset_demo_portfolio():
    seed_demo_data(force=True)
    return {"status": "success", "message": "Demo portfolio reset to canonical hackathon snapshot."}
