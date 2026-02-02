# How to Get Your Firebase Service Account Key

To connect your **backend** to Firebase (so it can read/write data securely), you need a **Service Account Key**. This is different from the frontend configuration.

## Step 1: Go to Firebase Console
1. Open [https://console.firebase.google.com/](https://console.firebase.google.com/) in your browser.
2. Click on your project (**VisionAid**).

## Step 2: Open Project Settings
1. Click the **Gear Icon** ⚙️ next to "Project Overview" in the top-left sidebar.
2. Select **Project settings**.

## Step 3: Generate the Key
1. Click on the **"Service accounts"** tab (usually the 4th tab).
2. You will see a "Firebase Admin SDK" section.
3. Click the blue button that says **"Generate new private key"**.
4. A warning will pop up. Click **"Generate key"**.
5. A file will automatically download to your computer. It will be named something like `vision-aid-firebase-adminsdk-xxxxx.json`.

## Step 4: Add the Key to Your Project
1. **Rename** the downloaded file to exactly: `serviceAccountKey.json`.
2. **Move** this file into your `Back-end/config/` folder.
   - Using File Explorer: Copy the file -> Go to `Vision aid` -> `Back-end` -> `config` folder -> Paste it there.

**⚠️ IMPORTANT:** Never share this file with anyone. It gives full administrative access to your Firebase project. We have already added it to `.gitignore` so it won't be uploaded to GitHub.
