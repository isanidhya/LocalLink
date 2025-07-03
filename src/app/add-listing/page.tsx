"use client";

import AddListingForm from "@/components/AddListingForm";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddListingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?redirect=/add-listing');
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
            <AddListingForm userId={user.uid} />
        </div>
    );
}
