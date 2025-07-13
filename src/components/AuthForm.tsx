"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const emailPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type EmailPasswordFormValues = z.infer<typeof emailPasswordSchema>;

const AuthForm = () => {
  const { loading, signInWithGoogle, createUser, signIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  
  const form = useForm<EmailPasswordFormValues>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: "", password: "" },
  });

  const onEmailPasswordSubmit = async (data: EmailPasswordFormValues) => {
    if (isSignUp) {
      await createUser(data.email, data.password);
    } else {
      await signIn(data.email, data.password);
    }
  };

  return (
    <div className="space-y-6">
       <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
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
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="email"><Mail className="mr-2 h-4 w-4" /> Email</TabsTrigger>
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
                <Button type="submit" disabled={loading} className="w-full">
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
      </Tabs>
    </div>
  );
};

export default AuthForm;
