from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.process_document import router as process_router
from routes.verify_face import router as verify_router
from routes.verify_user import router as verify_user_router
from routes.send_otp import router as otp_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(process_router)
app.include_router(verify_router)
app.include_router(verify_user_router)
app.include_router(otp_router)

@app.get("/")
def home():
    return {"message": "eKYC updated Backend Running"}
