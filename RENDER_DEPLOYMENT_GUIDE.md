# 🚀 Render Deployment Guide for Backend

This guide will walk you through deploying your Node.js backend to **Render.com**.

## 1. Prerequisites
- Ensure your backend code is pushed to your GitHub repository (which we have already done).
- Have your **Cloudinary** API keys ready.
- Have your **MongoDB Connection String** ready.

## 2. Create a New Web Service
1.  Log in to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub account if you haven't already.
4.  Select the **minhas-aluminium** repository.

## 3. Configure the Service
Fill in the following details:

| Setting | Value |
| :--- | :--- |
| **Name** | `minhas-backend` (or any name you like) |
| **Region** | Singapore (or closest to you) |
| **Branch** | `main` |
| **Root Directory** | `backend` (IMPORTANT: Enter `backend` here since your server is in a subdirectory) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node index.js` |

## 4. Environment Variables
You MUST add the following environment variables for the app to work. Scroll down to the **Environment Variables** section and click **Add Environment Variable**.

| Key | Value | Notes |
| :--- | :--- | :--- |
| `MONGO_URI` | `mongodb+srv://habibullahaamir18_db_user:w651ezowTMXApQpL@minhasaluminium.ed28hoe.mongodb.net/minhas_db?retryWrites=true&w=majority` | Your database connection string |
| `JWT_SECRET` | `minhas_aluminium_jwt_secret_2024` | Secret for login tokens |
| `CLOUDINARY_CLOUD_NAME` | `dnysxaoqr` | From your Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | `484485419939377` | From your Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | `slnoX0DAjkHdWEXiXZIA8cMjpRY` | From your Cloudinary Dashboard |
| `NODE_ENV` | `production` | Optimizes performance |

> **Note:** Render automatically sets the `PORT` variable, so you don't need to add it manually.

## 5. Finish & Deploy
1.  Click **Create Web Service**.
2.  Render will start building your app. This might take a few minutes.
3.  Once the build is successful, you will see a green **Live** badge.
4.  Copy the URL provided by Render (e.g., `https://minhas-backend.onrender.com`).

## 6. Update Frontend
Once your backend is live on Render:
1.  Go to your **Frontend** deployment (Vercel).
2.  Update the `VITE_API_URL` environment variable in Vercel settings to point to your new Render Backend URL.
3.  Redeploy the frontend.
