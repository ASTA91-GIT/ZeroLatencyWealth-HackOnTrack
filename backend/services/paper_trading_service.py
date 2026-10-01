import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from backend.database import SessionLocal
from backend.db_models import (
    DBPaperAccount, DBPaperOrder, DBHolding, DBTransaction, DBAsset, DBUser
)

from backend.market_data import get_market_data_provider

DEFAULT_INITIAL_CASH = 1000000.0  # ₹10,00,000 simulated buying power

def get_or_create_paper_account(user_id: str, db: Optional[Session] = None) -> DBPaperAccount:
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True
    try:
        acc = db.query(DBPaperAccount).filter(DBPaperAccount.user_id == user_id).first()
        if not acc:
            acc = DBPaperAccount(
                id=f"PA_{uuid.uuid4().hex[:8]}",
                user_id=user_id,
                cash_balance=DEFAULT_INITIAL_CASH,
                currency="INR"
            )
            db.add(acc)
            db.commit()
            db.refresh(acc)
        return acc
    finally:
        if close_db:
            db.close()

def get_paper_account_summary(user_id: str) -> Dict[str, Any]:
    db = SessionLocal()
    try:
        acc = get_or_create_paper_account(user_id, db)
        
        # Calculate paper holdings value for this user with real market updates
        holdings = db.query(DBHolding).filter(DBHolding.user_id == user_id).all()
        holdings_value = 0.0
        invested_value = 0.0

        for h in holdings:
            # Sync with real asset if available
            asset = db.query(DBAsset).filter(DBAsset.id == h.asset_id).first()
            current_unit_price = h.current_price
            if asset:
                current_unit_price = asset.price
            holdings_value += h.units * current_unit_price
            invested_value += h.units * h.avg_buy_price

        unrealized_pl = holdings_value - invested_value

        return {
            "user_id": user_id,
            "cash_balance": round(acc.cash_balance, 2),
            "currency": acc.currency,
            "holdings_value": round(holdings_value, 2),
            "total_portfolio_equity": round(acc.cash_balance + holdings_value, 2),
            "unrealized_pl": round(unrealized_pl, 2),
            "is_simulated": True,
            "disclaimer": "PAPER TRADING / SIMULATED — NO REAL MONEY INVOLVED"
        }
    finally:
        db.close()

def execute_paper_order(
    user_id: str,
    asset_id: str,
    order_type: str, # BUY or SELL
    units: float,
    limit_price: Optional[float] = None
) -> Dict[str, Any]:
    """Execute simulated paper trade with real market prices, balance checks, and user isolation."""
    order_type = order_type.upper().strip()
    if order_type not in ("BUY", "SELL"):
        return {"success": False, "message": "Invalid order type. Must be BUY or SELL."}

    if units <= 0:
        return {"success": False, "message": "Units must be greater than zero."}

    db = SessionLocal()
    try:
        # Find asset
        asset = db.query(DBAsset).filter(
            (DBAsset.id == asset_id) | (DBAsset.symbol == asset_id.upper())
        ).first()
        if not asset:
            return {"success": False, "message": "Target asset not found."}

        execution_price = limit_price if limit_price and limit_price > 0 else asset.price
        total_order_amount = units * execution_price

        acc = get_or_create_paper_account(user_id, db)

        if order_type == "BUY":
            if acc.cash_balance < total_order_amount:
                return {
                    "success": False,
                    "message": f"Insufficient paper cash balance. Required: ₹{total_order_amount:,.2f}, Available: ₹{acc.cash_balance:,.2f}."
                }

            # Deduct cash
            acc.cash_balance -= total_order_amount

            # Check if holding exists for this user and asset
            existing_holding = db.query(DBHolding).filter(
                DBHolding.user_id == user_id,
                DBHolding.asset_id == asset.id
            ).first()

            if existing_holding:
                new_units = existing_holding.units + units
                total_invested = (existing_holding.units * existing_holding.avg_buy_price) + total_order_amount
                existing_holding.avg_buy_price = round(total_invested / new_units, 2)
                existing_holding.units = new_units
                existing_holding.current_price = execution_price
                existing_holding.updated_at = datetime.utcnow()
            else:
                new_holding = DBHolding(
                    id=f"H_{uuid.uuid4().hex[:8]}",
                    user_id=user_id,
                    asset_id=asset.id,
                    source="Paper Trading",
                    units=units,
                    avg_buy_price=execution_price,
                    current_price=execution_price
                )
                db.add(new_holding)

        elif order_type == "SELL":
            existing_holding = db.query(DBHolding).filter(
                DBHolding.user_id == user_id,
                DBHolding.asset_id == asset.id
            ).first()

            if not existing_holding or existing_holding.units < units:
                curr_units = existing_holding.units if existing_holding else 0.0
                return {
                    "success": False,
                    "message": f"Insufficient holding units to sell. Requested: {units}, Owned: {curr_units}."
                }

            # Add cash
            acc.cash_balance += total_order_amount

            # Deduct holding units
            existing_holding.units -= units
            existing_holding.current_price = execution_price
            existing_holding.updated_at = datetime.utcnow()
            if existing_holding.units <= 0.0001:
                db.delete(existing_holding)

        # Record Paper Order
        order_id = f"ORD_{uuid.uuid4().hex[:8]}"
        paper_order = DBPaperOrder(
            id=order_id,
            user_id=user_id,
            asset_id=asset.id,
            order_type=order_type,
            units=units,
            price=execution_price,
            total_amount=total_order_amount,
            status="FILLED"
        )
        db.add(paper_order)

        # Record Portfolio Transaction
        tx = DBTransaction(
            id=f"TX_{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            asset_id=asset.id,
            type=order_type,
            units=units,
            price=execution_price,
            amount=total_order_amount,
            date=datetime.now().strftime("%Y-%m-%d"),
            source="Paper Trading"
        )
        db.add(tx)

        db.commit()

        return {
            "success": True,
            "order_id": order_id,
            "order_type": order_type,
            "symbol": asset.symbol,
            "units": units,
            "execution_price": execution_price,
            "total_amount": total_order_amount,
            "remaining_cash": round(acc.cash_balance, 2),
            "status": "FILLED",
            "message": f"Simulated {order_type} order for {units} units of {asset.symbol} filled at ₹{execution_price:,.2f}.",
            "is_simulated": True,
            "disclaimer": "PAPER TRADING / SIMULATED — NO REAL MONEY INVOLVED"
        }
    finally:
        db.close()

def get_user_paper_orders(user_id: str) -> List[Dict[str, Any]]:
    db = SessionLocal()
    try:
        orders = db.query(DBPaperOrder, DBAsset).join(
            DBAsset, DBPaperOrder.asset_id == DBAsset.id
        ).filter(DBPaperOrder.user_id == user_id).order_by(DBPaperOrder.created_at.desc()).all()

        results = []
        for o, asset in orders:
            results.append({
                "id": o.id,
                "asset_id": asset.id,
                "symbol": asset.symbol,
                "name": asset.name,
                "asset_type": asset.asset_type,
                "order_type": o.order_type,
                "units": o.units,
                "price": o.price,
                "total_amount": o.total_amount,
                "status": o.status,
                "created_at": str(o.created_at)
            })
        return results
    finally:
        db.close()
