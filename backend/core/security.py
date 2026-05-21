from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.core.all_models import User

def get_current_user(
    authorization: str = Header(None),
    x_user_id: int = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user.
    Supports JWT Token parsing (placeholder for BE1 implementation).
    Fallbacks to 'x-user-id' header or the first user in the database (for ease of local testing).
    """
    # 1. JWT Placeholder / Authorization Header check
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        # In a real setup, we would decode the JWT here:
        # payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # user_id = payload.get("sub")
        # For mock, let's treat the token as a stringified user ID if it is numeric
        if token.isdigit():
            user = db.query(User).filter(User.id == int(token)).first()
            if user:
                return user
            
    # 2. Custom header fallback for easy postman / frontend manual testing
    if x_user_id is not None:
        user = db.query(User).filter(User.id == x_user_id).first()
        if user:
            return user
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"User with ID {x_user_id} not found in database. Please seed the DB first."
        )

    # 3. Default fallback to the first user in database (so APIs don't fail when no headers are supplied in local dev)
    default_user = db.query(User).first()
    if default_user:
        return default_user
        
    # If no users exist, raise 401
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No users found in database. Please run the seed script: python seed.py"
    )
