# chatbot/signals.py
import requests
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ChatbotLead
from django.conf import settings

@receiver(post_save, sender=ChatbotLead)
def sync_lead_to_crm(sender, instance, created, **kwargs):
    if created:
        headers = {
            "Authorization": f"Zoho-oauthtoken {settings.ZOHO_CRM_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "data": [{
                "First_Name": instance.name.split()[0],
                "Last_Name": " ".join(instance.name.split()[1:]),
                "Email": instance.email,
                "Phone": instance.phone,
                "City": instance.city,
                "Lead_Source": "Website Chatbot"
            }]
        }
        try:
            response = requests.post(
                settings.ZOHO_CRM_ENDPOINT,
                json=payload,
                headers=headers
            )
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"CRM sync failed: {str(e)}")

from django.apps import AppConfig

# Register in chatbot/apps.py
class ChatbotConfig(AppConfig):
    def ready(self):
        import chatbot.signals