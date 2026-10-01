import os
import sqlite3
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from backend.db_models import (
    Base, DBUser, DBAsset, DBHolding, DBTransaction, DBGoal,
    DBPortfolioSnapshot, DBPaperAccount
)

DB_PATH = os.path.join(os.path.dirname(__file__), "zerolatency.db")
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Use SQLite file path by default
    DATABASE_URL = f"sqlite:///{DB_PATH}"

# Connect args for SQLite
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_connection():
    """Backward-compatible raw connection provider for existing query pipelines."""
    if DATABASE_URL.startswith("sqlite"):
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    else:
        # Fallback raw connection from engine
        return engine.raw_connection()

def init_db():
    """Initialize all schema tables using SQLAlchemy ORM Base and apply lightweight column migrations."""
    Base.metadata.create_all(bind=engine)
    try:
        if DATABASE_URL.startswith("sqlite"):
            conn = get_connection()
            cursor = conn.cursor()
            user_cols = [c[1] for c in cursor.execute("PRAGMA table_info(users)").fetchall()]
            if "email_verified" not in user_cols:
                cursor.execute("ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT 0")
                conn.commit()
            conn.close()
    except Exception as ex:
        print("Notice: migration check warning:", ex)

def seed_demo_data(force=False):
    """Seed benchmark demo assets, portfolio, goals, and paper trading cash for demo-user-001."""
    db: Session = SessionLocal()
    try:
        # Check if demo user already exists
        existing_demo = db.query(DBUser).filter(DBUser.id == "demo-user-001").first()
        if existing_demo and not force:
            return

        # Clear existing demo user data if force
        if existing_demo:
            db.query(DBHolding).filter(DBHolding.user_id == "demo-user-001").delete()
            db.query(DBTransaction).filter(DBTransaction.user_id == "demo-user-001").delete()
            db.query(DBGoal).filter(DBGoal.user_id == "demo-user-001").delete()
            db.query(DBPortfolioSnapshot).filter(DBPortfolioSnapshot.user_id == "demo-user-001").delete()
            db.query(DBPaperAccount).filter(DBPaperAccount.user_id == "demo-user-001").delete()
            db.query(DBUser).filter(DBUser.id == "demo-user-001").delete()
            db.commit()

        # Seed Demo User
        demo_user = DBUser(
            id="demo-user-001",
            email="demo@zerolatency.invest",
            name="Alex Mercer",
            password_hash="$argon2id$v=19$m=65536,t=3,p=4$qFq8zY0v8zZ6Q...$demo_argon_hash",
            is_demo=1,
            email_verified=True
        )
        db.add(demo_user)

        # Seed Paper Trading Account for Demo User with ₹10,00,000
        paper_acc = DBPaperAccount(
            id="PA_demo-user-001",
            user_id="demo-user-001",
            cash_balance=1000000.0,
            currency="INR"
        )
        db.add(paper_acc)

        # Master Assets
        assets_data = [
            # EQUITIES
            {"id": "EQ01", "symbol": "NIFTYBEES", "name": "Nippon India Nifty 50 ETF", "asset_type": "EQUITY",
             "category": "Index ETF", "sector": "Broad Market",
             "description": "Passive ETF tracking India's premier top 50 bluechip companies across financial services, IT, oil & gas, FMCG.",
             "risk_level": "Moderate", "annual_yield": 1.2, "liquidity_score": "High", "price": 262.50, "change_24h": 0.85},
            {"id": "EQ02", "symbol": "TCS", "name": "Tata Consultancy Services (Demo)", "asset_type": "EQUITY",
             "category": "Large Cap Tech", "sector": "Information Technology",
             "description": "India's largest IT services exporter providing digital transformation, cloud, and engineering services globally.",
             "risk_level": "Moderate", "annual_yield": 2.1, "liquidity_score": "High", "price": 3890.00, "change_24h": -0.42},
            {"id": "EQ03", "symbol": "HDFCBANK", "name": "HDFC Bank Ltd (Demo)", "asset_type": "EQUITY",
             "category": "Private Bank", "sector": "Banking & Finance",
             "description": "Leading private sector bank offering retail, corporate banking and treasury operations.",
             "risk_level": "Moderate", "annual_yield": 1.1, "liquidity_score": "High", "price": 1680.00, "change_24h": 1.15},
            {"id": "EQ04", "symbol": "RELIANCE", "name": "Reliance Industries Ltd (Demo)", "asset_type": "EQUITY",
             "category": "Conglomerate", "sector": "Energy & Telecom",
             "description": "Diversified conglomerate spanning refining, petrochemicals, telecommunications (Jio) and retail.",
             "risk_level": "Moderate-High", "annual_yield": 0.8, "liquidity_score": "High", "price": 2940.00, "change_24h": 0.65},

            # BONDS
            {"id": "BD01", "symbol": "GS2033-718", "name": "7.18% GS 2033 Sovereign Bond", "asset_type": "BOND",
             "category": "Government Securities", "sector": "Sovereign Debt",
             "description": "10-year central government sovereign bond offering semi-annual coupon payments backed by the Reserve Bank of India.",
             "risk_level": "Low", "annual_yield": 7.18, "liquidity_score": "Moderate", "price": 101.40, "change_24h": 0.05},
            {"id": "BD02", "symbol": "NABARD-AAA", "name": "NABARD 7.65% Infra Bond 2029", "asset_type": "BOND",
             "category": "Public Financial Institution", "sector": "Development Finance",
             "description": "AAA-rated institutional bond supporting rural agricultural infrastructure with steady fixed coupon income.",
             "risk_level": "Low", "annual_yield": 7.65, "liquidity_score": "Moderate", "price": 102.50, "change_24h": 0.02},
            {"id": "BD03", "symbol": "LT-DEB-2028", "name": "L&T Finance 8.15% NCD 2028", "asset_type": "BOND",
             "category": "Corporate Debt", "sector": "Financial Services",
             "description": "High-rated corporate Non-Convertible Debenture providing higher yields with quarterly interest distribution.",
             "risk_level": "Moderate", "annual_yield": 8.15, "liquidity_score": "Moderate-Low", "price": 1005.00, "change_24h": -0.10},

            # REITS
            {"id": "RT01", "symbol": "EMBASSY", "name": "Embassy Office Parks REIT", "asset_type": "REIT",
             "category": "Commercial Real Estate", "sector": "Real Estate Office Parks",
             "description": "India's first publicly listed REIT owning and operating 45.4 msf of premier Grade-A commercial office space leased to top Fortune 500 multinationals.",
             "risk_level": "Moderate", "annual_yield": 6.80, "liquidity_score": "Moderate", "price": 375.00, "change_24h": 0.90},
            {"id": "RT02", "symbol": "MINDSPACE", "name": "Mindspace Business Parks REIT", "asset_type": "REIT",
             "category": "Commercial Tech Parks", "sector": "Real Estate Tech Parks",
             "description": "Quality commercial business parks situated in key technology micro-markets like Mumbai, Hyderabad, Pune, and Chennai.",
             "risk_level": "Moderate", "annual_yield": 6.95, "liquidity_score": "Moderate", "price": 335.50, "change_24h": 0.45},
            {"id": "RT03", "symbol": "BROOKFIELD", "name": "Brookfield India Real Estate Trust", "asset_type": "REIT",
             "category": "Institutional Real Estate", "sector": "Real Estate Office Parks",
             "description": "100% institutionally managed real estate investment trust with marquee multinational tenant leases.",
             "risk_level": "Moderate-High", "annual_yield": 7.40, "liquidity_score": "Moderate", "price": 265.00, "change_24h": -0.20},

            # INVITS
            {"id": "IN01", "symbol": "PGINVIT", "name": "PowerGrid Infrastructure Trust", "asset_type": "INVIT",
             "category": "Power Transmission", "sector": "Infrastructure & Utilities",
             "description": "Backed by Power Grid Corp, owns and operates 5 operational interstate power transmission projects with regulated stable cash flows.",
             "risk_level": "Moderate-Low", "annual_yield": 10.40, "liquidity_score": "Moderate", "price": 101.20, "change_24h": 0.30},
            {"id": "IN02", "symbol": "IRBINVIT", "name": "IRB InvIT Fund", "asset_type": "INVIT",
             "category": "Highways & Toll Roads", "sector": "Roads & Highways",
             "description": "Infrastructure investment trust owning revenue-generating toll-road assets across national highway corridors.",
             "risk_level": "Moderate-High", "annual_yield": 9.80, "liquidity_score": "Moderate-Low", "price": 64.50, "change_24h": -0.75},

            # OTHER / CASH
            {"id": "OT01", "symbol": "LIQUIDBEES", "name": "Nippon India ETF Liquid BeES", "asset_type": "OTHER",
             "category": "Money Market", "sector": "Cash Equivalents",
             "description": "Daily dividend payout liquid ETF parking surplus funds in overnight collateralized borrowing & lending obligations.",
             "risk_level": "Very Low", "annual_yield": 6.20, "liquidity_score": "High", "price": 1000.00, "change_24h": 0.01}
        ]

        for item in assets_data:
            existing_asset = db.query(DBAsset).filter(DBAsset.id == item["id"]).first()
            if not existing_asset:
                db.add(DBAsset(**item))
            else:
                for k, v in item.items():
                    setattr(existing_asset, k, v)

        # Seed Benchmark Holdings (~₹8,42,500 value, ₹7,95,000 invested)
        holdings_data = [
            {"id": "H01", "user_id": "demo-user-001", "asset_id": "EQ01", "source": "Broker A", "units": 670, "avg_buy_price": 248.00, "current_price": 262.50},
            {"id": "H02", "user_id": "demo-user-001", "asset_id": "EQ02", "source": "Broker B", "units": 30, "avg_buy_price": 3720.00, "current_price": 3890.00},
            {"id": "H03", "user_id": "demo-user-001", "asset_id": "EQ03", "source": "Depository", "units": 50, "avg_buy_price": 1610.00, "current_price": 1680.00},
            {"id": "H04", "user_id": "demo-user-001", "asset_id": "EQ04", "source": "Broker A", "units": 21, "avg_buy_price": 2810.00, "current_price": 2940.00},
            {"id": "H05", "user_id": "demo-user-001", "asset_id": "BD01", "source": "Depository", "units": 700, "avg_buy_price": 99.80, "current_price": 101.40},
            {"id": "H06", "user_id": "demo-user-001", "asset_id": "BD02", "source": "Broker B", "units": 500, "avg_buy_price": 100.50, "current_price": 102.50},
            {"id": "H07", "user_id": "demo-user-001", "asset_id": "BD03", "source": "Imported CSV", "units": 30, "avg_buy_price": 980.00, "current_price": 1005.00},
            {"id": "H08", "user_id": "demo-user-001", "asset_id": "RT01", "source": "Broker A", "units": 160, "avg_buy_price": 342.00, "current_price": 375.00},
            {"id": "H09", "user_id": "demo-user-001", "asset_id": "RT02", "source": "Broker B", "units": 120, "avg_buy_price": 310.00, "current_price": 335.50},
            {"id": "H10", "user_id": "demo-user-001", "asset_id": "RT03", "source": "Imported CSV", "units": 95, "avg_buy_price": 245.00, "current_price": 265.00},
            {"id": "H11", "user_id": "demo-user-001", "asset_id": "IN01", "source": "Broker A", "units": 500, "avg_buy_price": 93.50, "current_price": 101.20},
            {"id": "H12", "user_id": "demo-user-001", "asset_id": "IN02", "source": "Depository", "units": 520, "avg_buy_price": 59.00, "current_price": 64.50},
            {"id": "H13", "user_id": "demo-user-001", "asset_id": "OT01", "source": "Broker A", "units": 42.23, "avg_buy_price": 842.88, "current_price": 1000.00},
        ]
        for h in holdings_data:
            db.add(DBHolding(**h))

        # Seed Transactions
        transactions_data = [
            {"id": "T01", "user_id": "demo-user-001", "asset_id": "RT01", "type": "DISTRIBUTION", "units": 160, "price": 5.25, "amount": 840.0, "date": "2026-09-18", "source": "Broker A"},
            {"id": "T02", "user_id": "demo-user-001", "asset_id": "BD01", "type": "INTEREST", "units": 700, "price": 3.59, "amount": 2513.0, "date": "2026-09-15", "source": "Depository"},
            {"id": "T03", "user_id": "demo-user-001", "asset_id": "IN01", "type": "DISTRIBUTION", "units": 500, "price": 3.10, "amount": 1550.0, "date": "2026-09-02", "source": "Broker A"},
            {"id": "T04", "user_id": "demo-user-001", "asset_id": "EQ02", "type": "DIVIDEND", "units": 30, "price": 28.0, "amount": 840.0, "date": "2026-08-24", "source": "Broker B"},
            {"id": "T05", "user_id": "demo-user-001", "asset_id": "EQ01", "type": "BUY", "units": 100, "price": 252.0, "amount": 25200.0, "date": "2026-08-10", "source": "Broker A"},
            {"id": "T06", "user_id": "demo-user-001", "asset_id": "RT02", "type": "DISTRIBUTION", "units": 120, "price": 4.80, "amount": 576.0, "date": "2026-07-28", "source": "Broker B"}
        ]
        for t in transactions_data:
            db.add(DBTransaction(**t))

        # Seed Goals
        goals_data = [
            {"id": "G01", "user_id": "demo-user-001", "title": "Emergency Liquidity Buffer", "category": "Emergency", "target_amount": 250000.0, "current_amount": 210000.0, "time_period": "6 Months", "icon": "shield-check"},
            {"id": "G02", "user_id": "demo-user-001", "title": "Nordic Winter Expedition", "category": "Travel", "target_amount": 180000.0, "current_amount": 125000.0, "time_period": "12 Months", "icon": "plane"},
            {"id": "G03", "user_id": "demo-user-001", "title": "Executive Masters / Upskilling", "category": "Education", "target_amount": 500000.0, "current_amount": 280000.0, "time_period": "24 Months", "icon": "graduation-cap"},
            {"id": "G04", "user_id": "demo-user-001", "title": "Apartment Down Payment", "category": "Home", "target_amount": 1500000.0, "current_amount": 550000.0, "time_period": "36 Months", "icon": "home"},
            {"id": "G05", "user_id": "demo-user-001", "title": "Long-Term Passive Income Stash", "category": "Retirement", "target_amount": 2500000.0, "current_amount": 842500.0, "time_period": "60 Months", "icon": "trending-up"}
        ]
        for g in goals_data:
            db.add(DBGoal(**g))

        # Seed 12-Month Performance Snapshots
        snapshots_data = [
            {"id": "S01", "user_id": "demo-user-001", "date": "Oct 2025", "total_value": 720000, "invested_value": 710000, "equity_val": 360000, "bond_val": 140000, "reit_val": 110000, "invit_val": 75000, "other_val": 35000},
            {"id": "S02", "user_id": "demo-user-001", "date": "Nov 2025", "total_value": 735000, "invested_value": 720000, "equity_val": 372000, "bond_val": 142000, "reit_val": 112000, "invit_val": 74000, "other_val": 35000},
            {"id": "S03", "user_id": "demo-user-001", "date": "Dec 2025", "total_value": 748000, "invested_value": 730000, "equity_val": 381000, "bond_val": 143000, "reit_val": 114000, "invit_val": 74500, "other_val": 35500},
            {"id": "S04", "user_id": "demo-user-001", "date": "Jan 2026", "total_value": 759000, "invested_value": 745000, "equity_val": 390000, "bond_val": 145000, "reit_val": 115000, "invit_val": 73000, "other_val": 36000},
            {"id": "S05", "user_id": "demo-user-001", "date": "Feb 2026", "total_value": 745000, "invested_value": 750000, "equity_val": 378000, "bond_val": 146000, "reit_val": 113000, "invit_val": 72000, "other_val": 36000},
            {"id": "S06", "user_id": "demo-user-001", "date": "Mar 2026", "total_value": 768000, "invested_value": 760000, "equity_val": 395000, "bond_val": 147000, "reit_val": 116000, "invit_val": 73500, "other_val": 36500},
            {"id": "S07", "user_id": "demo-user-001", "date": "Apr 2026", "total_value": 782000, "invested_value": 768000, "equity_val": 404000, "bond_val": 148000, "reit_val": 118000, "invit_val": 75000, "other_val": 37000},
            {"id": "S08", "user_id": "demo-user-001", "date": "May 2026", "total_value": 796000, "invested_value": 775000, "equity_val": 412000, "bond_val": 149000, "reit_val": 120000, "invit_val": 77000, "other_val": 38000},
            {"id": "S09", "user_id": "demo-user-001", "date": "Jun 2026", "total_value": 808000, "invested_value": 780000, "equity_val": 418000, "bond_val": 150000, "reit_val": 121000, "invit_val": 79000, "other_val": 40000},
            {"id": "S10", "user_id": "demo-user-001", "date": "Jul 2026", "total_value": 821000, "invested_value": 786000, "equity_val": 426000, "bond_val": 150500, "reit_val": 123000, "invit_val": 81000, "other_val": 40500},
            {"id": "S11", "user_id": "demo-user-001", "date": "Aug 2026", "total_value": 830000, "invested_value": 790000, "equity_val": 431000, "bond_val": 151200, "reit_val": 124500, "invit_val": 82500, "other_val": 40800},
            {"id": "S12", "user_id": "demo-user-001", "date": "Sep 2026", "total_value": 842500, "invested_value": 795000, "equity_val": 438315, "bond_val": 152380, "reit_val": 125435, "invit_val": 84140, "other_val": 42230}
        ]
        for s in snapshots_data:
            db.add(DBPortfolioSnapshot(**s))

        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    seed_demo_data(force=True)
    print("Database initialized and demo data seeded via SQLAlchemy!")
