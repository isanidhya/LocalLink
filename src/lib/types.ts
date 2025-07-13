import { Timestamp } from "firebase/firestore";

export interface Listing {
  id: string;
  name: string;
  serviceName: string;
  description: string;
  location: string;
  availability: string;
  charges: string;
  contact: string;
  imageUrl?: string;
  createdAt: Timestamp;
  userId: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  location?: string;
  profileCompleted?: boolean;
  createdAt: Timestamp;
}
