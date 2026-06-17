from services.otp_service import (
    send_otp,
    verify_otp
)
from fastapi import APIRouter

router = APIRouter()

@router.post("/send-otp")
def send_otp_endpoint(phone: str):

    if not (
        phone.isdigit()
        and len(phone) == 10
    ):
        return {
            "success": False,
            "message": "Invalid phone number"
        }

    otp = send_otp(phone)

    return {
        "success": True,
        "message": "OTP sent",
        "otp": otp
    }

@router.post("/verify-otp")
def verify_otp_endpoint(
    phone: str,
    otp: str
):

    return {
        "verified":
        verify_otp(phone, otp)
    }