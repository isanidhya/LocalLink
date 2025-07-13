"use client";

import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Listing } from '@/lib/types';
import ProviderCard from '@/components/ProviderCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Frown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

export default function SearchPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [serviceFilter, setServiceFilter] = useState('all');
    const { toast } = useToast();

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                const listingsCollection = collection(db, 'listings');
                const q = query(listingsCollection, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const listingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
                setListings(listingsData);
            } catch (error) {
                console.error("Error fetching listings:", error);
                toast({
                    variant: "destructive",
                    title: "Error fetching data",
                    description: "Could not load listings from the database. Please try again later.",
                });
                setListings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [toast]);

    const uniqueServices = useMemo(() => {
        const services = new Set(listings.map(p => p.serviceName));
        return ['all', ...Array.from(services)];
    }, [listings]);

    const filteredListings = useMemo(() => {
        return listings.filter(listing => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const matchesSearch = lowerSearchTerm === '' ||
                listing.name.toLowerCase().includes(lowerSearchTerm) ||
                listing.serviceName.toLowerCase().includes(lowerSearchTerm) ||
                listing.description.toLowerCase().includes(lowerSearchTerm) ||
                listing.location.toLowerCase().includes(lowerSearchTerm);

            const matchesFilter = serviceFilter === 'all' || listing.serviceName === serviceFilter;

            return matchesSearch && matchesFilter;
        });
    }, [listings, searchTerm, serviceFilter]);
    
    return (
        <div>
            <h1 className="font-headline text-3xl font-bold mb-6">Find a Local Service</h1>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Input
                    placeholder="Search by keyword or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                />
                <Select value={serviceFilter} onValueChange={setServiceFilter} disabled={loading || listings.length === 0}>
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
            ) : filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map(listing => (
                        <ProviderCard key={listing.id} provider={listing} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <Frown className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No services found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Try adjusting your search or filters. You can add a new service to see it here!
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
