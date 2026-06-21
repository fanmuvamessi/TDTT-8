from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.core.security import get_current_user
from backend.core.all_models import User
from backend.modules.reports import schemas, services
from typing import List, Optional

router = APIRouter(tags=["Reports"])

@router.post(
    "/reports",
    response_model=schemas.ReportResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a new report",
    description="Allows authenticated users to submit a new report against a user, merchant, post, or reel."
)
def submit_report(
    report_data: schemas.ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return services.create_report(db=db, report_data=report_data, reporter_id=current_user.id)

@router.get(
    "/admin/reports",
    response_model=List[schemas.ReportResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all reports (Admin)",
    description="Retrieve a list of all reports, with optional filtering by status and entity type. Accessible only to admin users."
)
def get_all_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status_filter: Optional[str] = None,
    entity_type_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can access this resource."
        )
    return services.get_reports(db=db, status_filter=status_filter, entity_type_filter=entity_type_filter, skip=skip, limit=limit)

@router.get(
    "/admin/reports/{report_id}",
    response_model=schemas.ReportResponse,
    status_code=status.HTTP_200_OK,
    summary="Get report by ID (Admin)",
    description="Retrieve details of a specific report by its ID. Accessible only to admin users."
)
def get_single_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can access this resource."
        )
    return services.get_report_by_id(db=db, report_id=report_id)

@router.put(
    "/admin/reports/{report_id}/status",
    response_model=schemas.ReportResponse,
    status_code=status.HTTP_200_OK,
    summary="Update report status (Admin)",
    description="Update the status of a specific report. Accessible only to admin users."
)
def update_report_status_endpoint(
    report_id: str,
    new_status: schemas.ReportUpdateStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can access this resource."
        )
    return services.update_report_status(db=db, report_id=report_id, new_status=new_status)
