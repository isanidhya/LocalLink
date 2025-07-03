# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Firebase Setup

This project uses Firebase for authentication and database services. To run the app, you need to configure it with your Firebase project credentials.

1.  **Create a Firebase Project:** If you don't have one already, go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2.  **Add a Web App:** In your Firebase project dashboard, click on "Add app" and select the Web option (`</>`).

3.  **Get Config Keys:** After creating the web app, Firebase will provide you with a `firebaseConfig` object. It will look something like this:
    ```javascript
    const firebaseConfig = {
      apiKey: "AIza...",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:abcd..."
    };
    ```

4.  **Update `.env` file:** Copy the values from your `firebaseConfig` object into the `.env` file in the root of this project, replacing the placeholder values.

After updating the `.env` file with your actual credentials, the app should connect to your Firebase project successfully.
