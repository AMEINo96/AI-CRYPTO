
# Deploying CryptoVision to Firebase App Hosting

Congratulations on building CryptoVision! This guide provides the next steps to deploy your application to the public internet using Firebase App Hosting.

The project is already configured for deployment with Firebase App Hosting, which is a modern, secure, and scalable way to host Next.js applications.

## Prerequisites

1.  **Node.js:** Ensure you have Node.js installed on your local machine. You can download it from [nodejs.org](https://nodejs.org/).
2.  **Firebase CLI:** The Firebase Command Line Interface (CLI) is essential for deploying your app. If you don't have it, install it globally by running this command in your terminal:
    ```bash
    npm install -g firebase-tools
    ```
3.  **A Firebase Account:** You'll need a Firebase account. If you don't have one, you can sign up for free at [firebase.google.com](https://firebase.google.com).

## Step-by-Step Deployment Guide

### Step 1: Download Your Project Code

First, you'll need to get the application code from this prototyping environment onto your local machine. Look for a "Download" or "Export" button in the development tool you are using to get the complete project as a `.zip` file.

### Step 2: Open a Terminal and Install Dependencies

Once you have the code downloaded and unzipped, open a terminal (like Terminal on macOS or Command Prompt/PowerShell on Windows) and navigate into your project's main folder:

```bash
cd path/to/your/cryptovision-project
```

Next, install all the necessary packages for the app to run:

```bash
npm install
```

### Step 3: Log in to Firebase

In your terminal, log in to your Google account that you use for Firebase:

```bash
firebase login
```

This will open a browser window for you to sign in.

### Step 4: Link Your Project

The project is already configured with your Firebase project ID. You just need to confirm it with the CLI:

```bash
firebase use [YOUR_FIREBASE_PROJECT_ID]
```

You can find your project ID in the `src/firebase/config.ts` file.

## Deployment

### Deploy with Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1. Push your code to a git repository (GitHub, GitLab, BitBucket).
2. Import your project into Vercel.
3. Vercel will automatically detect that you are using Next.js and configure the build settings.
4. Add your environment variables in the Vercel project settings.
5. Click **Deploy**.

For more details, check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

---

## How to Upload Your Project to GitHub

After downloading your code, you can easily upload it to GitHub to save your work and share it with others.

### Prerequisites

*   A [GitHub account](https://github.com/join).
*   [Git](https://git-scm.com/downloads) installed on your computer.

### Step-by-Step Guide to Upload

1.  **Create a New Repository on GitHub:**
    *   Go to [GitHub](https://github.com/) and log in.
    *   Click the **+** icon in the top-right corner and select **"New repository"**.
    *   Give your repository a name (e.g., "cryptovision-app").
    *   You can add a description, but leave the other options (like adding a README or .gitignore) unchecked, as your project already has them.
    *   Click **"Create repository"**.

2.  **Initialize Git in Your Project Folder:**
    *   In your terminal, make sure you are still inside your project folder (`cd path/to/your/cryptovision-project`).
    *   Run the following command to initialize a new Git repository:
        ```bash
        git init
        ```

3.  **Add and Commit Your Files:**
    *   Add all the files in your project to the repository:
        ```bash
        git add .
        ```
    *   Commit the files with a message:
        ```bash
        git commit -m "Initial commit of CryptoVision app"
        ```

4.  **Connect to Your GitHub Repository:**
    *   On the GitHub page for your new repository, copy the URL provided under "…or push an existing repository from the command line". It will look something like `https://github.com/your-username/cryptovision-app.git`.
    *   Back in your terminal, run this command, pasting the URL you just copied:
        ```bash
        git remote add origin https://github.com/your-username/cryptovision-app.git
        ```

5.  **Push Your Code to GitHub:**
    *   Finally, push your code to the GitHub repository:
        ```bash
        git push -u origin main
        ```
        *(Note: Your default branch might be `master` instead of `main` if you are using an older version of Git. If `main` doesn't work, try `master`.)*

That's it! Your project code will now be saved and visible on your GitHub profile.
