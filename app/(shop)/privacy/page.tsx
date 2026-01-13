export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="pt-32 pb-12 px-6 md:px-12 max-w-4xl mx-auto w-full">
                <h1 className="text-4xl md:text-5xl font-serif mb-8">Privacy Policy</h1>
                <div className="prose max-w-none text-gray-600 space-y-6">
                    <p>Last updated: January 2026</p>
                    <p>At Ivy Avenue, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>

                    <h3 className="text-xl font-medium text-black mt-8">1. Information We Collect</h3>
                    <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or sign up for our newsletter. This may include your name, email address, shipping address, and payment information.</p>

                    <h3 className="text-xl font-medium text-black mt-8">2. How We Use Your Information</h3>
                    <p>We use your information to process your orders, communicate with you about your account, and improve our services. We do not sell your personal data to third parties.</p>

                    <h3 className="text-xl font-medium text-black mt-8">3. Cookies</h3>
                    <p>We use cookies to enhance your browsing experience and analyze site traffic. You can control cookie preferences through your browser settings.</p>

                    <h3 className="text-xl font-medium text-black mt-8">4. Contact Us</h3>
                    <p>If you have any questions about this Privacy Policy, please contact us at privacy@ivyavenue.com.</p>
                </div>
            </div>
        </div>
    );
}
