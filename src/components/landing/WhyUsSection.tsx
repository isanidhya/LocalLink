import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MapPin, Clock, Users } from 'lucide-react';

const features = [
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'No GST or Registration Needed',
    description: 'Offer your skills without worrying about complex business registrations. Perfect for side-hustles.',
  },
  {
    icon: <MapPin className="h-8 w-8 text-primary" />,
    title: 'Hyperlocal & Community-Focused',
    description: 'Connect with people in your immediate vicinity. Build trust and strengthen your local community.',
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: 'Flexible Part-Time Opportunities',
    description: 'Earn extra income on your own schedule. Work when you want, as much as you want.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Empowers Everyone',
    description: 'A platform for students, homemakers, retirees, and freelancers to showcase their talents.',
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Why Choose LocalLink?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We are building a platform that truly works for the local community.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-background hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                {feature.icon}
                <CardTitle className="font-headline text-lg pt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
