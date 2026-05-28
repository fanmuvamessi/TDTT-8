import base64
from datetime import datetime
from typing import Optional, Tuple

def decode_cursor(cursor_str: Optional[str]) -> Optional[Tuple[datetime, int]]:
    """
    Giải mã cursor từ chuỗi base64 (định dạng 'ISO_TIMESTAMP|ID')
    để lấy ra thời điểm tạo và ID làm điểm bắt đầu cho trang tiếp theo.
    """
    if not cursor_str:
        return None
    try:
        decoded = base64.b64decode(cursor_str.encode("utf-8")).decode("utf-8")
        timestamp_str, id_str = decoded.split("|")
        cursor_time = datetime.fromisoformat(timestamp_str)
        cursor_id = int(id_str)
        return cursor_time, cursor_id
    except Exception:
        return None

def encode_cursor(created_at: datetime, item_id: int) -> str:
    """
    Mã hóa thời điểm tạo và ID của bản ghi cuối cùng thành chuỗi base64
    để làm cursor cho trang tiếp theo.
    """
    cursor_raw = f"{created_at.isoformat()}|{item_id}"
    return base64.b64encode(cursor_raw.encode("utf-8")).decode("utf-8")
