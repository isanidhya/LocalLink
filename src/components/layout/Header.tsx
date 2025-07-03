"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Wrench } from 'lucide-react';

const Header = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };

  const navLinks = (
    <>
      <Button variant="ghost" asChild>
        <Link href="/search">Find Services</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/add-listing">Offer Service</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/chatbot">AI Assistant</Link>
      </Button>
      {!loading && (
        user ? (
          <Button onClick={handleSignOut}>Sign Out</Button>
        ) : (
          <Button asChild>
            <Link href="/login">Login / Sign Up</Link>
          </Button>
        )
      )}
    </>
  );

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Wrench className="h-6 w-6 text-primary" />
          <span className="font-headline text-2xl font-bold">LocalLink</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {navLinks}
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 pt-8">
                {navLinks}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
