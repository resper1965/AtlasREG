"""
AtlasReg API by ness.
Plataforma de Inteligência de Mercado para Transmissão de Energia
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routers import auth, events, users, watchlists, companies, chat
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 AtlasReg API by ness. starting...")
    yield
    # Shutdown
    print("👋 AtlasReg API shutting down...")

app = FastAPI(
    title="AtlasReg API by ness.",
    description="API para Inteligência de Mercado do Setor de Transmissão de Energia Elétrica",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(events.router, prefix="/events", tags=["Events"])
app.include_router(watchlists.router, prefix="/watchlists", tags=["Watchlists"])
app.include_router(companies.router, prefix="/companies", tags=["Companies"])
app.include_router(chat.router, prefix="/api/v1", tags=["Chat"])

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "AtlasReg API by ness.",
        "version": "1.0.0"
    }

@app.get("/")
def root():
    """API root"""
    return {
        "message": "AtlasReg API by ness.",
        "docs": "/docs",
        "health": "/health",
        "version": "1.0.0"
    }

