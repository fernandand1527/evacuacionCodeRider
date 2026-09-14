from django.urls import path

from .views import evacuacion, sonora_music


urlpatterns = [
    path("", evacuacion, name="evacuacion"),
    path("musica/", sonora_music, name="sonora_music"),
]
