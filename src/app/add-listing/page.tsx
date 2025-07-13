
import { Suspense } from 'react';
import AddListingPageContent from './AddListingPageContent';

export default function AddListingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AddListingPageContent />
        </Suspense>
    );
}
