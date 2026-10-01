import uuid
import hashlib
from typing import Optional
from backend.database import get_connection
from backend.models import UserProfile, AuthResponse

def hash_pw(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def get_demo_user() -> AuthResponse:
    # Always ensure demo user is seeded
    conn = get_connection()
    cursor = conn.cursor()
    row = cursor.execute("SELECT * FROM users WHERE id = 'demo-user-001'").fetchone()
    conn.close()

    if not row:
        from backend.database import seed_demo_data
        seed_demo_data(force=True)
        conn = get_connection()
        row = conn.cursor().execute("SELECT * FROM users WHERE id = 'demo-user-001'").fetchone()
        conn.close()

    user = UserProfile(
        id="demo-user-001",
        name=row["name"] if row else "Alex Mercer",
        email=row["email"] if row else "demo@zerolatency.invest",
        is_demo=True,
        created_at=row["created_at"] if row else None
    )

    return AuthResponse(
        token="demo_jwt_token_session_zerolatency_9981",
        user=user,
        message="Logged in as Demo User with pre-loaded multi-asset portfolio."
    )

def authenticate_user(email: str, password: str) -> Optional[AuthResponse]:
    if email == "demo@zerolatency.invest" or email == "demo":
        return get_demo_user()

    conn = get_connection()
    cursor = conn.cursor()
    row = cursor.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()

    if not row:
        return None

    pw_hash = hash_pw(password)
    if row["password_hash"] != pw_hash:
        return None

    user = UserProfile(
        id=row["id"],
        name=row["name"],
        email=row["email"],
        is_demo=bool(row["is_demo"]),
        created_at=row["created_at"]
    )
    return AuthResponse(
        token=f"jwt_{uuid.uuid4().hex}",
        user=user,
        message="Authentication successful."
    )

def register_user(name: str, email: str, password: str) -> Optional[AuthResponse]:
    conn = get_connection()
    cursor = conn.cursor()

    existing = cursor.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
    if existing:
        conn.close()
        return None

    user_id = f"USR_{uuid.uuid4().hex[:8]}"
    pw_hash = hash_pw(password)
    cursor.execute("""
    INSERT INTO users (id, email, name, password_hash, is_demo)
    VALUES (?, ?, ?, ?, 0)
    """, (user_id, email, name, pw_hash))
    conn.commit()
    conn.close()

    user = UserProfile(
        id=user_id,
        name=name,
        email=email,
        is_demo=False
    )
    return AuthResponse(
        token=f"jwt_{uuid.uuid4().hex}",
        user=user,
        message="Registration successful. Welcome to ZeroLatency Wealth."
    )
