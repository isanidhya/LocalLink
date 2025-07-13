# LocalLink: Connecting Local Skills with Community Needs

LocalLink is a web platform designed to empower individuals by helping them offer their skills and services to their local community. Whether you're a home tailor, a baker, or a plumber, LocalLink provides a space to connect with neighbors who need your talents.

The project is built with a modern, full-stack setup leveraging Next.js, Firebase, and Google's AI (Genkit) to create a seamless and intelligent user experience.

## Key Features

*   **Service Listings:** Users can easily create detailed listings for the services or products they offer.
*   **AI-Assisted Listing Creation:** An integrated AI guide helps users craft the perfect listing description, making it easy to get started.
*   **AI-Powered Chatbot:** A helpful chatbot to answer user questions and suggest relevant local services.
*   **User Profiles:** Complete user profiles to build trust and community.
*   **Simple and Clean UI:** A mobile-first, card-based layout built with shadcn/ui and Tailwind CSS for a beautiful and responsive experience.

## Tech Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (with App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI:** [React](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
*   **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication, Firestore)
*   **AI:** [Google AI & Genkit](https://firebase.google.com/docs/genkit)
*   **Forms:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm

### Installation

1.  **Clone the repo:**
    ```sh
    git clone https://github.com/isanidhya/LocalLink.git
    cd LocalLink
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up Firebase:**
    *   Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/).
    *   Enable **Authentication** (with Email/Password provider) and **Firestore**.
    *   Create a web app in your Firebase project and copy the configuration.
    *   Create a `.env.local` file in the root of the project and add your Firebase configuration:
        ```
        NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
        NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
        ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Dependencies

This project relies on a number of key dependencies. It is important to ensure they are correctly installed and managed.

*   `@opentelemetry/exporter-jaeger`: This is a production dependency and **must** be listed in the `dependencies` section of `package.json`, not `devDependencies`. An incorrect placement will cause deployment builds to fail.
*   **Firebase SDK:** This project uses the Firebase Web SDK v9 (modular). Ensure you are using the correct syntax and that all Firebase-related packages are up to date to avoid version conflicts.

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/).

### Vercel Deployment

1.  Push your code to a GitHub repository. A new deployment will be triggered automatically.
2.  Go to the Vercel dashboard and import your repository.
3.  Vercel will automatically detect that you are using Next.js and configure the build settings.
4.  **Important:** Add your Firebase environment variables to the Vercel project settings. You can find these in your `.env.local` file.

**Note:** Always ensure that any packages required for the *production build* are listed in the `dependencies` section of your `package.json` file.

## Design Philosophy

The visual design aims to be warm and welcoming, encouraging community interaction.

*   **Primary Color:** Light, desaturated orange (`#FFB347`)
*   **Background Color:** Very light, desaturated orange (`#FFF8F0`)
*   **Typography:** 'Space Grotesk' for headlines and 'PT Sans' for body text to ensure clarity and readability.
*   **Layout:** A clean, card-based design that is mobile-first and fully responsive.
