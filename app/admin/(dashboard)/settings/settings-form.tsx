"use client";

import { updateSettings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";

// Define the state type explicitly to match action - although action returns object, useActionState hook can handle implicit inference or explicit type.
// Let's create a minimal type.
type SettingsState = {
    success: boolean;
    message?: string;
    error?: string;
} | null;

export default function SettingsForm({ initialSettings }: { initialSettings: any }) {
    const [state, formAction, isPending] = useActionState<SettingsState, FormData>(updateSettings, null);

    return (
        <form action={formAction} className="space-y-8">
            {state?.success && (
                <div className="bg-green-50 text-green-700 p-4 border border-green-200 rounded-sm">
                    {state.message}
                </div>
            )}

            {state?.error && (
                <div className="bg-red-50 text-red-700 p-4 border border-red-200 rounded-sm">
                    {state.error}
                </div>
            )}

            {/* Section: Payments */}
            <div className="space-y-4">
                <h2 className="font-medium text-lg border-b pb-2">Stripe Payments</h2>
                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Publishable Key</label>
                        <Input name="stripePublishableKey" defaultValue={initialSettings?.stripePublishableKey || ""} placeholder="pk_test_..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                        <Input name="stripeSecretKey" type="password" defaultValue={initialSettings?.stripeSecretKey || ""} placeholder="sk_test_..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret</label>
                        <Input name="stripeWebhookSecret" type="password" defaultValue={initialSettings?.stripeWebhookSecret || ""} placeholder="whsec_..." />
                        <p className="text-xs text-gray-500 mt-1">Found in Stripe Dashboard {">"} Developers {">"} Webhooks (after adding endpoint).</p>
                    </div>
                </div>
            </div>

            {/* Section: Email */}
            <div className="space-y-4">
                <h2 className="font-medium text-lg border-b pb-2">Transactional Emails (Resend)</h2>
                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                        <Input name="resendApiKey" type="password" defaultValue={initialSettings?.resendApiKey || ""} placeholder="re_123..." />
                        <p className="text-xs text-gray-500 mt-1">Found in Resend Dashboard {">"} API Keys.</p>
                    </div>
                </div>
            </div>

            {/* Section: Integrations */}
            <div className="space-y-4">
                <h2 className="font-medium text-lg border-b pb-2">WhatsApp Integration</h2>
                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <Input name="whatsappPhoneNumber" defaultValue={initialSettings?.whatsappPhoneNumber || ""} placeholder="+1234567890" />
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <Button type="submit" className="bg-black text-white hover:bg-gray-800" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Configuration"}
                </Button>
            </div>
        </form>
    );
}
