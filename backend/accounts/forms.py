from django.contrib.auth.forms import UserCreationForm
from .models import User

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'email', 'phone', 'created_by_admin')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['created_by_admin'].initial = True
        self.fields['created_by_admin'].widget.attrs['disabled'] = True
        self.fields['created_by_admin'].help_text = "Admin-created users are automatically verified"