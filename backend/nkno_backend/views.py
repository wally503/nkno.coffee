from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.exceptions import ValidationError, ParseError
from rest_framework import status

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        raise ParseError("username and password required")
    
    user = authenticate(request, username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        response = Response({"detail": "Login successful"})
        response.set_cookie(key="access_token", value=str(refresh.access_token), httponly=True)
        response.set_cookie(key="refresh_token", value=str(refresh), httponly=True)
        return response
    else:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout(request):
    raw_refresh_token = request.COOKIES.get('refresh_token')
    try:
        token = RefreshToken(raw_refresh_token)
        token.blacklist()
    except Exception:
        pass

    response = Response({"detail": "Logout successful"})
    response.delete_cookie('access_token', samesite='Lax', path='/')
    response.delete_cookie('refresh_token', samesite='Lax', path='/')
    return response;

@api_view(['GET'])
def valid(request):
    raw_access_token = request.COOKIES.get('access_token')
    if not raw_access_token:
        return Response({"detail": "BAD"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        token = AccessToken(raw_access_token)
        return Response({"detail": "OK"})
    except Exception:
        return Response({"detail": "BAD"}, status=status.HTTP_401_UNAUTHORIZED)
    