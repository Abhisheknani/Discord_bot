from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import verify_discord_signature
from django.http import HttpResponse

class Interactions(APIView):
    authentication_classes=[]
    permission_classes=[]

    def post(self,request):

        print("Raw body:", request.body)
        print("Parsed data:", request.data)

        if not verify_discord_signature(request):
            return Response(
                {
                    "error":"Invalid Signature"
                },
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        interaction_type = request.data.get("type")

        if interaction_type == 1:
            return Response(
                {
                    "type":1
                }
            )
        return Response({
            "message":"Interaction recieved"
        })