from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import User

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        print("COOKIES:", request.COOKIES, flush=True)
        raw_access_token = request.COOKIES.get('access_token')

        if not raw_access_token:
            return None

        try:
            token = AccessToken(raw_access_token)
            user = User.objects.get(id=token["user_id"])
            return (user, token)
        except Exception:
            raise AuthenticationFailed("Invalid or expired token")