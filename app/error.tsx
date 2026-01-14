"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <h1 className="font-serif text-4xl mb-4">Something went wrong!</h1>
            <p className="text-gray-500 max-w-md mb-8">
                We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            <div className="flex gap-4">
                <Button
                    onClick={() => reset()}
                    className="bg-black text-white hover:bg-gray-800 rounded-none px-8 py-6 uppercase tracking-widest text-sm"
                >
                    Try Again
                </Button>
            </div>
        </div>
    );
}
