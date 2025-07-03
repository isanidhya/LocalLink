"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { guideListingCreation } from '@/ai/flows/guide-listing-creation';
import { suggestListings } from '@/ai/flows/suggest-listings';
import { Bot, User as UserIcon, Loader2, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hello! How can I help you today? You can ask me to find a service (e.g., 'find a plumber') or get help offering one (e.g., 'I want to sell homemade food')." },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ userInput: string }>();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async ({ userInput }: { userInput: string }) => {
    if (!userInput.trim()) return;

    const newMessages: Message[] = [...messages, { text: userInput, sender: 'user' }];
    setMessages(newMessages);
    reset();
    setIsLoading(true);

    try {
        let response;
        const lowerUserInput = userInput.toLowerCase();
        if (lowerUserInput.includes('offer') || lowerUserInput.includes('sell') || lowerUserInput.includes('provide') || lowerUserInput.includes('create')) {
            response = await guideListingCreation({ userInput });
            setMessages([...newMessages, { text: response.listingGuidance, sender: 'bot' }]);
        } else {
            response = await suggestListings({ query: userInput });
            const suggestionsText = response.suggestions.length > 0 
                ? "Here are some suggestions I found: \n\n- " + response.suggestions.join('\n- ') + "\n\nYou can visit the 'Find Services' page to discover more!"
                : "I couldn't find specific listings for that. Try a different search term or visit the 'Find Services' page for a full search.";
            setMessages([...newMessages, { text: suggestionsText, sender: 'bot' }]);
        }
    } catch (error) {
      console.error('AI Error:', error);
      setMessages([...newMessages, { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-0">
            <div className="flex flex-col h-[70vh]">
                <ScrollArea className="flex-grow p-4">
                    <div ref={scrollAreaRef} className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                            {message.sender === 'bot' && (
                                <Avatar className="border-2 border-primary">
                                    <AvatarFallback className="bg-primary/20"><Bot className="text-primary" /></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`rounded-lg px-4 py-2 max-w-[80%] shadow-sm ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                            </div>
                            {message.sender === 'user' && (
                                <Avatar>
                                    <AvatarFallback><UserIcon /></AvatarFallback>
                                </Avatar>
                            )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-3">
                                <Avatar className="border-2 border-primary">
                                    <AvatarFallback className="bg-primary/20"><Bot className="text-primary" /></AvatarFallback>
                                </Avatar>
                                <div className="rounded-lg px-4 py-2 bg-muted shadow-sm">
                                   <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t bg-background/80">
                    <form onSubmit={handleSubmit(handleSendMessage)} className="flex gap-2">
                        <Input
                            {...register('userInput')}
                            placeholder="Type your message..."
                            autoComplete="off"
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading} size="icon" aria-label="Send message">
                            <Send className="h-4 w-4"/>
                        </Button>
                    </form>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
