"use client";

import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Provider } from '@/lib/types';
import ProviderCard from '@/components/ProviderCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Frown, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const dummyProviders: Provider[] = [
    {
        id: 'dummy-1',
        name: 'Suresh Kumar',
        serviceName: 'Expert Plumbing',
        description: 'Over 15 years of experience in all types of plumbing work, from leaky faucets to full pipe installations. Available for emergency services.',
        location: 'Koramangala, Bangalore',
        availability: 'Mon - Sat, 8am - 7pm',
        charges: 'Starts at ₹250',
        contact: '9876543210',
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'plumber working',
        createdAt: Timestamp.now(),
        userId: 'dummy-user-1',
    },
    {
        id: 'dummy-2',
        name: 'Anjali Sharma',
        serviceName: 'Homemade Tiffin Service',
        description: 'Delicious and healthy North Indian meals delivered to your doorstep. Weekly and monthly plans available. 100% vegetarian.',
        location: 'Indiranagar, Bangalore',
        availability: 'Daily, 12pm - 2pm, 7pm - 9pm',
        charges: '₹120 per meal',
        contact: 'anjali.tiffin@email.com',
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'indian food',
        createdAt: Timestamp.now(),
        userId: 'dummy-user-2',
    },
    {
        id: 'dummy-3',
        name: 'Ramesh Tailors',
        serviceName: 'Clothing Alterations',
        description: 'Expert tailoring and alteration for all types of garments. Specializing in suit fittings and dress modifications. Quick turnaround.',
        location: 'Jayanagar, Bangalore',
        availability: 'Tue - Sun, 10am - 8pm',
        charges: 'From ₹100',
        contact: '9988776655',
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'tailor sewing',
        createdAt: Timestamp.now(),
        userId: 'dummy-user-3',
    },
     {
        id: 'dummy-4',
        name: 'Priya Mehendi Art',
        serviceName: 'Bridal Mehendi Artist',
        description: 'Intricate and beautiful mehendi designs for weddings, festivals, and special occasions. Using only organic henna cones.',
        location: 'Malleshwaram, Bangalore',
        availability: 'By Appointment',
        charges: 'Packages from ₹3000',
        contact: 'priya.art@email.com',
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'henna hands',
        createdAt: Timestamp.now(),
        userId: 'dummy-user-4',
    },
    {
        id: 'dummy-5',
        name: 'Vikram Singh',
        serviceName: 'AC & Fridge Repair',
        description: 'Fast and reliable repair services for all brands of air conditioners and refrigerators. 30-day service warranty.',
        location: 'Whitefield, Bangalore',
        availability: 'All Days, 9am - 9pm',
        charges: 'Inspection at ₹300',
        contact: '9123456789',
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'technician repair',
        createdAt: Timestamp.now(),
        userId: 'dummy-user-5',
    },
    {
        id: 'dummy-6',
        name: 'Deepa\'s Coaching',
        serviceName: 'Maths & Science Tuition',
        description: 'Personalized coaching for students from Class 8 to 10 (CBSE). Focus on concept clarity and building a strong foundation.',
        location: 'HSR Layout, Bangalore',
        availability: 'Mon - Fri, 4pm - 7pm',
        charges: '₹4000/month',
        contact: 'deepa.coach@email.com',
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'student studying',
        createdAt: Timestamp.now(),
        userId: 'dummy-user-6',
    },
];

export default function SearchPage() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [serviceFilter, setServiceFilter] = useState('all');
    const [isSampleData, setIsSampleData] = useState(false);

    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true);
            try {
                const providersCollection = collection(firestore, 'providers');
                const q = query(providersCollection, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const providersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Provider));
                
                if (providersData.length === 0) {
                    setProviders(dummyProviders);
                    setIsSampleData(true);
                } else {
                    setProviders(providersData);
                    setIsSampleData(false);
                }
            } catch (error) {
                console.error("Error fetching providers:", error);
                setProviders(dummyProviders);
                setIsSampleData(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, []);

    const uniqueServices = useMemo(() => {
        const services = new Set(providers.map(p => p.serviceName));
        return ['all', ...Array.from(services)];
    }, [providers]);

    const filteredProviders = useMemo(() => {
        return providers.filter(provider => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const matchesSearch = lowerSearchTerm === '' ||
                provider.name.toLowerCase().includes(lowerSearchTerm) ||
                provider.serviceName.toLowerCase().includes(lowerSearchTerm) ||
                provider.description.toLowerCase().includes(lowerSearchTerm) ||
                provider.location.toLowerCase().includes(lowerSearchTerm);

            const matchesFilter = serviceFilter === 'all' || provider.serviceName === serviceFilter;

            return matchesSearch && matchesFilter;
        });
    }, [providers, searchTerm, serviceFilter]);
    
    return (
        <div>
            <h1 className="font-headline text-3xl font-bold mb-6">Find a Local Service</h1>
            
            {isSampleData && (
                <Alert className="mb-6 bg-accent/30 border-accent/50">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Showing Sample Data</AlertTitle>
                    <AlertDescription>
                        Your database is currently empty. We're displaying sample listings to show you how the page will look. Add a listing to see your own data!
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Input
                    placeholder="Search by keyword or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                />
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                    <SelectTrigger className="w-full md:w-[280px]">
                        <SelectValue placeholder="Filter by service type" />
                    </SelectTrigger>
                    <SelectContent>
                        {uniqueServices.map(service => (
                            <SelectItem key={service} value={service}>{service === 'all' ? 'All Services' : service}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => <ProviderCardSkeleton key={i} />)}
                </div>
            ) : filteredProviders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProviders.map(provider => (
                        <ProviderCard key={provider.id} provider={provider} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <Frown className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No services found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Try adjusting your search or filters.
                    </p>
                </div>
            )}
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
