# OAuth Setup Guide for VisionAid

Obtaining API keys for Google and GitHub is **100% FREE** for development.

## 1. Google OAuth Credentials (Free)

1.  Go to the **[Google Cloud Console](https://console.cloud.google.com/)**.
2.  Create a **New Project** (name it "VisionAid" or similar).
3.  In the Dashboard, search for **"OAuth consent screen"**.
    *   Select **External** user type.
    *   Fill in required fields (App name: "VisionAid", User support email: yours, Developer contact: yours).
    *   Click "Save and Continue" through the next steps (you don't need to add special scopes for basic login).
4.  Go to **Credentials** (left sidebar).
5.  Click **Create Credentials** -> **OAuth client ID**.
6.  Select **Web application**.
7.  Add the following URI under **Authorized redirect URIs**:
    *   `http://localhost:3000/api/auth/google/callback`
8.  Click **Create**.
9.  Copy the **Client ID** and **Client Secret**.
10. Paste them into your `Back-end/.env` file:
    ```
    GOOGLE_CLIENT_ID=your_client_id
    GOOGLE_CLIENT_SECRET=your_client_secret
    ```

## 2. GitHub OAuth Credentials (Free)

1.  Go to **[GitHub Developer Settings](https://github.com/settings/developers)**.
2.  Click **New OAuth App**.
3.  Fill in the details:
    *   **Application name**: VisionAid
    *   **Homepage URL**: `http://localhost:3001`
    *   **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback`
4.  Click **Register application**.
5.  Copy the **Client ID**.
6.  Click **Generate a new client secret** and copy it.
7.  Paste them into your `Back-end/.env` file:
    ```
    GITHUB_CLIENT_ID=your_client_id
    GITHUB_CLIENT_SECRET=your_client_secret
    ```

## 3. Restart Backend

After saving the `.env` file, **you MUST restart the backend server**:
1.  Go to the "Back-end" terminal.
2.  Press `Ctrl + C` to stop.
3.  Run `npm start`.
