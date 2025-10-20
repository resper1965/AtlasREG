"""Watchlists routes - placeholder"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_watchlists():
    """List watchlists - to be implemented"""
    return {"message": "Watchlists - coming soon"}

