
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Provider } from '@/lib/types';
import ProviderCard from '@/components/ProviderCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [listings, setListings] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/profile');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            const fetchListings = async () => {
                setLoading(true);
                try {
                    const q = query(
                        collection(firestore, 'providers'),
                        where('userId', '==', user.uid),
                        orderBy('createdAt', 'desc')
                    );
                    const querySnapshot = await getDocs(q);
                    const userListings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Provider));
                    setListings(userListings);
                } catch (error) {
                    console.error("Error fetching user listings:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchListings();
        }
    }, [user]);

    if (authLoading || !user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <Skeleton className="h-48 w-full" />
                    </div>
                    <div className="md:col-span-2">
                        <Skeleton className="h-8 w-1/2 mb-6" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </div>
            </div>
        );
    }
    
    const getLoginProvider = () => {
        if (!user.providerData || user.providerData.length === 0) return 'Unknown';
        const providerId = user.providerData[0].providerId;
        if (providerId.includes('google')) return 'Google';
        if (providerId.includes('phone')) return 'Phone Number';
        if (providerId.includes('password')) return 'Email/Password';
        return providerId;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="font-headline text-3xl font-bold mb-8">Your Profile</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="items-center text-center">
                            <Avatar className="h-24 w-24 mb-4 border-4 border-primary">
                                <AvatarFallback className="bg-primary/20">
                                    <User className="h-12 w-12 text-primary" />
                                </AvatarFallback>
                            </Avatar>
                            <CardTitle className="font-headline text-2xl">{user.displayName || 'Anonymous User'}</CardTitle>
                            <CardDescription>Member since {new Date(user.metadata.creationTime!).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                             <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user.email || 'No email provided'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{user.phoneNumber || 'No phone number'}</span>
                            </div>
                           <div className="flex items-center gap-3">
                                <LogIn className="h-4 w-4 text-muted-foreground" />
                                <span>Logged in with {getLoginProvider()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Your Listings</CardTitle>
                            <CardDescription>Services and products you are currently offering.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ProviderCardSkeleton />
                                    <ProviderCardSkeleton />
                                </div>
                            ) : listings.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {listings.map(listing => (
                                        <ProviderCard key={listing.id} provider={listing} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                    <h3 className="text-lg font-semibold">You haven't listed any services yet.</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Click the button below to offer your skills to the community!
                                    </p>
                                    <Button asChild className="mt-4">
                                        <Link href="/add-listing">Offer a Service</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


const ProviderCardSkeleton = () => (
    <Card>
        <CardContent className="p-4 space-y-3">
            <Skeleton className="h-40 w-full" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-8 w-1/3" />
            </div>
        </CardContent>
    </Card>
);
