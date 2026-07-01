from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError
from django.conf import settings

from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError
from django.conf import settings

def verify_discord_signature(request):

    signature = request.headers.get("X-Signature-Ed25519")
    timestamp = request.headers.get("X-Signature-Timestamp")

    print("=" * 60)
    print("Headers:", dict(request.headers))
    print("Signature:", signature)
    print("Timestamp:", timestamp)
    print("Public Key:", settings.DISCORD_PUBLIC_KEY)
    print("Body:", request.body)

    if not signature or not timestamp:
        print("Missing signature headers")
        return False

    message = timestamp.encode() + request.body

    verify_key = VerifyKey(bytes.fromhex(settings.DISCORD_PUBLIC_KEY))

    try:
        verify_key.verify(message, bytes.fromhex(signature))
        print("✅ Signature verified")
        return True

    except Exception as e:
        print("❌ Verification failed:", repr(e))
        return False
        
