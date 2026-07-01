from django.contrib import admin
from django.urls import path
from .views import Interactions,test

urlpatterns = [
    path('interactions/', Interactions.as_view(),name='interactions'),
     path("test/", test),
]
