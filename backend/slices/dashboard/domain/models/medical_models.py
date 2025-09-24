"""
Dashboard domain models - ONLY dashboard-specific models
Medical entity models (medications, allergies, surgeries, illnesses)
are now in their respective dedicated slices following DEV_CONTEXT.md
"""
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from shared.database.database import Base


class DashboardActivityLog(Base):
    """Dashboard activity logs with BIGSERIAL for high frequency operations"""

    __tablename__ = "dashboard_activity_logs"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(BigInteger, nullable=True)  # References medical table IDs
    details = Column(Text, nullable=True)  # JSON-like string for additional data
    ip_address = Column(String(45), nullable=True)  # Support IPv6
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    user = relationship("User", backref="dashboard_activities")

    def __repr__(self):
        return f"<DashboardActivityLog(id={self.id}, action='{self.action}', resource_type='{self.resource_type}')>"