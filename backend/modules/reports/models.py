from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.core.database import Base
import uuid

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    reported_entity_type = Column(String, nullable=False, index=True) # 'user', 'merchant', 'post', 'reel'
    reported_entity_id = Column(String, nullable=False, index=True) # UUID of the reported entity
    reason = Column(String, nullable=False)
    status = Column(String, default="pending", nullable=False, index=True) # 'pending', 'under_review', 'resolved', 'rejected'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    reporter = relationship("User")