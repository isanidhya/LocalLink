"use client";

import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Provider } from '@/lib/types';
import ProviderCard from '@/components/ProviderCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Frown } from 'lucide-react';

export default function SearchPage() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [serviceFilter, setServiceFilter] = useState('all');

    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true);
            try {
                const providersCollection = collection(firestore, 'providers');
                const q = query(providersCollection, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const providersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Provider));
                setProviders(providersData);
            } catch (error) {
                console.error("Error fetching providers:", error);
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
