"use client";

import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LoginPageContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    useEffect(() => {
        if (!loading && user) {
            router.push(redirect);
        }
    }, [user, loading, router, redirect]);

    if (loading || user) {
        return (
            <div className="flex justify-center items-center h-full">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center py-12">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Login or Sign Up</CardTitle>
                    <CardDescription>Choose your preferred method to continue.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AuthForm />
                </CardContent>
            </Card>
        </div>
    );
}
