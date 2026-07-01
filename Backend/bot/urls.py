from django.contrib import admin
from django.urls import path
from .views import Interactions, CommandLogListAPIView,CommandLogDetailAPIView,BotConfigurationAPIView

urlpatterns = [
    path('interactions/', Interactions.as_view(),name='interactions'),
    path("api/reports/",CommandLogListAPIView.as_view(),name="reports"),
    path("api/reports/<int:pk>/",CommandLogDetailAPIView.as_view(),name="report-detail"),
    path("api/config/",BotConfigurationAPIView.as_view(),name="config"),
]
