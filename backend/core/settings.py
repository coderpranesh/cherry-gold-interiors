"""
Django settings for core project.
"""
# backend/core/settings.py
import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent

# ========================
# 1. CORE CONFIGURATION
# ========================
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-fallback-key')
DEBUG = False
ALLOWED_HOSTS = ['cherrygoldinteriors.com', 'www.cherrygoldinteriors.com', '127.0.0.1', 'localhost']
ROOT_URLCONF = 'core.urls'
WSGI_APPLICATION = 'core.wsgi.application'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ========================
# 2. APPLICATION DEFINITION
# ========================
INSTALLED_APPS = [
    # Django Core
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    'rest_framework.authtoken',
    'modeltranslation',
    'parler',
    'drf_spectacular',
    'django_filters',
    'admin_interface',
    'colorfield',

    
    
    # Local Apps
    'accounts',
    'portfolio',
    'catalogue',
    'services',
    'projects',
    'chatbot',
    'blog',
    # 'newsletter',
]

# ========================
# 3. MIDDLEWARE
# ========================
MIDDLEWARE = [
    'whitenoise.middleware.WhiteNoiseMiddleware',  # For serving static files in production
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',  # For translations
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# ========================
# 4. TEMPLATES & STATIC FILES
# ========================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# ========================
# 5. DATABASE
# ========================
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': os.getenv('DB_NAME', 'cherrygold'),
#         'USER': os.getenv('DB_USER', 'postgres'),
#         'PASSWORD': os.getenv('DB_PASSWORD', 'postgres'),
#         'HOST': os.getenv('DB_HOST', 'localhost'),
#         'PORT': os.getenv('DB_PORT', '5432'),
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# ========================
# 6. AUTHENTICATION
# ========================
AUTH_USER_MODEL = 'accounts.User'
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# ========================
# 7. INTERNATIONALIZATION
# ========================
LANGUAGE_CODE = 'en'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_L10N = True
USE_TZ = True

LANGUAGES = [
    ('en', 'English'),
    ('hi', 'Hindi'),
]

LOCALE_PATHS = [
    os.path.join(BASE_DIR, 'locale'),
]

# ModelTranslation
MODELTRANSLATION_DEFAULT_LANGUAGE = 'en'

# Parler (for translated models)
PARLER_LANGUAGES = {
    None: (
        {'code': 'en'},
        {'code': 'hi'},
    ),
    'default': {
        'fallback': 'en',
        'hide_untranslated': False,
    }
}

# ========================
# 8. REST FRAMEWORK
# ========================
REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    # other backends if you have them
]

SPECTACULAR_SETTINGS = {
    'TITLE': 'Cherry Gold Interiors API',
    'DESCRIPTION': 'API documentation for Cherry Gold Interiors',
    'VERSION': '1.0.0',
    'CONTACT': {'email': 'contact@cherrygoldinteriors.com'},
    'LICENSE': {'name': 'BSD License'},
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    # 'ROTATE_REFRESH_TOKENS': True,
}

# MSG91 Configuration
MSG91_AUTH_KEY = 'your_msg91_auth_key'
MSG91_TEMPLATE_ID = 'your_msg91_template_id'


# Fast2SMS configuration
FAST2SMS_API_KEY = 'E0YOB3sySeUKWDTf1428xhqr7CnNw9dQgMRijI5butPGXJLmzlV2kqnLKSsOPlEYI3FDt6hp07XQmUMj'
FRONTEND_URL = 'http://localhost:5173'  # Update with your frontend URL

# ========================
# 9. CORS & SECURITY
# ========================
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:8000",
    "http://localhost:3000",
    "https://cherrygoldinteriors.com",
    "https://www.cherrygoldinteriors.com",
]
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS.copy()

# ========================
# 10. THIRD-PARTY INTEGRATIONS
# ========================
# Email (SMTP)

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

EMAIL_HOST = 'smtp.your-email-provider.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@example.com'
EMAIL_HOST_PASSWORD = 'your-email-password'
DEFAULT_FROM_EMAIL = 'your-email@example.com'

# Service specific settings
ADMIN_EMAIL = 'admin@example.com'
CONTACT_PHONE = '+91 9876543210'
CONTACT_EMAIL = 'contact@example.com'
COMPANY_NAME = 'Your Interior Design Company'
SITE_NAME = 'Cherry Gold Interiors'

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_WHATSAPP_NUMBER = 'whatsapp:+14155238886'

# Zoho CRM
ZOHO_CRM_API_KEY = os.getenv('ZOHO_CRM_API_KEY')
ZOHO_CRM_ENDPOINT = "https://www.zohoapis.com/crm/v2/Leads"

# Dialogflow (Chatbot)
DIALOGFLOW_PROJECT_ID = os.getenv('DIALOGFLOW_PROJECT_ID')
DIALOGFLOW_LANGUAGE_CODE = os.getenv('DIALOGFLOW_LANGUAGE_CODE', 'en')

# ========================
# 11. FRONTEND INTEGRATION
# ========================
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')

# ========================
# 12. CUSTOM SETTINGS
# ========================
# Referral System
REFERRAL_CASHBACK_RULES = {
    '200000': 0.05,  # 5% for > ₹2L
    '100000': 0.03,  # 3% for > ₹1L
}

# Budget Calculator Rates (₹/sqft)
BUDGET_RATES = {
    'STD': 1200,
    'PRE': 1800,
    'LUX': 2500
}