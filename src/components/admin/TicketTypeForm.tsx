"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/SubmitButton";

type TicketAction = (
  eventId: string,
  formData: FormData
) => Promise<{ error?: string; success?: boolean }>;

interface TicketTypeFormProps {
  eventId: string;
  action: TicketAction;
}

type FormState = { error?: string; success?: boolean };

export function TicketTypeForm({ eventId, action }: TicketTypeFormProps) {
  const [state, formAction] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      return action(eventId, formData);
    },
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            required
            placeholder="General Admission"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Price in cents <span className="text-red-500">*</span>
          </label>
          <input
            name="priceCents"
            type="number"
            required
            min={1}
            placeholder="5000 = €50"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Capacity{" "}
            <span className="text-gray-400">(blank = unlimited)</span>
          </label>
          <input
            name="capacity"
            type="number"
            min={1}
            placeholder="100"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
          />
        </div>
      </div>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-sm">
          Ticket type added successfully.
        </div>
      )}

      <SubmitButton className="py-2 px-4 text-sm" loadingText="Adding...">
        Add Ticket Type
      </SubmitButton>
    </form>
  );
}
