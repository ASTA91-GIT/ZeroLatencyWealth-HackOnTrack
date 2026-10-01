import uuid
from typing import List, Dict, Any
from backend.database import SessionLocal
from backend.db_models import DBWatchlist, DBAsset

def get_user_watchlist(user_id: str) -> List[Dict[str, Any]]:
    db = SessionLocal()
    try:
        items = db.query(DBWatchlist, DBAsset).join(
            DBAsset, DBWatchlist.asset_id == DBAsset.id
        ).filter(DBWatchlist.user_id == user_id).all()

        results = []
        for wl, asset in items:
            results.append({
                "id": wl.id,
                "asset_id": asset.id,
                "symbol": asset.symbol,
                "name": asset.name,
                "asset_type": asset.asset_type,
                "sector": asset.sector,
                "price": asset.price,
                "change_24h": asset.change_24h,
                "annual_yield": asset.annual_yield,
                "risk_level": asset.risk_level,
                "added_at": str(wl.created_at)
            })
        return results
    finally:
        db.close()

def add_to_watchlist(user_id: str, asset_id: str) -> Dict[str, Any]:
    db = SessionLocal()
    try:
        # Check if asset exists
        asset = db.query(DBAsset).filter(
            (DBAsset.id == asset_id) | (DBAsset.symbol == asset_id.upper())
        ).first()
        if not asset:
            return {"success": False, "message": "Asset not found"}

        existing = db.query(DBWatchlist).filter(
            DBWatchlist.user_id == user_id,
            DBWatchlist.asset_id == asset.id
        ).first()

        if existing:
            return {"success": True, "message": f"{asset.symbol} is already in your watchlist", "item_id": existing.id}

        wl_item = DBWatchlist(
            id=f"WL_{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            asset_id=asset.id
        )
        db.add(wl_item)
        db.commit()
        return {"success": True, "message": f"{asset.symbol} added to watchlist", "item_id": wl_item.id}
    finally:
        db.close()

def remove_from_watchlist(user_id: str, asset_id: str) -> Dict[str, Any]:
    db = SessionLocal()
    try:
        asset = db.query(DBAsset).filter(
            (DBAsset.id == asset_id) | (DBAsset.symbol == asset_id.upper())
        ).first()
        target_asset_id = asset.id if asset else asset_id

        deleted = db.query(DBWatchlist).filter(
            DBWatchlist.user_id == user_id,
            (DBWatchlist.asset_id == target_asset_id) | (DBWatchlist.id == asset_id)
        ).delete()
        db.commit()

        if deleted > 0:
            return {"success": True, "message": "Item removed from watchlist"}
        return {"success": False, "message": "Item was not found in your watchlist"}
    finally:
        db.close()
