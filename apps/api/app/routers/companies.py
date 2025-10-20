"""Companies routes - placeholder"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_companies():
    """List companies - to be implemented"""
    return {"message": "Companies - coming soon"}

