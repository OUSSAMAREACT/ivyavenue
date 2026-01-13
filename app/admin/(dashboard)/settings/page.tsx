import prisma from "@/lib/prisma";
import SettingsForm from "./settings-form";

export default async function SettingsPage() {
    const settings = await prisma.storeSettings.findUnique({
        where: { id: "default" },
    });

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-3xl mb-8">Store Settings</h1>

            <div className="bg-white border border-gray-100 p-8 shadow-sm">
                <SettingsForm initialSettings={settings} />
            </div>
        </div>
    );
}
