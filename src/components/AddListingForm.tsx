"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const formSchema = z.object({
  serviceName: z.string().min(3, "Service name is too short").max(100),
  description: z.string().min(10, "Description is too short").max(500),
  availability: z.string().min(2, "Availability is required"),
  charges: z.string().min(1, "Charges are required"),
  contact: z.string().min(10, "A valid contact is required"),
  image: z.instanceof(File).optional(),
});

type AddListingFormValues = z.infer<typeof formSchema>;

interface AddListingFormProps {
  userId: string;
  initialData?: Partial<AddListingFormValues>;
}

export default function AddListingForm({ userId, initialData = {} }: AddListingFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { userProfile } = useAuth();

  const form = useForm<AddListingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceName: "",
      description: "",
      availability: "",
      charges: "",
      contact: "",
      ...initialData,
    },
  });

  const onSubmit = async (data: AddListingFormValues) => {
    if (!userProfile?.profileCompleted) {
        toast({ variant: "destructive", title: "Error", description: "Your profile is not complete." });
        return;
    }
    setLoading(true);
    try {
      let imageUrl = "";
      if (data.image) {
        const imageRef = ref(storage, `providers/${userId}/${data.image.name}-${Date.now()}`);
        const snapshot = await uploadBytes(imageRef, data.image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(firestore, "providers"), {
        userId,
        name: userProfile.displayName,
        location: userProfile.location,
        serviceName: data.serviceName,
        description: data.description,
        availability: data.availability,
        charges: data.charges,
        contact: data.contact,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
      });

      toast({ title: "Success!", description: "Your listing has been created." });
      router.push("/search");
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({ variant: "destructive", title: "Error", description: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField control={form.control} name="serviceName" render={({ field }) => (
            <FormItem>
              <FormLabel>Service/Product Name</FormLabel>
              <FormControl><Input placeholder="e.g., Plumbing Services, Homemade Cakes" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
        )} />
        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea placeholder="Describe your service or product in detail." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
        )} />
        <FormField control={form.control} name="availability" render={({ field }) => (
            <FormItem>
              <FormLabel>Availability</FormLabel>
              <FormControl><Input placeholder="e.g., Mon-Fri, 9am-5pm" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
        )} />
        <FormField control={form.control} name="charges" render={({ field }) => (
            <FormItem>
              <FormLabel>Charges</FormLabel>
              <FormControl><Input placeholder="e.g., $50/hour, Starts from $20" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
        )} />
        <FormField control={form.control} name="contact" render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Info (Phone/Email)</FormLabel>
              <FormControl><Input placeholder="your.email@example.com or 9876543210" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
        )} />
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...rest }}) => (
            <FormItem>
              <FormLabel>Photo (Optional)</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)} {...rest} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Listing
        </Button>
      </form>
    </Form>
  );
}
