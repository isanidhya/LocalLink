import { Timestamp } from "firebase/firestore";

export interface Provider {
  id?: string;
  name: string;
  serviceName: string;
  description: string;
  location: string;
  availability: string;
  charges: string;
  contact: string;
  imageUrl?: string;
  imageHint?: string;
  createdAt: Timestamp;
  userId: string;
}

export interface UserProfile {
  displayName: string;
  email: string;
  location: string;
  profileCompleted: boolean;
  createdAt: any;
}
