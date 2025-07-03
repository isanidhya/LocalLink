import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 md:py-24">
      <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-primary">
        Welcome to LocalLink
      </h1>
      <p className="mt-4 max-w-2xl text-lg md:text-xl text-muted-foreground font-body">
        Connecting local skills with community needs. Offer your services or find the help you need, right in your neighborhood.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="font-headline text-lg">
          <Link href="/add-listing">Offer a Skill or Product</Link>
        </Button>
        <Button asChild size="lg" variant="secondary" className="font-headline text-lg">
          <Link href="/search">Find a Local Service</Link>
        </Button>
      </div>
      <div className="mt-16 w-full max-w-4xl">
        <Image
          src="https://placehold.co/1200x600.png"
          alt="Community collaboration"
          data-ai-hint="community services"
          width={1200}
          height={600}
          className="rounded-lg shadow-xl object-cover"
        />
      </div>
    </div>
  );
}
