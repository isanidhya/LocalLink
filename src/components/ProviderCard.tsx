import { Listing } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { MapPin, Clock, Phone, Wrench, Utensils, Scissors, Hand, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProviderCardProps {
    provider: Listing;
}

const getIconForService = (serviceName: string) => {
    const lowerCaseService = serviceName.toLowerCase();
    if (lowerCaseService.includes('repair') || lowerCaseService.includes('mechanic') || lowerCaseService.includes('electrician') || lowerCaseService.includes('plumb')) {
        return <Wrench className="h-16 w-16 text-primary/80" />;
    }
    if (lowerCaseService.includes('food') || lowerCaseService.includes('cake') || lowerCaseService.includes('cook') || lowerCaseService.includes('tiffin')) {
        return <Utensils className="h-16 w-16 text-primary/80" />;
    }
    if (lowerCaseService.includes('tailor') || lowerCaseService.includes('craft')) {
        return <Scissors className="h-16 w-16 text-primary/80" />;
    }
    if (lowerCaseService.includes('mehndi')) {
        return <Hand className="h-16 w-16 text-primary/80" />;
    }
    return <Briefcase className="h-16 w-16 text-primary/80" />;
};

export default function ProviderCard({ provider }: ProviderCardProps) {
    return (
        <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
            <div className="relative h-48 w-full">
                {provider.imageUrl ? (
                    <Image
                        src={provider.imageUrl}
                        alt={provider.serviceName}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-accent/50 flex items-center justify-center">
                        {getIconForService(provider.serviceName)}
                    </div>
                )}
            </div>
            <CardHeader>
                <CardTitle className="font-headline text-xl">{provider.serviceName}</CardTitle>
                <CardDescription>by {provider.name}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">{provider.description}</p>
                <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span>{provider.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <Clock className="h-4 w-4 shrink-0 text-primary" />
                    <span>{provider.availability}</span>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-muted/50 p-4 mt-auto">
                <Badge variant="outline" className="text-base font-bold text-primary border-primary">
                    {provider.charges}
                </Badge>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Phone className="h-4 w-4" />
                    <span>{provider.contact}</span>
                </div>
            </CardFooter>
        </Card>
    );
}
