from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, TokenResponse, RefreshTokenRequest
from app.services.auth_service import register_user, login_user, refresh_tokens

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account."""
    return register_user(db, user_data)


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login with email and password."""
    return login_user(db, credentials)


@router.post("/refresh", response_model=TokenResponse)
def refresh(body: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Refresh access token using a valid refresh token."""
    return refresh_tokens(db, body.refresh_token)


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout():
    """Logout — client should discard tokens."""
    return {"message": "Logged out successfully"}
