"""Events routes - placeholder"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/search")
async def search_events():
    """Search events - to be implemented"""
    return {"message": "Events search - coming soon"}

