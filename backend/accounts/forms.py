from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django import forms
from .models import User


class CustomUserCreationForm(UserCreationForm):
    """Form for creating new users in admin panel"""
    
    class Meta:
        model = User
        fields = (
            'username', 'email', 'phone', 'first_name', 'last_name',
            'password1', 'password2', 'created_by_admin'
        )
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Set help texts
        self.fields['created_by_admin'].help_text = "Admin-created users are automatically verified"
        self.fields['created_by_admin'].initial = True
        
        # Make fields required
        self.fields['email'].required = True
        self.fields['first_name'].required = True
        self.fields['last_name'].required = True
        
        # Add placeholders
        self.fields['username'].widget.attrs['placeholder'] = 'Enter username'
        self.fields['email'].widget.attrs['placeholder'] = 'Enter email address'
        self.fields['phone'].widget.attrs['placeholder'] = 'Enter 10-digit phone number'
        self.fields['first_name'].widget.attrs['placeholder'] = 'Enter first name'
        self.fields['last_name'].widget.attrs['placeholder'] = 'Enter last name'
    
    def clean_email(self):
        """Validate email uniqueness"""
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("A user with this email already exists.")
        return email
    
    def clean_phone(self):
        """Validate phone number"""
        phone = self.cleaned_data.get('phone')
        if phone:
            # Check if phone number already exists
            if User.objects.filter(phone=phone).exists():
                raise forms.ValidationError("A user with this phone number already exists.")
            
            # Validate format
            if not phone.isdigit() or len(phone) != 10:
                raise forms.ValidationError("Phone number must be 10 digits.")
            
            if not phone.startswith(('6', '7', '8', '9')):
                raise forms.ValidationError("Phone number must start with 6, 7, 8, or 9.")
        
        return phone


class CustomUserChangeForm(UserChangeForm):
    """Form for editing users in admin panel"""
    
    class Meta:
        model = User
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make email required
        self.fields['email'].required = True


class EmailVerificationForm(forms.Form):
    """Form for email OTP verification"""
    email = forms.EmailField(
        max_length=255,
        widget=forms.EmailInput(attrs={
            'placeholder': 'Enter your email address',
            'class': 'form-control'
        })
    )
    otp = forms.CharField(
        max_length=6,
        min_length=6,
        widget=forms.TextInput(attrs={
            'placeholder': 'Enter 6-digit OTP',
            'class': 'form-control'
        })
    )


class ResendOTPForm(forms.Form):
    """Form for resending OTP"""
    email = forms.EmailField(
        max_length=255,
        widget=forms.EmailInput(attrs={
            'placeholder': 'Enter your email address',
            'class': 'form-control'
        })
    )