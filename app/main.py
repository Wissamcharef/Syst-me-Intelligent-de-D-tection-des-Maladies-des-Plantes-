from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import init_db
from app.routes import auth, predict

app = FastAPI(
    title="Plant Disease Detection API",
    description="Backend API for authentication and plant disease analysis.",
    version="1.0.0",
)

# JWT is sent in Authorization header (not cookies), so credentials=False.
# allow_credentials=True + allow_origins=["*"] is invalid in browsers and breaks fetch.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(predict.router, prefix="/predict", tags=["Predict"])


@app.get("/")
def root() -> dict:
    return {"message": "API is running"}