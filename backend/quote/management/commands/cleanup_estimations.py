from django.core.management.base import BaseCommand
from django.utils import timezone
from backend.quote.models import CostEstimation

class Command(BaseCommand):
    help = 'Delete expired cost estimations'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted without actually deleting',
        )
    
    def handle(self, *args, **options):
        expired_estimations = CostEstimation.objects.filter(
            expires_at__lt=timezone.now()
        )
        
        count = expired_estimations.count()
        
        if options['dry_run']:
            self.stdout.write(
                self.style.WARNING(f'Would delete {count} expired estimations')
            )
            return
        
        deleted_count = expired_estimations.delete()[0]
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully deleted {deleted_count} expired estimations')
        )