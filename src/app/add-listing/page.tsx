"use client";

import AddListingForm from "@/components/AddListingForm";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, PenSquare } from "lucide-react";

export default function AddListingPage() {
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // Determine if we have initial data from the AI chatbot
    const initialData = useMemo(() => {
        const data: {[key: string]: any} = {
            name: searchParams.get('name') || undefined,
            serviceName: searchParams.get('serviceName') || undefined,
            description: searchParams.get('description') || undefined,
            location: searchParams.get('location') || undefined,
            availability: searchParams.get('availability') || undefined,
            charges: searchParams.get('charges') || undefined,
            contact: searchParams.get('contact') || undefined,
        };
        // Remove undefined keys so they don't override form defaults with empty strings
        Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
        return data;
    }, [searchParams]);

    const hasInitialData = useMemo(() => Object.keys(initialData).length > 0, [initialData]);

    // State to control which view is shown: choice or form
    const [showForm, setShowForm] = useState(hasInitialData);

    useEffect(() => {
        // If the user navigates back to this page, ensure the correct view is shown
        setShowForm(hasInitialData);
    }, [hasInitialData]);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                // Not logged in, redirect to login
                const redirectQuery = new URLSearchParams(window.location.search).toString();
                router.push(`/login?redirect=/add-listing${redirectQuery ? '&' + redirectQuery : ''}`);
            } else if (!userProfile?.profileCompleted) {
                // Logged in, but profile is not complete
                toast({
                    variant: "destructive",
                    title: "Profile Incomplete",
                    description: "Please complete your profile before adding a listing.",
                });
                router.push('/profile');
            }
        }
    }, [user, userProfile, loading, router, toast]);

    if (loading || !user || !userProfile?.profileCompleted) {
        return (
            <div className="max-w-2xl mx-auto">
                <Skeleton className="h-8 w-1/3 mb-6" />
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/5" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/5" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/5" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                    <Skeleton className="h-12 w-1/4" />
                </div>
            </div>
        );
    }
    
    if (!showForm) {
        return (
            <div className="max-w-4xl mx-auto text-center py-8">
                <h1 className="font-headline text-3xl font-bold mb-4">How would you like to create your listing?</h1>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Choose an option below. You can either fill out the form yourself, or let our AI assistant help you create a great listing in seconds.</p>
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="text-left flex flex-col hover:shadow-lg hover:border-primary transition-all duration-300">
                        <CardHeader>
                            <div className="bg-primary/10 p-3 rounded-full mb-4 w-fit">
                                <Sparkles className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="font-headline">Generate with AI</CardTitle>
                            <CardDescription>
                                Let our smart assistant help you. Just describe your service in your own words, and we'll handle the rest.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto pt-4">
                             <Button asChild className="w-full">
                                <Link href="/chatbot">Use AI Assistant</Link>
                            </Button>
                        </CardContent>
                    </Card>
                     <Card className="text-left flex flex-col hover:shadow-lg hover:border-primary transition-all duration-300">
                        <CardHeader>
                            <div className="bg-primary/10 p-3 rounded-full mb-4 w-fit">
                                <PenSquare className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="font-headline">Fill Manually</CardTitle>
                            <CardDescription>
                                Prefer to do it yourself? Fill out our straightforward form to create your service listing step-by-step.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto pt-4">
                           <Button onClick={() => setShowForm(true)} className="w-full" variant="secondary">
                                Fill Form Manually
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="font-headline text-3xl font-bold mb-6">Offer a Skill or Product</h1>
             {hasInitialData && (
                 <div className="mb-6 p-4 bg-accent/20 border-l-4 border-accent text-accent-foreground rounded-r-md">
                    <p className="font-semibold">Drafted by AI Assistant</p>
                    <p className="text-sm mt-1">Review the details our AI created for you, make any edits, and submit your listing!</p>
                </div>
            )}
            <AddListingForm
              userId={user.uid}
              name={userProfile.displayName}
              location={userProfile.location}
              initialData={initialData}
            />
        </div>
    );
}
