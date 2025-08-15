# services/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ServiceRequest
from django.core.mail import send_mail
from django.conf import settings

@receiver(post_save, sender=ServiceRequest)
def send_customer_confirmation(sender, instance, created, **kwargs):
    if created:
        subject = f"Your {instance.get_service_type_display()} Request Received"
        
        message_lines = [
            f"Dear {instance.full_name},",
            f"Thank you for your {instance.get_service_type_display()} request.",
            "We have received your request and our team will contact you shortly.",
            "",
            "Here are your request details:",
            f"Service Type: {instance.get_service_type_display()}",
            f"Reference ID: SR-{instance.id:06d}",
        ]
        
        if instance.preferred_date:
            message_lines.append(f"Preferred Date: {instance.preferred_date}")
        
        if instance.preferred_time:
            message_lines.append(f"Preferred Time: {instance.get_preferred_time_display()}")
        
        message_lines.extend([
            "",
            "If you have any questions, please contact us at:",
            f"Phone: {settings.CONTACT_PHONE}",
            f"Email: {settings.CONTACT_EMAIL}",
            "",
            "Best regards,",
            settings.COMPANY_NAME
        ])
        
        message = "\n".join(message_lines)
        
        if instance.email:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[instance.email],
                fail_silently=True,
            )