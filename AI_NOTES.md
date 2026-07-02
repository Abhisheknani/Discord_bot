# AI_NOTES.md

# AI Usage Notes

## AI Tools Used

- ChatGPT (OpenAI)
- GitHub Copilot

## How AI Was Used

### ChatGPT

ChatGPT was used as a development assistant throughout the project. It helped with:

- Understanding the Discord Interactions API and interaction lifecycle.
- Implementing Ed25519 signature verification for Discord requests.
- Designing the backend architecture and API flow.
- Implementing slash commands, modals, and button interactions.
- Implementing JWT authentication using Django REST Framework Simple JWT.
- Assisting with debugging deployment, CORS, Render configuration, and Discord integration issues.
- Reviewing code, suggesting improvements, and explaining implementation choices.

### GitHub Copilot

GitHub Copilot was primarily used during frontend development inside Visual Studio Code. It assisted with:

- Generating React component boilerplate.
- Suggesting JSX structure and reusable components.
- Autocompleting React hooks and event handlers.
- Generating form layouts and dashboard UI code.
- Suggesting API integration snippets using Axios.
- Speeding up repetitive frontend development tasks.

## What Was Verified Independently

All AI-generated suggestions were manually reviewed, implemented, and tested before being accepted into the project.

The following features were verified through manual testing:

- Discord endpoint verification (Ed25519 signatures)
- Slash commands (`/status` and `/report`)
- Modal submission flow
- Database persistence
- Notification channel integration
- Resolve/Ignore button interactions
- Dashboard APIs
- JWT authentication
- React dashboard functionality
- Configuration management
- Deployment on Render

Only solutions that worked correctly within the application were retained.

## Limitations of AI Assistance

AI-generated suggestions occasionally required modification to fit the project's requirements or Discord's interaction model. Examples included:

- Adjustments to Discord interaction payloads.
- Corrections to interaction response handling.
- Fixes for deployment and Render configuration.
- Refinements to frontend routing and authentication flow.
- Simplification of the project structure to better align with the assignment requirements.

All AI-generated code and suggestions were reviewed, tested, and adapted before being integrated into the final solution.

## Final Note

AI tools were used to assist with learning, development, debugging, code completion, and reviewing implementation ideas. Final architectural decisions, integration, testing, debugging, deployment, and validation of all features were performed manually before submission.