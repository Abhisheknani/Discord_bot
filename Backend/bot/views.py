from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import verify_discord_signature
from django.http import HttpResponse
from .services import handle_interaction
from .serializers import (CommandLogSerializer,BotConfigurationSerializer)
from rest_framework import generics
from .models import CommandLog, BotConfiguration


class Interactions(APIView):

    authentication_classes = []
    permission_classes = []

    def post(self, request):

        if not verify_discord_signature(request):
            return Response(
                {
                    "error": "Invalid Signature"
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        return handle_interaction(request.data)

class CommandLogListAPIView(generics.ListAPIView):

    serializer_class = CommandLogSerializer

    queryset = CommandLog.objects.all().order_by("-created_at")

class CommandLogDetailAPIView(generics.RetrieveAPIView):

    serializer_class = CommandLogSerializer

    queryset = CommandLog.objects.all()

class BotConfigurationAPIView(generics.RetrieveUpdateAPIView):

    serializer_class = BotConfigurationSerializer

    def get_object(self):
        return BotConfiguration.objects.first()
            