"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AddListingForm } from '@/components/AddListingForm';

function AddListingFormWrapper() {
  const searchParams = useSearchParams();
  const initialDescription = searchParams.get('description') || '';

  return <AddListingForm initialDescription={initialDescription} />;
}

// Wrap the component in Suspense to handle the initial render
export default function AddListingFormWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddListingFormWrapper />
    </Suspense>
  );
}
