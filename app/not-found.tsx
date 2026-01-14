import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <h1 className="font-serif text-6xl md:text-8xl mb-4">404</h1>
            <h2 className="text-xl md:text-2xl font-medium mb-4">Page Not Found</h2>
            <p className="text-gray-500 max-w-md mb-8">
                We couldn't find the page you were looking for. It might have been moved or deleted.
            </p>
            <Link href="/">
                <Button className="bg-black text-white hover:bg-gray-800 rounded-none px-8 py-6 uppercase tracking-widest text-sm">
                    Return Home
                </Button>
            </Link>
        </div>
    );
}
