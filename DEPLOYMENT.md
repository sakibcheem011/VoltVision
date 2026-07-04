# Deploying VoltVision to Render

This project is fully configured to be deployed on Render using a single Blueprint (`render.yaml`). This approach is known as "Infrastructure as Code" and automates the creation and linking of all three services (Frontend, Backend, and Discord Bot).

## Deployment Steps

1. **Commit and Push to GitHub**
   Ensure all changes are pushed to your GitHub repository.

2. **Connect to Render**
   - Go to your [Render Dashboard](https://dashboard.render.com/).
   - Click on **New +** and select **Blueprint**.
   - Connect your GitHub account and select your `VoltVision` repository.

3. **Deploy the Blueprint**
   Render will automatically detect the `render.yaml` file in the root of your project. It will create three distinct services:
   - `voltvision-backend`: A Web Service running your Node.js/Express IoT backend.
   - `voltvision-frontend`: A Static Site serving your built Vite/React application.
   - `voltvision-discord-bot`: A Background Worker running your Discord bot continuously.

4. **Add Missing Environment Variables**
   Render will prompt you for variables that are not checked into source control (e.g., secrets).
   You will need to provide:
   - `DISCORD_TOKEN`: Your Discord Bot Token.
   - `CLIENT_ID`: Your Discord Bot Client ID.

   *Note: Render will automatically connect the Frontend and Discord Bot to the Backend's live URL using the `RENDER_EXTERNAL_URL` variable mapped in `render.yaml`.*

## Updating the Project
Because `autoDeploy` is set to `true`, simply pushing any new code to your `main` branch on GitHub will automatically trigger a rebuild and deployment of the affected services.

## Troubleshooting

- **Frontend shows "IoT Gateway Error" after deployment:**
  Check the Backend logs in the Render dashboard to ensure it started successfully and is not crashing. Ensure you aren't blocking CORS (the blueprint handles this automatically by providing the `FRONTEND_URL` variable to the backend).

- **Discord Bot doesn't come online:**
  Verify that you provided the correct `DISCORD_TOKEN` in the Environment Variables tab of the `voltvision-discord-bot` Background Worker service. Also, ensure you registered the slash commands using `npm run register-commands` locally before deploying.

- **WebSocket Connection Fails:**
  The backend is configured to accept Socket.IO connections from the `FRONTEND_URL`. Verify the Frontend service's domain exactly matches the backend's environment variable.
