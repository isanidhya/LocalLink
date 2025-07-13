
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserProfile } from '@/hooks/use-auth';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Listing } from '@/lib/types';
import ProviderCard from '@/components/ProviderCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const profileFormSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name is too long."),
  location: z.string().min(3, "Location is required.").max(100, "Location is too long."),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;


export default function ProfilePage() {
    const { user, userProfile, loading: authLoading, refetchUserProfile } = useAuth();
    const router = useRouter();
    const [listings, setListings] = useState<Listing[]>([]);
    const [listingsLoading, setListingsLoading] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            displayName: '',
            location: '',
        },
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/profile');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (userProfile) {
            form.reset({
                displayName: userProfile.displayName || user?.displayName || '',
                location: userProfile.location || '',
            });
        }
    }, [userProfile, user, form]);

    useEffect(() => {
        if (user) {
            const fetchListings = async () => {
                setListingsLoading(true);
                try {
                    const q = query(
                        collection(db, 'listings'),
                        where('userId', '==', user.uid),
                        orderBy('createdAt', 'desc')
                    );
                    const querySnapshot = await getDocs(q);
                    const userListings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
                    setListings(userListings);
                } catch (error) {
                    console.error("Error fetching user listings:", error);
                } finally {
                    setListingsLoading(false);
                }
            };
            fetchListings();
        }
    }, [user]);

    const onSubmit = async (data: ProfileFormValues) => {
        if (!user || !auth.currentUser) return;
        setFormSubmitting(true);
        try {
            await updateProfile(auth.currentUser, { displayName: data.displayName });
            
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                displayName: data.displayName,
                location: data.location,
                profileCompleted: true,
            });

            await refetchUserProfile();

            toast({
                title: 'Profile Updated!',
                description: 'Your information has been saved successfully.',
            });
            
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not update your profile. Please try again.',
            });
        } finally {
            setFormSubmitting(false);
        }
    };


    if (authLoading || !user || !userProfile) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <Skeleton className="h-64 w-full" />
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
            {userProfile && !userProfile.profileCompleted && (
                <Card className="mb-8 bg-accent/20 border-accent">
                    <CardHeader>
                        <CardTitle className="text-accent-foreground">Complete Your Profile</CardTitle>
                        <CardDescription className="text-accent-foreground/80">
                            Please fill out your name and location to start offering your skills and products.
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Account Details</CardTitle>
                            <CardDescription>Update your public profile information.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField control={form.control} name="displayName" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="location" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl><Input placeholder="e.g., Neighborhood, City" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                     <div className="flex items-center gap-3 text-sm pt-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{user.email || 'No email provided'} (read-only)</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{user.phoneNumber || 'No phone number'} (read-only)</span>
                                    </div>
                                    <Button type="submit" disabled={formSubmitting} className="w-full">
                                        {formSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                         <CardFooter className="flex flex-col items-start gap-2 text-xs text-muted-foreground border-t pt-4">
                            <div className="flex items-center gap-2">
                                <LogIn className="h-3 w-3" />
                                <span>Logged in with {getLoginProvider()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-3 w-3" />
                                <span>Member since {new Date(user.metadata.creationTime!).toLocaleDateString()}</span>
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Your Listings</CardTitle>
                            <CardDescription>Services and products you are currently offering.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {listingsLoading ? (
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
                                    <Button asChild className="mt-4" disabled={userProfile && !userProfile.profileCompleted}>
                                        <Link href="/add-listing">Offer a Service</Link>
                                    </Button>
                                    {userProfile && !userProfile.profileCompleted && <p className="text-xs text-destructive mt-2">Please complete your profile first.</p>}
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
