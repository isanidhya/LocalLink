import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const useCases = [
    {
        name: 'Ravi',
        story: 'Offers AC repair after his regular job hours, earning extra income for his family.',
        image: 'https://placehold.co/400x400.png',
        hint: 'mechanic repair',
    },
    {
        name: 'Meena',
        story: 'Sells delicious homemade papad and snacks, turning her passion for cooking into a small business.',
        image: 'https://placehold.co/400x400.png',
        hint: 'woman cooking',
    },
    {
        name: 'Amit',
        story: 'Needed a carpenter urgently for a broken chair and found a skilled craftsman just two streets away.',
        image: 'https://placehold.co/400x400.png',
        hint: 'carpenter working',
    },
];

export default function UseCasesSection() {
    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">Real People, Real Connections</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        LocalLink is for everyone. See how people are using it.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {useCases.map((useCase) => (
                        <Card key={useCase.name} className="overflow-hidden group">
                            <div className="relative h-64 w-full">
                                <Image
                                    src={useCase.image}
                                    alt={useCase.name}
                                    data-ai-hint={useCase.hint}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <CardContent className="p-6">
                                <p className="text-muted-foreground italic">"{useCase.story}"</p>
                                <p className="font-headline font-semibold text-right mt-4">- {useCase.name}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
