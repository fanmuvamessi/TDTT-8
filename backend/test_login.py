import os
import sys

# Configure sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if current_dir not in sys.path:
    sys.path.append(current_dir)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

from backend.core.database import SessionLocal
from backend.modules.identity.schemas import LoginRequest
from backend.modules.identity.services import login_user

def test():
    db = SessionLocal()
    
    print("\n--- TEST 1: Login with Non-existent Account ---")
    try:
        data = LoginRequest(
            email="nonexistent_account@foodreview.com",
            password="any_password"
        )
        login_user(db=db, data=data)
    except Exception as e:
        print("RESULT OF TEST 1:", type(e), str(e))
        
    print("\n--- TEST 2: Login with Seeded Account (Wrong Password / Not on Firebase) ---")
    try:
        data = LoginRequest(
            email="reviewer1@foodreview.com",
            password="wrong_password"
        )
        login_user(db=db, data=data)
    except Exception as e:
        print("RESULT OF TEST 2:", type(e), str(e))
        
    db.close()

if __name__ == "__main__":
    test()
