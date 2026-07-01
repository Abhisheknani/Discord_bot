from django.contrib import admin
from django.urls import path
from .views import Interactions

urlpatterns = [
    path('interactions/', Interactions.as_view(),name='interactions'),
]
