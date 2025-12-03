# CryptoVision - A Firebase Studio Project

This is a Next.js application built in Firebase Studio. It uses AI to provide cryptocurrency trading analysis and predictions.

## 🚀 Getting Started

To get this project running on your local machine, follow these steps.

### 1. Get Your Gemini API Key

The AI features in this application are powered by Google's Gemini model. You need a free API key to use it.

1.  Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
2.  Click **"Create API key in new project"**.
3.  Copy the generated API key.

### 2. Configure Your Environment

You need to provide the API key to the application.

1.  Find the `.env` file in the main directory of your project.
2.  Open it and replace `YOUR_API_KEY_HERE` with the key you just copied.

```
GEMINI_API_KEY="AIzaSy...your...key...here..."
```

### 3. Install Dependencies & Run

Open your terminal in the project folder and run the following commands:

```bash
# Install all the necessary packages
npm install

# Run the development server
npm run dev
```

The application should now be running at `http://localhost:3000`.

## Project Structure

Your project is more than just the code inside the `src` folder. To successfully run, build, and deploy this application, you need all the configuration files located in the main (root) directory.

When you download your project, ensure you have **all** the following files and folders:

- **/src/**: This is where all your application's source code lives (React components, pages, AI flows, etc.).
- **package.json**: This is critical. It lists all the dependencies (like React, Next.js, Firebase, Genkit) your project needs to run. The `npm install` command reads this file.
- **.env**: This file holds your secret API key. It is crucial for running the app locally.
- **next.config.ts**: The main configuration file for the Next.js framework.
- **tailwind.config.ts**: Configures the Tailwind CSS utility classes used for styling.
- **tsconfig.json**: The configuration file for TypeScript.
- **apphosting.yaml**: The configuration file for deploying to Firebase App Hosting.
- **firestore.rules**: Contains the security rules for your Firestore database.
- **DEPLOYMENT.md**: The step-by-step guide to get your application live on the internet.

**IMPORTANT:** If you only download the `src` folder, you will not be able to run the application. You must download the entire project to ensure all the necessary configuration is included. Please look for a "Download" or "Export" button in your development environment to get the complete project as a `.zip` file.
