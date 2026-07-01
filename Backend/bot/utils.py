from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError
from django.conf import settings

def verify_discord_signature(request):
    
    signature = request.headers.get("X-Signature-Ed25519")
    timestamp = request.headers.get("X-Signature-Timestamp")

    if not signature or not timestamp:
        return False
    
    body = request.body

    message = timestamp.encode() + body

    verify_key = VerifyKey(bytes.fromhex(settings.DISCORD_PUBLIC_KEY))

    try:
        verify_key.verify(
            message,bytes.fromhex(signature)
        )
        return True
    except BadSignatureError:
        print("Invalid Discord Signature")
        return False
        
