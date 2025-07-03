# **App Name**: LocalLink

## Core Features:

- Home Page: Home page with buttons for offering services or finding local services.
- Add Listing Form: Form to add a service/product listing with fields for name, service/product, description, location, availability, charges, and contact info. Option to upload a photo.
- Data Storage: Store the listing data into the Firebase Firestore `providers` collection.
- Search & Filter: Search page that allows users to search for providers by keyword or location, filter by service type or area.
- AI Chatbot: AI chatbot assistant to suggest nearby matches or guide users to create a listing based on user input; use Gemini API as a tool.
- Authentication: Enable Firebase Authentication with phone login for secured routes like 'Add Provider'.
- Provider Cards: Display search results using clear, concise cards.

## Style Guidelines:

- Primary color: Light, desaturated orange (#FFB347) to convey a sense of community and warmth.
- Background color: Very light, desaturated orange (#FFF8F0).
- Accent color: Pale yellow (#F0E68C) for highlighting key UI elements and CTAs.
- Body font: 'PT Sans', sans-serif, for readability in service descriptions.
- Headline font: 'Space Grotesk', sans-serif, for headings and short text.
- Use simple, outlined icons to represent service categories (e.g., wrench for repair, whisk for food).
- Mobile-first responsive design with a clean, card-based layout to display services.