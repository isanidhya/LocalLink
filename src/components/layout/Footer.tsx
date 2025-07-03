import Link from 'next/link';
import { Twitter, Facebook, Instagram, Wrench } from 'lucide-react';
import { Button } from '../ui/button';

export default function Footer() {
    return (
        <footer className="bg-muted/50 border-t mt-auto">
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <Wrench className="h-6 w-6 text-primary" />
                        <span className="font-headline text-2xl font-bold">LocalLink</span>
                    </div>
                    <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
                        <Button variant="link" className="text-muted-foreground" asChild>
                            <Link href="#">About</Link>
                        </Button>
                        <Button variant="link" className="text-muted-foreground" asChild>
                            <Link href="#">Contact</Link>
                        </Button>
                        <Button variant="link" className="text-muted-foreground" asChild>
                            <Link href="#">Privacy Policy</Link>
                        </Button>
                    </nav>
                    <div className="flex gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="#"><Twitter className="h-5 w-5" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="#"><Facebook className="h-5 w-5" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="#"><Instagram className="h-5 w-5" /></Link>
                        </Button>
                    </div>
                </div>
                <div className="text-center text-muted-foreground mt-8 pt-8 border-t">
                    <p>Made with ❤️ for local India</p>
                    <p>&copy; {new Date().getFullYear()} LocalLink. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
