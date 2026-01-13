"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="bg-black text-white py-20 px-6 md:px-12 text-center">
                <h1 className="text-4xl md:text-5xl font-serif">Contact Us</h1>
                <p className="mt-4 text-gray-400 max-w-lg mx-auto">We'd love to hear from you. Get in touch with our team.</p>
            </div>

            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-serif mb-4">Customer Care</h3>
                        <p className="text-gray-600 mb-2">Our team is available Monday through Friday, 9am to 5pm EST.</p>
                        <p className="text-black font-medium">support@ivyavenue.com</p>
                        <p className="text-black font-medium">+1 (555) 123-4567</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-serif mb-4">Visit Our Studio</h3>
                        <p className="text-gray-600">123 Floral Way<br />New York, NY 10012</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-serif mb-4">Wholesale Inquiries</h3>
                        <p className="text-gray-600 mb-2">For trade accounts and bulk orders:</p>
                        <p className="text-black font-medium">wholesale@ivyavenue.com</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-gray-50 p-8 md:p-12">
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <Input placeholder="Your name" className="bg-white rounded-none border-gray-200" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <Input type="email" placeholder="email@example.com" className="bg-white rounded-none border-gray-200" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <Textarea placeholder="How can we help?" rows={5} className="bg-white rounded-none border-gray-200 resize-none" />
                        </div>
                        <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-none h-12">
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
