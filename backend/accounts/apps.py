from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'
    
    def ready(self):
        """Initialize signals when app is ready"""
        try:
            from . import signals  # noqa: F401
        except ImportError:
            pass