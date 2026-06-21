from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend.modules.reports.models import Report
from backend.modules.reports.schemas import ReportCreate, ReportUpdateStatus
from backend.core.all_models import User, Merchant, Video # Assuming these are the reportable entities
from typing import Optional, List

def create_report(db: Session, report_data: ReportCreate, reporter_id: int):
    # Validate reported_entity_type and reported_entity_id
    if report_data.reported_entity_type == "user":
        entity = db.query(User).filter(User.id == report_data.reported_entity_id).first()
    elif report_data.reported_entity_type == "merchant":
        entity = db.query(Merchant).filter(Merchant.id == report_data.reported_entity_id).first()
    elif report_data.reported_entity_type == "post" or report_data.reported_entity_type == "reel": # Assuming 'post' and 'reel' refer to Video model
        entity = db.query(Video).filter(Video.id == report_data.reported_entity_id).first()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reported_entity_type"
        )

    if not entity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{report_data.reported_entity_type.capitalize()} with ID {report_data.reported_entity_id} not found."
        )

    db_report = Report(
        reporter_id=reporter_id,
        reported_entity_type=report_data.reported_entity_type,
        reported_entity_id=report_data.reported_entity_id,
        reason=report_data.reason
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def get_reports(
    db: Session,
    status_filter: Optional[str] = None,
    entity_type_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Report]:
    query = db.query(Report)
    if status_filter:
        query = query.filter(Report.status == status_filter)
    if entity_type_filter:
        query = query.filter(Report.reported_entity_type == entity_type_filter)
    return query.offset(skip).limit(limit).all()

def get_report_by_id(db: Session, report_id: str) -> Report:
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID {report_id} not found."
        )
    return report

def update_report_status(db: Session, report_id: str, new_status: ReportUpdateStatus) -> Report:
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID {report_id} not found."
        )
    
    # Validate status transition if needed (e.g., cannot go from resolved to pending)
    valid_statuses = ["pending", "under_review", "resolved", "rejected"]
    if new_status.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status: {new_status.status}. Valid statuses are: {', '.join(valid_statuses)}"
        )

    report.status = new_status.status
    db.commit()
    db.refresh(report)
    return report
