import random

otp_store = {}

def send_otp(phone):
    otp = str(random.randint(100000, 999999))

    otp_store[phone] = otp

    ###print(f"OTP for {phone}: {otp}")

    return otp

def is_valid_phone(phone):
    return (
        phone.isdigit()
        and len(phone) == 10
    )


def verify_otp(phone, entered_otp):
    return otp_store.get(phone) == entered_otp