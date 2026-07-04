# Deploying VoltVision to Railway (Monorepo)

Railway allows you to deploy all three parts of this project (Frontend, Backend, and Discord Bot) for FREE using a single GitHub repository.

## Step-by-Step Guide

### 1. Push to GitHub
First, make sure all the latest code is pushed to your GitHub repository.

### 2. Connect the Backend
1. Go to [Railway.app](https://railway.app/) and create a "New Project".
2. Select **Deploy from GitHub repo** and choose your `VoltVision` repository.
3. Railway will start deploying the root of the project (Frontend) by default. Let's fix that.
4. Click on the newly created service card in your Railway project canvas.
5. Go to the **Settings** tab.
6. Scroll down to **Root Directory** and type `/backend`.
7. Go to the **Variables** tab and add:
   - `FRONTEND_URL`: (You can leave this blank for now, or put your frontend URL once deployed).
8. Railway will now automatically restart and deploy the Node.js backend.
9. Go to **Settings -> Generate Domain** to get a live public URL for your backend.

### 3. Connect the Frontend
1. On the same Railway project canvas, right-click anywhere (or click **+ New**) and select **GitHub Repo**.
2. Select the *same* `VoltVision` repository again.
3. This time, leave the **Root Directory** empty (which means `/`).
4. Go to the **Variables** tab and add:
   - `VITE_API_URL`: (Paste the live backend URL you got from the previous step).
5. Railway will automatically detect it's a React/Vite app, run `npm run build`, and serve the static files using the `serve` package.
6. Go to **Settings -> Generate Domain** to get a live URL for your frontend.
7. *(Optional)* Go back to your Backend variables and set `FRONTEND_URL` to this new frontend domain to secure your CORS.

### 4. Connect the Discord Bot
1. Click **+ New** on the canvas and select **GitHub Repo**.
2. Select the *same* `VoltVision` repository again.
3. Click on the new service card.
4. Go to **Settings -> Root Directory** and type `/discord-bot`.
5. Go to the **Variables** tab and add your bot's secrets:
   - `DISCORD_TOKEN`: Your Discord Bot Token.
   - `CLIENT_ID`: Your Discord Bot Client ID.
   - `BACKEND_URL`: (Paste the live backend URL you generated in step 2).
6. Railway will automatically detect the bot and start it in the background. Since it's Railway, it will not complain about not having an HTTP server!

🎉 **Done!** You now have all three services running beautifully on Railway from a single GitHub repository.
