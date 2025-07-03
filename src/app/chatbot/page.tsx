import Chatbot from "@/components/Chatbot";

export default function ChatbotPage() {
    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="font-headline text-3xl font-bold">AI Assistant</h1>
                <p className="text-muted-foreground mt-2">
                    Let our AI help you find a service or create your own listing.
                </p>
            </div>
            <Chatbot />
        </div>
    );
}
