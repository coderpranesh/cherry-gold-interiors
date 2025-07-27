# services/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from twilio.rest import Client
from .models import RepairRequest
from django.conf import settings

@receiver(post_save, sender=RepairRequest)
def send_repair_whatsapp_notification(sender, instance, created, **kwargs):
    if created and instance.user.phone:
        try:
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            message = client.messages.create(
                body=f"🔧 Repair Request Received!\nItem: {instance.item_name}\nStatus: {instance.get_status_display()}",
                from_=settings.TWILIO_WHATSAPP_NUMBER,
                to=f'whatsapp:+91{instance.user.phone}'  # Indian format
            )
            print(f"WhatsApp notification sent: {message.sid}")
        except Exception as e:
            print(f"Failed to send WhatsApp: {str(e)}")

from django.apps import AppConfig

# Register in services/apps.py
class ServicesConfig(AppConfig):
    def ready(self):
        import services.signals