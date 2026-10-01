from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class DBUser(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_demo = Column(Integer, default=0)
    email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class DBAsset(Base):
    __tablename__ = "assets"

    id = Column(String(64), primary_key=True, index=True)
    symbol = Column(String(32), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    asset_type = Column(String(32), nullable=False)  # EQUITY, BOND, REIT, INVIT, OTHER
    category = Column(String(64), nullable=True)
    sector = Column(String(64), nullable=True)
    description = Column(Text, nullable=True)
    risk_level = Column(String(32), nullable=True)
    annual_yield = Column(Float, default=0.0)
    liquidity_score = Column(String(32), nullable=True)
    price = Column(Float, nullable=False)
    change_24h = Column(Float, default=0.0)

class DBHolding(Base):
    __tablename__ = "holdings"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    asset_id = Column(String(64), ForeignKey("assets.id"), nullable=False, index=True)
    source = Column(String(64), nullable=False)
    units = Column(Float, nullable=False)
    avg_buy_price = Column(Float, nullable=False)
    current_price = Column(Float, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow)

class DBTransaction(Base):
    __tablename__ = "transactions"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    asset_id = Column(String(64), ForeignKey("assets.id"), nullable=False, index=True)
    type = Column(String(32), nullable=False)  # BUY, SELL, DIVIDEND, INTEREST, DISTRIBUTION
    units = Column(Float, nullable=True)
    price = Column(Float, nullable=True)
    amount = Column(Float, nullable=False)
    date = Column(String(32), nullable=False)
    source = Column(String(64), nullable=False)

class DBGoal(Base):
    __tablename__ = "goals"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(64), nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, nullable=False)
    time_period = Column(String(64), nullable=False)
    icon = Column(String(64), default="target")
    created_at = Column(DateTime, default=datetime.utcnow)

class DBPortfolioSnapshot(Base):
    __tablename__ = "portfolio_snapshots"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    date = Column(String(32), nullable=False)
    total_value = Column(Float, nullable=False)
    invested_value = Column(Float, nullable=False)
    equity_val = Column(Float, nullable=False)
    bond_val = Column(Float, nullable=False)
    reit_val = Column(Float, nullable=False)
    invit_val = Column(Float, nullable=False)
    other_val = Column(Float, nullable=False)

class DBRefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    token_hash = Column(String(255), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class DBPasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    token = Column(String(255), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class DBEmailVerificationToken(Base):
    __tablename__ = "email_verification_tokens"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    token = Column(String(255), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class DBWatchlist(Base):
    __tablename__ = "watchlists"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    asset_id = Column(String(64), ForeignKey("assets.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class DBPaperAccount(Base):
    __tablename__ = "paper_accounts"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), unique=True, nullable=False, index=True)
    cash_balance = Column(Float, default=1000000.0)  # Default simulated ₹10,00,000
    currency = Column(String(8), default="INR")
    updated_at = Column(DateTime, default=datetime.utcnow)

class DBPaperOrder(Base):
    __tablename__ = "paper_orders"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    asset_id = Column(String(64), ForeignKey("assets.id"), nullable=False, index=True)
    order_type = Column(String(16), nullable=False)  # BUY or SELL
    units = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String(32), default="FILLED")
    created_at = Column(DateTime, default=datetime.utcnow)

class DBAuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), nullable=True, index=True)
    action = Column(String(128), nullable=False)
    ip_address = Column(String(64), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(Text, nullable=True)
