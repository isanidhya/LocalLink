"use client";

import AddListingForm from "@/components/AddListingForm";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddListingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Create initial data from search params, only if they exist
    const initialData: {[key: string]: any} = {
        name: searchParams.get('name') || undefined,
        serviceName: searchParams.get('serviceName') || undefined,
        description: searchParams.get('description') || undefined,
        location: searchParams.get('location') || undefined,
        availability: searchParams.get('availability') || undefined,
        charges: searchParams.get('charges') || undefined,
        contact: searchParams.get('contact') || undefined,
    };
    
    // Remove undefined keys so they don't override form defaults with empty strings
    Object.keys(initialData).forEach(key => initialData[key] === undefined && delete initialData[key]);

    useEffect(() => {
        if (!loading && !user) {
            const redirectQuery = new URLSearchParams(window.location.search).toString();
            router.push(`/login?redirect=/add-listing${redirectQuery ? '&' + redirectQuery : ''}`);
        }
    }, [user, loading, router]);

    if (loading || !user) {
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
    
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="font-headline text-3xl font-bold mb-6">Offer a Skill or Product</h1>
            <AddListingForm userId={user.uid} initialData={initialData} />
        </div>
    );
}
