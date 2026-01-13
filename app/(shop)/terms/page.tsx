export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="pt-32 pb-12 px-6 md:px-12 max-w-4xl mx-auto w-full">
                <h1 className="text-4xl md:text-5xl font-serif mb-8">Terms of Service</h1>
                <div className="prose max-w-none text-gray-600 space-y-6">
                    <p>Last updated: January 2026</p>

                    <h3 className="text-xl font-medium text-black mt-8">1. Acceptance of Terms</h3>
                    <p>By accessing or using Ivy Avenue, you agree to be bound by these Terms of Service.</p>

                    <h3 className="text-xl font-medium text-black mt-8">2. Use of Service</h3>
                    <p>You agree to use our website for lawful purposes only and not to violate any applicable laws or regulations.</p>

                    <h3 className="text-xl font-medium text-black mt-8">3. Purchases</h3>
                    <p>All purchases made through our site are subject to product availability and our return policy. We reserve the right to refuse or cancel any order.</p>

                    <h3 className="text-xl font-medium text-black mt-8">4. Intellectual Property</h3>
                    <p>The content on this website, including images, text, and logos, is the property of Ivy Avenue and protected by copyright laws.</p>

                    <h3 className="text-xl font-medium text-black mt-8">5. Changes to Terms</h3>
                    <p>We reserve the right to modify these terms at any time. Your continued use of the site constitutes acceptance of updated terms.</p>
                </div>
            </div>
        </div>
    );
}
