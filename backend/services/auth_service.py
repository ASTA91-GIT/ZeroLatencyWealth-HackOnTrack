import os
import uuid
import hashlib
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Tuple
import argon2
from sqlalchemy.orm import Session

from backend.database import SessionLocal, seed_demo_data
from backend.db_models import (
    DBUser, DBRefreshToken, DBPasswordResetToken, DBEmailVerificationToken,
    DBPaperAccount, DBAuditLog
)
from backend.models import UserProfile, AuthResponse
from backend.services.email_service import EmailService, REQUIRE_EMAIL_VERIFICATION

ph = argon2.PasswordHasher(
    time_cost=3,
    memory_cost=65536,
    parallelism=4,
    hash_len=32,
    type=argon2.Type.ID
)

JWT_SECRET = os.getenv("JWT_SECRET", "zerolatency-production-secret-key-32981-sec")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120")) # 2 hours
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "14")) # 14 days

def hash_password(password: str) -> str:
    """Hash password using Argon2id algorithm."""
    return ph.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against stored hash with Argon2id and fallback for legacy sha256."""
    if not hashed_password:
        return False
    if hashed_password.startswith("$argon2"):
        try:
            return ph.verify(hashed_password, plain_password)
        except Exception:
            return False
    # Legacy SHA-256 fallback (e.g. from initial hackathon demo or tests)
    legacy_hash = hashlib.sha256(plain_password.encode()).hexdigest()
    if legacy_hash == hashed_password:
        return True
    return False

def create_access_token(user_id: str, email: str, is_demo: bool = False) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "is_demo": is_demo,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "iat": datetime.utcnow(),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    db: Session = SessionLocal()
    try:
        raw_token = uuid.uuid4().hex + uuid.uuid4().hex
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        expires_at = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

        db_ref = DBRefreshToken(
            id=f"RT_{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at,
            revoked=False
        )
        db.add(db_ref)
        db.commit()
        return raw_token
    finally:
        db.close()

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate a JWT access token."""
    try:
        if token.startswith("Bearer "):
            token = token[7:]
        # Special handling for hackathon demo token
        if token == "demo_jwt_token_session_zerolatency_9981":
            return {"sub": "demo-user-001", "email": "demo@zerolatency.invest", "is_demo": True}
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except Exception:
        return None

def get_demo_user() -> AuthResponse:
    """Provide the canonical 1-click Demo Account loaded with realistic multi-asset data."""
    db: Session = SessionLocal()
    try:
        demo = db.query(DBUser).filter(DBUser.id == "demo-user-001").first()
        if not demo:
            seed_demo_data(force=True)
            demo = db.query(DBUser).filter(DBUser.id == "demo-user-001").first()

        user_profile = UserProfile(
            id="demo-user-001",
            name=demo.name if demo else "Alex Mercer",
            email=demo.email if demo else "demo@zerolatency.invest",
            is_demo=True,
            created_at=str(demo.created_at) if demo else None
        )
        token = create_access_token("demo-user-001", "demo@zerolatency.invest", is_demo=True)
        return AuthResponse(
            token=token,
            user=user_profile,
            message="Logged in as Demo User with pre-loaded multi-asset benchmark portfolio."
        )
    finally:
        db.close()

def authenticate_user(email: str, password: str, ip_address: Optional[str] = None) -> Optional[Tuple[AuthResponse, str]]:
    """Authenticate user with Argon2id verification, session generation, and audit logging."""
    email_clean = email.strip().lower()
    if email_clean in ("demo@zerolatency.invest", "demo") and password in ("demo", "demo_hash_token_secure", "AlexMercer123!"):
        res = get_demo_user()
        return res, "demo_refresh_token"

    db: Session = SessionLocal()
    try:
        user = db.query(DBUser).filter(DBUser.email == email_clean).first()
        if not user:
            return None

        if not verify_password(password, user.password_hash):
            return None

        # Rehash with Argon2id if was legacy hash
        if not user.password_hash.startswith("$argon2"):
            user.password_hash = hash_password(password)
            db.commit()

        # Audit log
        db.add(DBAuditLog(
            id=f"LOG_{uuid.uuid4().hex[:8]}",
            user_id=user.id,
            action="LOGIN_SUCCESS",
            ip_address=ip_address
        ))
        db.commit()

        access_token = create_access_token(user.id, user.email, is_demo=bool(user.is_demo))
        refresh_token = create_refresh_token(user.id)

        user_profile = UserProfile(
            id=user.id,
            name=user.name,
            email=user.email,
            is_demo=bool(user.is_demo),
            created_at=str(user.created_at)
        )

        return AuthResponse(
            token=access_token,
            user=user_profile,
            message="Authentication successful."
        ), refresh_token
    finally:
        db.close()

def register_user(name: str, email: str, password: str, ip_address: Optional[str] = None) -> Tuple[Optional[AuthResponse], Optional[str], Optional[str]]:
    """Register new user with Argon2id hashing, initial paper trading wallet, and email dispatch."""
    email_clean = email.strip().lower()
    db: Session = SessionLocal()
    try:
        existing = db.query(DBUser).filter(DBUser.email == email_clean).first()
        if existing:
            return None, None, "An account with this email address already exists."

        user_id = f"USR_{uuid.uuid4().hex[:8]}"
        pw_hash = hash_password(password)

        new_user = DBUser(
            id=user_id,
            email=email_clean,
            name=name.strip(),
            password_hash=pw_hash,
            is_demo=0,
            email_verified=not REQUIRE_EMAIL_VERIFICATION
        )
        db.add(new_user)

        # Initialize simulated paper trading account with ₹10,00,000 cash balance
        paper_acc = DBPaperAccount(
            id=f"PA_{user_id}",
            user_id=user_id,
            cash_balance=1000000.0,
            currency="INR"
        )
        db.add(paper_acc)

        # Audit log
        db.add(DBAuditLog(
            id=f"LOG_{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            action="USER_REGISTERED",
            ip_address=ip_address
        ))
        db.commit()

        # Generate email verification token if needed
        verify_token_str = uuid.uuid4().hex
        if REQUIRE_EMAIL_VERIFICATION:
            db.add(DBEmailVerificationToken(
                id=f"VT_{uuid.uuid4().hex[:8]}",
                user_id=user_id,
                token=verify_token_str,
                expires_at=datetime.utcnow() + timedelta(days=2),
                used=False
            ))
            db.commit()
            EmailService.send_verification_email(email_clean, name, verify_token_str)
        else:
            EmailService.send_welcome_email(email_clean, name)

        access_token = create_access_token(user_id, email_clean, is_demo=False)
        refresh_token = create_refresh_token(user_id)

        user_profile = UserProfile(
            id=user_id,
            name=name.strip(),
            email=email_clean,
            is_demo=False,
            created_at=str(new_user.created_at)
        )

        return AuthResponse(
            token=access_token,
            user=user_profile,
            message="Account created successfully. Welcome to ZeroLatency Wealth."
        ), refresh_token, None
    finally:
        db.close()

def refresh_user_token(refresh_token: str) -> Optional[Tuple[str, str]]:
    """Rotate and refresh JWT access token using valid refresh token."""
    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    db: Session = SessionLocal()
    try:
        ref = db.query(DBRefreshToken).filter(
            DBRefreshToken.token_hash == token_hash,
            DBRefreshToken.revoked == False,
            DBRefreshToken.expires_at > datetime.utcnow()
        ).first()

        if not ref:
            return None

        # Revoke old refresh token (Token Rotation)
        ref.revoked = True
        db.commit()

        user = db.query(DBUser).filter(DBUser.id == ref.user_id).first()
        if not user:
            return None

        new_access = create_access_token(user.id, user.email, is_demo=bool(user.is_demo))
        new_refresh = create_refresh_token(user.id)
        return new_access, new_refresh
    finally:
        db.close()

def request_password_reset(email: str) -> bool:
    """Initiate secure password reset token without email enumeration."""
    email_clean = email.strip().lower()
    db: Session = SessionLocal()
    try:
        user = db.query(DBUser).filter(DBUser.email == email_clean).first()
        if not user:
            # Do not leak whether user exists (Requirement #7)
            return True

        reset_token = uuid.uuid4().hex
        db.add(DBPasswordResetToken(
            id=f"PR_{uuid.uuid4().hex[:8]}",
            user_id=user.id,
            token=reset_token,
            expires_at=datetime.utcnow() + timedelta(hours=1),
            used=False
        ))
        db.commit()

        EmailService.send_password_reset_email(user.email, user.name, reset_token)
        return True
    finally:
        db.close()

def reset_password_with_token(token: str, new_password: str) -> Tuple[bool, str]:
    """Reset user password with token using Argon2id."""
    db: Session = SessionLocal()
    try:
        reset_rec = db.query(DBPasswordResetToken).filter(
            DBPasswordResetToken.token == token,
            DBPasswordResetToken.used == False,
            DBPasswordResetToken.expires_at > datetime.utcnow()
        ).first()

        if not reset_rec:
            return False, "Password reset link is invalid or has expired."

        user = db.query(DBUser).filter(DBUser.id == reset_rec.user_id).first()
        if not user:
            return False, "User not found."

        user.password_hash = hash_password(new_password)
        reset_rec.used = True

        # Revoke all existing refresh tokens for security
        db.query(DBRefreshToken).filter(DBRefreshToken.user_id == user.id).update({"revoked": True})

        db.add(DBAuditLog(
            id=f"LOG_{uuid.uuid4().hex[:8]}",
            user_id=user.id,
            action="PASSWORD_RESET_SUCCESS"
        ))
        db.commit()

        EmailService.send_security_alert(user.email, user.name, "Your password was successfully updated.")
        return True, "Password has been successfully reset. You may now log in."
    finally:
        db.close()

def verify_email_token(token: str) -> Tuple[bool, str]:
    """Verify user email address using token."""
    db: Session = SessionLocal()
    try:
        rec = db.query(DBEmailVerificationToken).filter(
            DBEmailVerificationToken.token == token,
            DBEmailVerificationToken.used == False,
            DBEmailVerificationToken.expires_at > datetime.utcnow()
        ).first()

        if not rec:
            return False, "Verification token is invalid or expired."

        user = db.query(DBUser).filter(DBUser.id == rec.user_id).first()
        if not user:
            return False, "User not found."

        user.email_verified = True
        rec.used = True
        db.commit()

        return True, "Email address has been successfully verified! You may now access Wealth OS."
    finally:
        db.close()

def get_user_profile_by_id(user_id: str) -> Optional[UserProfile]:
    """Retrieve user profile strictly isolated by user ID."""
    db: Session = SessionLocal()
    try:
        user = db.query(DBUser).filter(DBUser.id == user_id).first()
        if not user:
            return None
        return UserProfile(
            id=user.id,
            name=user.name,
            email=user.email,
            is_demo=bool(user.is_demo),
            created_at=str(user.created_at)
        )
    finally:
        db.close()
