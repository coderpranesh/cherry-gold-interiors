
#backend/accounts/utils.py
import requests
from django.conf import settings

def send_otp_sms(phone, otp):
    if not settings.MSG91_AUTH_KEY:
        print(f"SMS not sent (development mode). OTP for {phone}: {otp}")
        return True
    
    url = "https://api.msg91.com/api/v5/otp"
    
    payload = {
        "template_id": settings.MSG91_OTP_TEMPLATE_ID,
        "mobile": f"91{phone}",
        "otp": otp
    }
    
    headers = {
        "authkey": settings.MSG91_AUTH_KEY,
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return True
    except requests.exceptions.RequestException as e:
        print(f"Failed to send SMS: {e}")
        return False