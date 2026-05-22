from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException, status
from typing import List, Optional
from backend.core.all_models import Like, Comment, Video, Merchant
from backend.modules.search_interact.schemas import LikeToggleResponse, CommentCreate

def toggle_like(db: Session, video_id: int, user_id: int) -> LikeToggleResponse:
    # 1. Verify video exists
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Video with ID {video_id} does not exist"
        )

    # 2. Check if already liked
    existing_like = db.query(Like).filter(Like.video_id == video_id, Like.user_id == user_id).first()
    
    if existing_like:
        # Unlike
        db.delete(existing_like)
        db.commit()
        liked = False
        message = "Unliked video successfully"
    else:
        # Like
        new_like = Like(video_id=video_id, user_id=user_id)
        db.add(new_like)
        db.commit()
        liked = True
        message = "Liked video successfully"

    # 3. Get total likes count
    likes_count = db.query(Like).filter(Like.video_id == video_id).count()

    return LikeToggleResponse(
        liked=liked,
        likes_count=likes_count,
        message=message
    )

def create_comment(db: Session, video_id: int, user_id: int, comment_data: CommentCreate) -> Comment:
    # 1. Verify video exists
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Video with ID {video_id} does not exist"
        )

    # 2. Verify parent comment if parent_id is supplied
    if comment_data.parent_id is not None:
        parent_comment = db.query(Comment).filter(Comment.id == comment_data.parent_id).first()
        if not parent_comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Parent comment with ID {comment_data.parent_id} does not exist"
            )
        if parent_comment.video_id != video_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Parent comment must belong to the same video"
            )

    # 3. Create comment
    new_comment = Comment(
        user_id=user_id,
        video_id=video_id,
        content=comment_data.content,
        parent_id=comment_data.parent_id
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

def get_video_comments(db: Session, video_id: int) -> List[Comment]:
    # Verify video exists
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Video with ID {video_id} does not exist"
        )
        
    # Return flat list of comments sorted by created_at ascending (oldest first for natural conversation reading)
    return db.query(Comment).filter(Comment.video_id == video_id).order_by(Comment.created_at.asc()).all()

def geo_search_merchants(
    db: Session,
    q: Optional[str],
    lat: float,
    lng: float,
    radius: float,
    limit: int,
    offset: int
) -> List[dict]:
    """
    Search merchants using Haversine formula on SQL.
    Dialect-aware for both SQLite and PostgreSQL.
    """
    # Define Case Insensitivity Operator based on Dialect
    dialect = db.bind.dialect.name
    like_op = "ILIKE" if dialect == "postgresql" else "LIKE"
    
    # Base parts of SQL query
    if q and q.strip():
        search_pattern = f"%{q.strip()}%"
        filter_clause = f"(name {like_op} :q OR description {like_op} :q)"
    else:
        search_pattern = "%"
        filter_clause = "1=1"

    # Haversine distance subquery in SQL:
    # 6371 * acos(cos(rad(lat1)) * cos(rad(lat2)) * cos(rad(lng2) - rad(lng1)) + sin(rad(lat1)) * sin(rad(lat2)))
    haversine_sql = """
        (6371 * acos(
            cos(radians(:lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians(:lng))
            + sin(radians(:lat)) * sin(radians(latitude))
        ))
    """

    query_str = f"""
        SELECT id, name, address, latitude, longitude, description, created_at,
               {haversine_sql} AS distance
        FROM merchants
        WHERE {filter_clause}
          AND {haversine_sql} <= :radius
        ORDER BY distance ASC
        LIMIT :limit OFFSET :offset
    """

    params = {
        "lat": lat,
        "lng": lng,
        "radius": radius,
        "limit": limit,
        "offset": offset
    }
    
    if q and q.strip():
        params["q"] = search_pattern

    result = db.execute(text(query_str), params)
    
    merchants_list = []
    for row in result:
        merchants_list.append({
            "id": row.id,
            "name": row.name,
            "address": row.address,
            "latitude": row.latitude,
            "longitude": row.longitude,
            "description": row.description,
            "distance": round(row.distance, 3), # Round to 3 decimal places (meters precision)
            "created_at": row.created_at
        })
        
    return merchants_list
