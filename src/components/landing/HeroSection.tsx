import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
    return (
        <section className="relative text-center py-20 md:py-32 flex flex-col items-center justify-center">
            <div className="absolute inset-0">
                <Image
                    src="https://placehold.co/1920x1080.png"
                    alt="Local community marketplace"
                    data-ai-hint="local community market"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
            </div>
            <div className="relative z-10 max-w-4xl mx-auto px-4">
                <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter text-primary">
                    Empower Your Neighborhood with LocalLink
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-body">
                    Find or offer everyday skills and services — right next door.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild size="lg" className="font-headline text-lg">
                        <Link href="/login">Get Started</Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary" className="font-headline text-lg">
                        <Link href="/search">Explore Services</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
