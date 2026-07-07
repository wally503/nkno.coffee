from django.urls import path, include

urlpatterns = [
    path('coffee/', include('coffee.urls')),
    path('brew/', include('brew.urls')),
]