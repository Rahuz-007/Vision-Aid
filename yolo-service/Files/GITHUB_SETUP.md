# GitHub Authentication Setup Guide

To enable "Sign in with GitHub", you need to register an OAuth application on GitHub and add the credentials to your project.

## Step 1: Create GitHub OAuth App
1. Log in to your GitHub account.
2. Go to [Developer Settings > OAuth Apps](https://github.com/settings/developers).
3. Click **"New OAuth App"**.
4. Fill in the following details:
   - **Application Name**: Vision Aid (or any name you prefer)
   - **Homepage URL**: `http://localhost:3001` (Your frontend URL)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback` (Your backend callback URL)
5. Click **"Register application"**.

## Step 2: Get Credentials
Once created, you will see a screen with your **Client ID**.
1. Copy the **Client ID**.
2. Click **"Generate a new client secret"**.
3. Copy the **Client Secret**.

## Step 3: Configure Project
1. Open the `.env` file in your `Back-end` folder.
2. Add (or update) these two lines with your copied keys:

```ini
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

3. Save the file.

## Step 4: Restart Server
For new environment variables to take effect, you must restart your backend server.
1. Stop the running server (Ctrl + C).
2. Run `npm start` again.

## Step 5: Test
1. Go to your website: `http://localhost:3001`
2. Click **Sign In**.
3. Click the **GitHub** icon/button.
4. You should be redirected to GitHub to authorize, and then back to the site logged in!
