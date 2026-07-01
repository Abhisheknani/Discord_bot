from rest_framework.response import Response


def handle_interaction(data):
    """
    Main entry point for all Discord interactions.
    """

    interaction_type = data.get("type")

    if interaction_type == 1:
        return handle_ping()

    elif interaction_type == 2:
        return handle_application_command(data)

    return Response(
        {
            "error": "Unknown interaction type"
        },
        status=400
    )


def handle_ping():
    """
    Discord endpoint verification.
    """

    return Response(
        {
            "type": 1
        }
    )


def handle_application_command(data):
    """
    Handles Slash Commands.
    """

    command_name = data["data"]["name"]

    if command_name == "status":
        return handle_status()

    elif command_name == "report":
        return handle_report(data)

    return Response(
        {
            "type": 4,
            "data": {
                "content": "Unknown command."
            }
        }
    )


def handle_status():

    return Response(
        {
            "type": 4,
            "data": {
                "content": "Bot is running successfully."
            }
        }
    )


def handle_report(data):

    options = data["data"].get("options", [])

    report_text = ""

    for option in options:
        if option["name"] == "text":
            report_text = option["value"]

    return Response(
        {
            "type": 4,
            "data": {
                "content": f"Report Received:\n{report_text}"
            }
        }
    )