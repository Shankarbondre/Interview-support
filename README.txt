INTERVIEW ASSISTANT — iPHONE WEB APP

This is a Progressive Web App (PWA) starter.

IMPORTANT:
1. Safari microphone access requires a secure HTTPS website (localhost is also allowed for local development).
2. Open the deployed HTTPS URL in Safari.
3. Tap Share -> Add to Home Screen.
4. Use Start Audio. Press it again to stop; the app automatically calls Generate Answer.
5. Configure an HTTPS backend endpoint in Settings. Do NOT put an OpenAI secret key into frontend JavaScript.

The backend should accept:
POST JSON:
{
  "question": "...",
  "instruction": "..."
}
and return:
{
  "answer": "..."
}

For a production version, put the AI provider API key on the backend.
