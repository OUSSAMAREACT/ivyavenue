"use client";

import { useActionState } from "react";
import { updateOrderStatus, updateOrderTracking } from "@/actions/orders";
import { Loader2 } from "lucide-react";

export function OrderStatusForm({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [state, action, isPending] = useActionState(updateOrderStatus, null);

    return (
        <form action={action}>
            <input type="hidden" name="orderId" value={orderId} />
            <div className="space-y-4">
                <select
                    name="status"
                    defaultValue={currentStatus}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                </select>
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-black text-white py-2 font-medium hover:bg-gray-800 transition-colors flex justify-center items-center"
                >
                    {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Update Status"}
                </button>
                {state?.error && <p className="text-red-500 text-xs">{state.error}</p>}
            </div>
        </form>
    );
}

export function OrderTrackingForm({ orderId, carrier, trackingNumber }: { orderId: string, carrier?: string, trackingNumber?: string }) {
    const [state, action, isPending] = useActionState(updateOrderTracking, null);

    return (
        <form action={action} className="space-y-4">
            <input type="hidden" name="orderId" value={orderId} />
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Carrier</label>
                <input
                    name="carrier"
                    defaultValue={carrier || ""}
                    placeholder="DHL, FedEx..."
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tracking Number</label>
                <input
                    name="trackingNumber"
                    defaultValue={trackingNumber || ""}
                    placeholder="123456789"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
            </div>
            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-white border border-black text-black py-2 font-medium hover:bg-gray-50 transition-colors text-sm flex justify-center items-center"
            >
                {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Update Tracking"}
            </button>
            {state?.error && <p className="text-red-500 text-xs">{state.error}</p>}
        </form>
    );
}
