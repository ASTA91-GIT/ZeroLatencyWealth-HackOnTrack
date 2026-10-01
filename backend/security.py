import time
import logging
from collections import defaultdict
from typing import Optional, Dict, Tuple
from fastapi import Request, HTTPException, Header, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from backend.services.auth_service import decode_access_token, get_user_profile_by_id
from backend.models import UserProfile

logger = logging.getLogger("zerolatency.security")

class RateLimiter:
    """Sliding window in-memory rate limiter per IP/client."""
    def __init__(self):
        # key -> list of timestamps
        self.windows: Dict[str, list] = defaultdict(list)

    def check(self, key: str, max_requests: int, window_seconds: int = 60) -> bool:
        now = time.time()
        # Clean older timestamps
        cutoff = now - window_seconds
        self.windows[key] = [t for t in self.windows[key] if t > cutoff]

        if len(self.windows[key]) >= max_requests:
            return False

        self.windows[key].append(now)
        return True

rate_limiter = RateLimiter()

def check_rate_limit(request: Request, max_requests: int = 20, window_seconds: int = 60, bucket: str = "general"):
    client_ip = request.client.host if request.client else "unknown"
    key = f"{bucket}:{client_ip}"
    if not rate_limiter.check(key, max_requests=max_requests, window_seconds=window_seconds):
        logger.warning(f"Rate limit exceeded for {key}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded for {bucket}. Please slow down and try again shortly."
        )

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

def get_current_authenticated_user(authorization: Optional[str] = Header(None)) -> UserProfile:
    """Strictly authenticate user from JWT Bearer token. User data isolation requirement."""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to access this resource."
        )

    token = authorization
    if token.startswith("Bearer "):
        token = token[7:]

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired or credentials are invalid. Please log in again."
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token payload."
        )

    # In demo mode, return demo user
    if user_id == "demo-user-001":
        return UserProfile(
            id="demo-user-001",
            name="Alex Mercer",
            email="demo@zerolatency.invest",
            is_demo=True
        )

    profile = get_user_profile_by_id(user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account associated with this session no longer exists."
        )

    return profile

def get_optional_user(authorization: Optional[str] = Header(None)) -> Optional[UserProfile]:
    """Extract authenticated user if token present, or None for public visitors."""
    if not authorization:
        return None
    try:
        return get_current_authenticated_user(authorization)
    except HTTPException:
        return None
