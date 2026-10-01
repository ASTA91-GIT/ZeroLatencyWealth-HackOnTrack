import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "zerolatency.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        is_demo INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        symbol TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        asset_type TEXT NOT NULL, -- EQUITY, BOND, REIT, INVIT, OTHER
        category TEXT,
        sector TEXT,
        description TEXT,
        risk_level TEXT, -- Low, Moderate, Moderate-High, High
        annual_yield REAL DEFAULT 0.0,
        liquidity_score TEXT, -- High, Moderate, Low
        price REAL NOT NULL,
        change_24h REAL DEFAULT 0.0
    );

    CREATE TABLE IF NOT EXISTS holdings (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        asset_id TEXT NOT NULL,
        source TEXT NOT NULL, -- Broker A, Broker B, Depository, Imported CSV
        units REAL NOT NULL,
        avg_buy_price REAL NOT NULL,
        current_price REAL NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(asset_id) REFERENCES assets(id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        asset_id TEXT NOT NULL,
        type TEXT NOT NULL, -- BUY, DIVIDEND, INTEREST, DISTRIBUTION
        units REAL,
        price REAL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        source TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(asset_id) REFERENCES assets(id)
    );

    CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL, -- Emergency, Education, Travel, Home, Retirement
        target_amount REAL NOT NULL,
        current_amount REAL NOT NULL,
        time_period TEXT NOT NULL,
        icon TEXT DEFAULT 'target',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS portfolio_snapshots (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        date TEXT NOT NULL,
        total_value REAL NOT NULL,
        invested_value REAL NOT NULL,
        equity_val REAL NOT NULL,
        bond_val REAL NOT NULL,
        reit_val REAL NOT NULL,
        invit_val REAL NOT NULL,
        other_val REAL NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    """)
    conn.commit()
    conn.close()

def seed_demo_data(force=False):
    conn = get_connection()
    cursor = conn.cursor()

    if not force:
        cursor.execute("SELECT COUNT(*) FROM users WHERE id = 'demo-user-001'")
        if cursor.fetchone()[0] > 0:
            conn.close()
            return

    # Clear existing demo user data if force
    cursor.execute("DELETE FROM holdings WHERE user_id = 'demo-user-001'")
    cursor.execute("DELETE FROM transactions WHERE user_id = 'demo-user-001'")
    cursor.execute("DELETE FROM goals WHERE user_id = 'demo-user-001'")
    cursor.execute("DELETE FROM portfolio_snapshots WHERE user_id = 'demo-user-001'")
    cursor.execute("DELETE FROM users WHERE id = 'demo-user-001'")

    # Insert Demo User
    cursor.execute("""
    INSERT OR REPLACE INTO users (id, email, name, password_hash, is_demo)
    VALUES ('demo-user-001', 'demo@zerolatency.invest', 'Alex Mercer', 'demo_hash_token_secure', 1)
    """)

    # Seed Master Assets
    assets_data = [
        # EQUITIES (52% Target ~ ₹4,38,100)
        ("EQ01", "NIFTYBEES", "Nippon India Nifty 50 ETF", "EQUITY", "Index ETF", "Broad Market",
         "Passive ETF tracking India's premier top 50 bluechip companies across financial services, IT, oil & gas, FMCG.", "Moderate", 1.2, "High", 262.50, 0.85),
        ("EQ02", "TCS", "Tata Consultancy Services (Demo)", "EQUITY", "Large Cap Tech", "Information Technology",
         "India's largest IT services exporter providing digital transformation, cloud, and engineering services globally.", "Moderate", 2.1, "High", 3890.00, -0.42),
        ("EQ03", "HDFCBANK", "HDFC Bank Ltd (Demo)", "EQUITY", "Private Bank", "Banking & Finance",
         "Leading private sector bank offering retail, corporate banking and treasury operations.", "Moderate", 1.1, "High", 1680.00, 1.15),
        ("EQ04", "RELIANCE", "Reliance Industries Ltd (Demo)", "EQUITY", "Conglomerate", "Energy & Telecom",
         "Diversified conglomerate spanning refining, petrochemicals, telecommunications (Jio) and retail.", "Moderate-High", 0.8, "High", 2940.00, 0.65),

        # BONDS (18% Target ~ ₹1,51,650)
        ("BD01", "GS2033-718", "7.18% GS 2033 Sovereign Bond", "BOND", "Government Securities", "Sovereign Debt",
         "10-year central government sovereign bond offering semi-annual coupon payments backed by the Reserve Bank of India.", "Low", 7.18, "Moderate", 101.40, 0.05),
        ("BD02", "NABARD-AAA", "NABARD 7.65% Infra Bond 2029", "BOND", "Public Financial Institution", "Development Finance",
         "AAA-rated institutional bond supporting rural agricultural infrastructure with steady fixed coupon income.", "Low", 7.65, "Moderate", 102.50, 0.02),
        ("BD03", "LT-DEB-2028", "L&T Finance 8.15% NCD 2028", "BOND", "Corporate Debt", "Financial Services",
         "High-rated corporate Non-Convertible Debenture providing higher yields with quarterly interest distribution.", "Moderate", 8.15, "Moderate-Low", 1005.00, -0.10),

        # REITS (15% Target ~ ₹1,26,375)
        ("RT01", "EMBASSY", "Embassy Office Parks REIT", "REIT", "Commercial Real Estate", "Real Estate Office Parks",
         "India's first publicly listed REIT owning and operating 45.4 msf of premier Grade-A commercial office space leased to top Fortune 500 multinationals.", "Moderate", 6.80, "Moderate", 375.00, 0.90),
        ("RT02", "MINDSPACE", "Mindspace Business Parks REIT", "REIT", "Commercial Tech Parks", "Real Estate Tech Parks",
         "Quality commercial business parks situated in key technology micro-markets like Mumbai, Hyderabad, Pune, and Chennai.", "Moderate", 6.95, "Moderate", 335.50, 0.45),
        ("RT03", "BROOKFIELD", "Brookfield India Real Estate Trust", "REIT", "Institutional Real Estate", "Real Estate Office Parks",
         "100% institutionally managed real estate investment trust with marquee multinational tenant leases.", "Moderate-High", 7.40, "Moderate", 265.00, -0.20),

        # INVITS (10% Target ~ ₹84,250)
        ("IN01", "PGINVIT", "PowerGrid Infrastructure Trust", "INVIT", "Power Transmission", "Infrastructure & Utilities",
         "Backed by Power Grid Corp, owns and operates 5 operational interstate power transmission projects with regulated stable cash flows.", "Moderate-Low", 10.40, "Moderate", 101.20, 0.30),
        ("IN02", "IRBINVIT", "IRB InvIT Fund", "INVIT", "Highways & Toll Roads", "Roads & Highways",
         "Infrastructure investment trust owning revenue-generating toll-road assets across national highway corridors.", "Moderate-High", 9.80, "Moderate-Low", 64.50, -0.75),

        # OTHER / CASH / TREASURY (5% Target ~ ₹42,125)
        ("OT01", "LIQUIDBEES", "Nippon India ETF Liquid BeES", "OTHER", "Money Market", "Cash Equivalents",
         "Daily dividend payout liquid ETF parking surplus funds in overnight collateralized borrowing & lending obligations.", "Very Low", 6.20, "High", 1000.00, 0.01)
    ]

    for item in assets_data:
        cursor.execute("""
        INSERT OR REPLACE INTO assets 
        (id, symbol, name, asset_type, category, sector, description, risk_level, annual_yield, liquidity_score, price, change_24h)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, item)

    # Seed Holdings to closely achieve:
    # Total Invested: ₹7,95,000, Total Value: ₹8,42,500, Unrealized P/L: ₹47,500 (+5.97%)
    # Equities: ~₹4,38,100 (52%)
    # Bonds:    ~₹1,51,650 (18%)
    # REITs:    ~₹1,26,375 (15%)
    # InvITs:   ~₹84,250  (10%)
    # Other:    ~₹42,125  (5%)
    holdings_data = [
        # (id, user_id, asset_id, source, units, avg_buy_price, current_price)
        # EQUITIES total: 175,875 + 116,700 + 84,000 + 61,740 = 438,315 (~52%)
        ("H01", "demo-user-001", "EQ01", "Broker A", 670, 248.00, 262.50),  # Buy: 166,160 -> Cur: 175,875 (P/L: +9,715)
        ("H02", "demo-user-001", "EQ02", "Broker B", 30, 3720.00, 3890.00), # Buy: 111,600 -> Cur: 116,700 (P/L: +5,100)
        ("H03", "demo-user-001", "EQ03", "Depository", 50, 1610.00, 1680.00),# Buy: 80,500 -> Cur: 84,000 (P/L: +3,500)
        ("H04", "demo-user-001", "EQ04", "Broker A", 21, 2810.00, 2940.00), # Buy: 59,010 -> Cur: 61,740 (P/L: +2,730)

        # BONDS total: 70,980 + 51,250 + 30,150 = 152,380 (~18%)
        ("H05", "demo-user-001", "BD01", "Depository", 700, 99.80, 101.40), # Buy: 69,860 -> Cur: 70,980 (P/L: +1,120)
        ("H06", "demo-user-001", "BD02", "Broker B", 500, 100.50, 102.50),  # Buy: 50,250 -> Cur: 51,250 (P/L: +1,000)
        ("H07", "demo-user-001", "BD03", "Imported CSV", 30, 980.00, 1005.00),# Buy: 29,400 -> Cur: 30,150 (P/L: +750)

        # REITS total: 60,000 + 40,260 + 25,175 = 125,435 (~14.9%)
        ("H08", "demo-user-001", "RT01", "Broker A", 160, 342.00, 375.00),  # Buy: 54,720 -> Cur: 60,000 (P/L: +5,280)
        ("H09", "demo-user-001", "RT02", "Broker B", 120, 310.00, 335.50),  # Buy: 37,200 -> Cur: 40,260 (P/L: +3,060)
        ("H10", "demo-user-001", "RT03", "Imported CSV", 95, 245.00, 265.00),# Buy: 23,275 -> Cur: 25,175 (P/L: +1,900)

        # INVITS total: 50,600 + 33,540 = 84,140 (~10%)
        ("H11", "demo-user-001", "IN01", "Broker A", 500, 93.50, 101.20),   # Buy: 46,750 -> Cur: 50,600 (P/L: +3,850)
        ("H12", "demo-user-001", "IN02", "Depository", 520, 59.00, 64.50),  # Buy: 30,680 -> Cur: 33,540 (P/L: +2,860)

        # OTHER / CASH total: 42,230 (~5%)
        # Total Cur: 438,315 + 152,380 + 125,435 + 84,140 + 42,230 = 842,500!
        # Total Buy: 417,270 + 149,510 + 115,195 + 77,430 + 35,595 = 795,000!
        # P/L: 842,500 - 795,000 = +47,500! Matches problem prompt exactly!
        ("H13", "demo-user-001", "OT01", "Broker A", 42.23, 842.88, 1000.00) # Buy: 35,595 -> Cur: 42,230 (P/L: +6,635)
    ]

    for h in holdings_data:
        cursor.execute("""
        INSERT INTO holdings (id, user_id, asset_id, source, units, avg_buy_price, current_price)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, h)

    # Seed Transactions
    transactions_data = [
        ("T01", "demo-user-001", "RT01", "DISTRIBUTION", 160, 5.25, 840.0, "2026-09-18", "Broker A"),
        ("T02", "demo-user-001", "BD01", "INTEREST", 700, 3.59, 2513.0, "2026-09-15", "Depository"),
        ("T03", "demo-user-001", "IN01", "DISTRIBUTION", 500, 3.10, 1550.0, "2026-09-02", "Broker A"),
        ("T04", "demo-user-001", "EQ02", "DIVIDEND", 30, 28.0, 840.0, "2026-08-24", "Broker B"),
        ("T05", "demo-user-001", "EQ01", "BUY", 100, 252.0, 25200.0, "2026-08-10", "Broker A"),
        ("T06", "demo-user-001", "RT02", "DISTRIBUTION", 120, 4.80, 576.0, "2026-07-28", "Broker B")
    ]
    for t in transactions_data:
        cursor.execute("""
        INSERT INTO transactions (id, user_id, asset_id, type, units, price, amount, date, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, t)

    # Seed Goals
    goals_data = [
        ("G01", "demo-user-001", "Emergency Liquidity Buffer", "Emergency", 250000.0, 210000.0, "6 Months", "shield-check"),
        ("G02", "demo-user-001", "Nordic Winter Expedition", "Travel", 180000.0, 125000.0, "12 Months", "plane"),
        ("G03", "demo-user-001", "Executive Masters / Upskilling", "Education", 500000.0, 280000.0, "24 Months", "graduation-cap"),
        ("G04", "demo-user-001", "Apartment Down Payment", "Home", 1500000.0, 550000.0, "36 Months", "home"),
        ("G05", "demo-user-001", "Long-Term Passive Income Stash", "Retirement", 2500000.0, 842500.0, "60 Months", "trending-up")
    ]
    for g in goals_data:
        cursor.execute("""
        INSERT INTO goals (id, user_id, title, category, target_amount, current_amount, time_period, icon)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, g)

    # Seed 12-Month Portfolio Historical Performance Snapshots
    historical_snapshots = [
        ("S01", "demo-user-001", "Oct 2025", 720000, 710000, 360000, 140000, 110000, 75000, 35000),
        ("S02", "demo-user-001", "Nov 2025", 735000, 720000, 372000, 142000, 112000, 74000, 35000),
        ("S03", "demo-user-001", "Dec 2025", 748000, 730000, 381000, 143000, 114000, 74500, 35500),
        ("S04", "demo-user-001", "Jan 2026", 759000, 745000, 390000, 145000, 115000, 73000, 36000),
        ("S05", "demo-user-001", "Feb 2026", 745000, 750000, 378000, 146000, 113000, 72000, 36000),
        ("S06", "demo-user-001", "Mar 2026", 768000, 760000, 395000, 147000, 116000, 73500, 36500),
        ("S07", "demo-user-001", "Apr 2026", 782000, 768000, 404000, 148000, 118000, 75000, 37000),
        ("S08", "demo-user-001", "May 2026", 796000, 775000, 412000, 149000, 120000, 77000, 38000),
        ("S09", "demo-user-001", "Jun 2026", 808000, 780000, 418000, 150000, 121000, 79000, 40000),
        ("S10", "demo-user-001", "Jul 2026", 821000, 786000, 426000, 150500, 123000, 81000, 40500),
        ("S11", "demo-user-001", "Aug 2026", 830000, 790000, 431000, 151200, 124500, 82500, 40800),
        ("S12", "demo-user-001", "Sep 2026", 842500, 795000, 438315, 152380, 125435, 84140, 42230)
    ]
    for s in historical_snapshots:
        cursor.execute("""
        INSERT INTO portfolio_snapshots (id, user_id, date, total_value, invested_value, equity_val, bond_val, reit_val, invit_val, other_val)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, s)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    seed_demo_data(force=True)
    print("Database initialized & seeded successfully!")
