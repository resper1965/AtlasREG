from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AtlasReg API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "AtlasReg API is running"}

@app.get("/")
def root():
    return {
        "message": "Welcome to AtlasReg API",
        "docs": "/docs",
        "version": "1.0.0"
    }
