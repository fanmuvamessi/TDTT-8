import math
from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from backend.core.config import settings

# Config database URL, fallback to sqlite for local testing
DATABASE_URL = settings.DATABASE_URL

# SQLite needs some special configurations
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define SQLite math functions mapping so the Haversine SQL formula runs flawlessly on both SQLite and Postgres
def sqlite_radians(x):
    return math.radians(x) if x is not None else None

def sqlite_cos(x):
    return math.cos(x) if x is not None else None

def sqlite_sin(x):
    return math.sin(x) if x is not None else None

def sqlite_acos(x):
    if x is None:
        return None
    try:
        return math.acos(x)
    except ValueError:
        # Prevent math domain error for values slightly outside [-1.0, 1.0] due to float precision
        if x > 1.0:
            return 0.0
        if x < -1.0:
            return math.pi
        return 0.0

@event.listens_for(engine, "connect")
def connect(dbapi_connection, connection_record):
    # Register functions only if the underlying connection supports create_function (SQLite)
    if hasattr(dbapi_connection, "create_function"):
        dbapi_connection.create_function("radians", 1, sqlite_radians)
        dbapi_connection.create_function("cos", 1, sqlite_cos)
        dbapi_connection.create_function("sin", 1, sqlite_sin)
        dbapi_connection.create_function("acos", 1, sqlite_acos)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
