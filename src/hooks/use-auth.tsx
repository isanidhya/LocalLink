"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";

// Define the shape of the user profile
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  // Add any other user-specific fields you want to store
  createdAt: Date;
}

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isProvider: boolean; // Example of a custom claim or role
  signInWithGoogle: () => Promise<void>;
  createUser: (email: string, pass: string) => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProvider, setIsProvider] = useState(false); // Example state for user role
  const { toast } = useToast();
  const router = useRouter();

  // Function to create or update user profile in Firestore
  const updateUserProfile = async (
    firebaseUser: User,
    additionalData?: Record<string, any>
  ) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // New user, create profile
      const { displayName, email, photoURL } = firebaseUser;
      const createdAt = new Date();
      try {
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          email,
          displayName,
          photoURL,
          createdAt,
          ...additionalData,
        });
      } catch (err) {
        console.error("Error creating user profile in Firestore:", err);
        setError("Failed to create user profile.");
      }
    }
  };

  // Handle user state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        // Here you would also fetch the user's custom claims or role
        // For example, from an ID token or a separate Firestore document
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserProfile(userSnap.data() as UserProfile);
        } else {
          // If the profile doesn't exist, it might be a new sign-up
          // The profile will be created on sign-up, but you can handle it here too
          await updateUserProfile(firebaseUser); // Create profile if it's missing
          const newUserSnap = await getDoc(userRef);
          if (newUserSnap.exists()) {
            setUserProfile(newUserSnap.data() as UserProfile);
          }
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await updateUserProfile(result.user); // Create/update profile on sign-in
      toast({ title: "Success!", description: "Signed in with Google." });
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Failed to sign in with Google.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not sign in with Google.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Create user with email and password
  const createUser = async (email: string, pass: string) => {
    setLoading(true);
    try {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        await updateUserProfile(result.user); // Create profile on sign-up
        toast({ title: "Account Created!", description: "You are now logged in." });
        router.push("/");
    } catch (err) {
        console.error(err);
        if (err instanceof FirebaseError) {
             switch (err.code) {
                case 'auth/email-already-in-use':
                    setError("This email is already in use.");
                    toast({ variant: "destructive", title: "Authentication Failed", description: "This email is already in use. Please sign in."});
                    break;
                default:
                    setError("Failed to create user.");
                    toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
            }
        } else {
            setError("An unexpected error occurred.");
        }
    } finally {
        setLoading(false);
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        toast({ title: "Success!", description: "You are now logged in." });
        router.push("/");
    } catch (err) {
        console.error(err);
        if (err instanceof FirebaseError) {
             switch (err.code) {
                case 'auth/user-not-found':
                    setError("No account found with this email.");
                    toast({ variant: "destructive", title: "Authentication Failed", description: "No account found. Please sign up."});
                    break;
                case 'auth/wrong-password':
                    setError("Invalid email or password.");
                    toast({ variant: "destructive", title: "Authentication Failed", description: "Invalid email or password."});
                    break;
                default:
                    setError("Failed to sign in.");
                    toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
            }
        } else {
            setError("An unexpected error occurred.");
        }
    } finally {
        setLoading(false);
    }
  }

  // Log out
  const logOut = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    router.push("/login");
  };
  
  // Reset password
  const resetPassword = async (email: string) => {
      setLoading(true);
      try {
          await sendPasswordResetEmail(auth, email);
          toast({ title: "Password Reset", description: "Password reset link sent to your email." });
      } catch (err) {
          console.error(err);
          setError("Failed to send reset email.");
      } finally {
          setLoading(false);
      }
  }

  const value = {
    user,
    userProfile,
    loading,
    error,
    isProvider,
    signInWithGoogle,
    createUser,
    signIn,
    logOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
