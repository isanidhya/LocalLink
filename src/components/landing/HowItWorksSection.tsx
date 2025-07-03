import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Search, Users } from 'lucide-react';

const steps = [
  {
    icon: <Phone className="h-10 w-10 text-primary" />,
    title: 'Sign Up with Your Phone',
    description: 'Create your account securely in seconds with just your phone number. No complex forms, no hassle.',
  },
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    title: 'Add Your Skill or Search Nearby',
    description: 'Offer your unique talent to the community or search for verified local services you need.',
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'Connect and Get Things Done!',
    description: 'Directly connect with providers or customers in your area to solve real-life needs instantly.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Getting started is as easy as 1, 2, 3.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center border-none shadow-none bg-transparent">
              <CardHeader className="flex flex-col items-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  {step.icon}
                </div>
                <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
