from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("app_evacuacion_coderider.urls")),
    path("", include("app_transferencia.urls")),
]
