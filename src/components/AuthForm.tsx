"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

declare global {
    interface Window {
      recaptchaVerifier: RecaptchaVerifier;
      confirmationResult?: ConfirmationResult;
    }
}

const AuthForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  
  useEffect(() => {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': () => {
                // reCAPTCHA solved
            },
        });
    }
  }, []);

  const onSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const appVerifier = window.recaptchaVerifier;
    const formattedPhoneNumber = `+${phoneNumber.replace(/\D/g, '')}`;
    
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setIsOtpSent(true);
      toast({ title: "OTP Sent", description: "Check your phone for the one-time password." });
    } catch (error) {
      console.error("Error sending OTP:", error);
      let title = "Error";
      let description = "Failed to send OTP. Check number and try again.";

      if (error instanceof FirebaseError && error.code === 'auth/api-key-not-valid') {
        title = "Configuration Error";
        description = "Firebase setup is incomplete. Please check your API keys in the .env file.";
      }
      
      toast({ variant: "destructive", title, description });
    } finally {
      setLoading(false);
    }
  };

  const onOtpSubmit = async (e: React.Event) => {
    e.preventDefault();
    setLoading(true);
    if (!window.confirmationResult) return;

    try {
      await window.confirmationResult.confirm(otp);
      toast({ title: "Success!", description: "You are now logged in." });
      router.push(redirect);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({ variant: "destructive", title: "Error", description: "Invalid OTP. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOtpSent ? (
        <form onSubmit={onSignInSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g., 919876543210"
              required
              className="mt-1"
            />
             <p className="text-xs text-muted-foreground mt-1">Include country code without '+' or spaces.</p>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={onOtpSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium">
              Enter OTP
            </label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify OTP
          </Button>
        </form>
      )}
    </>
  );
};

export default AuthForm;
