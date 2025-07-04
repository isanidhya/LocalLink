"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";

declare global {
    interface Window {
      recaptchaVerifier: RecaptchaVerifier;
      confirmationResult?: ConfirmationResult;
    }
}

const emailPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type EmailPasswordFormValues = z.infer<typeof emailPasswordSchema>;

const AuthForm = () => {
  const [loading, setLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  
  const form = useForm<EmailPasswordFormValues>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    // This is for phone auth reCAPTCHA
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': () => {},
        });
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        toast({ title: "Success!", description: "You are now logged in." });
        router.push(redirect);
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not sign in with Google." });
    } finally {
        setGoogleLoading(false);
    }
  };

  const onEmailPasswordSubmit = async (data: EmailPasswordFormValues) => {
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        toast({ title: "Account Created!", description: "You are now logged in." });
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast({ title: "Success!", description: "You are now logged in." });
      }
      router.push(redirect);
    } catch (error) {
      console.error("Email/Password Error:", error);
      let description = "An unexpected error occurred.";
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            description = "This email is already in use. Please sign in.";
            setIsSignUp(false); // Switch to sign-in form
            break;
          case 'auth/user-not-found':
             description = "No account found with this email. Please sign up.";
             setIsSignUp(true); // Switch to sign-up form
            break;
          case 'auth/wrong-password':
             description = "Invalid email or password.";
            break;
          case 'auth/invalid-email':
            description = "Please enter a valid email address.";
            break;
          case 'auth/operation-not-allowed':
            description = "Email/Password sign-in is not enabled. Please enable it in your Firebase console.";
            break;
        }
      }
      toast({ variant: "destructive", title: "Authentication Failed", description });
    } finally {
      setLoading(false);
    }
  };

  const onPhoneSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneLoading(true);
    const appVerifier = window.recaptchaVerifier;
    const formattedPhoneNumber = `+${phoneNumber.replace(/\D/g, '')}`;
    
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setIsOtpSent(true);
      toast({ title: "OTP Sent", description: "Check your phone for the one-time password." });
    } catch (error) {
      console.error("Error sending OTP:", error);
      let description = "Failed to send OTP. Check number and try again.";
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-phone-number') description = "Please check the number and try again.";
        else if (error.code === 'auth/operation-not-allowed') description = "Phone number sign-in is not enabled for this project. Please enable it in your Firebase console.";
        else if (error.code === 'auth/api-key-not-valid') description = "Firebase setup is incomplete. Please update your .env file.";
      }
      toast({ variant: "destructive", title: "Error", description });
    } finally {
      setPhoneLoading(false);
    }
  };

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneLoading(true);
    if (!window.confirmationResult) return;

    try {
      await window.confirmationResult.confirm(otp);
      toast({ title: "Success!", description: "You are now logged in." });
      router.push(redirect);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({ variant: "destructive", title: "Error", description: "Invalid OTP. Please try again." });
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <div className="space-y-6">
       <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={googleLoading || phoneLoading || loading}>
            {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.3 64.5c-24.5-23.4-58.2-37.9-96.6-37.9-84.9 0-153.5 68.6-153.5 153.5S163.1 409.5 248 409.5c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
            }
            Sign in with Google
        </Button>
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
        </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email"><Mail className="mr-2 h-4 w-4" /> Email</TabsTrigger>
          <TabsTrigger value="phone"><Phone className="mr-2 h-4 w-4" /> Phone</TabsTrigger>
        </TabsList>
        <TabsContent value="email" className="space-y-4 pt-4">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onEmailPasswordSubmit)} className="space-y-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" disabled={loading || googleLoading || phoneLoading} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
            </form>
            </Form>
             <p className="px-1 text-center text-sm text-muted-foreground">
                <button onClick={() => setIsSignUp(!isSignUp)} className="underline underline-offset-4 hover:text-primary">
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </button>
            </p>
        </TabsContent>
        <TabsContent value="phone" className="pt-4">
          {!isOtpSent ? (
            <form onSubmit={onPhoneSignInSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g., 919876543210"
                  required
                />
                <p className="text-xs text-muted-foreground px-1">Include country code without '+' or spaces.</p>
              </div>
              <Button type="submit" disabled={phoneLoading || googleLoading || loading} className="w-full">
                {phoneLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={onOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={phoneLoading || googleLoading || loading} className="w-full">
                {phoneLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify OTP
              </Button>
            </form>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
