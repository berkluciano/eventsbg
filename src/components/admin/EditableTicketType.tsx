"use client";

import { useState, useActionState } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { updateTicketType } from "@/actions/events";
import { formatCents } from "@/lib/utils";

interface Props {
  tt: { id: string; name: string; priceCents: number; capacity: number | null; sold: number };
  eventId: string;
  deleteAction: (formData: FormData) => void;
}

type FormState = { error?: string; success?: boolean };

export function EditableTicketType({ tt, eventId, deleteAction }: Props) {
  const [editing, setEditing] = useState(false);

  const [state, formAction] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const result = await updateTicketType(tt.id, eventId, formData);
      if (result?.success) setEditing(false);
      return result ?? {};
    },
    {}
  );

  if (!editing) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <div className="font-medium text-gray-900">{tt.name}</div>
          <div className="text-sm text-gray-500">
            {formatCents(tt.priceCents)}
            {tt.capacity !== null && (
              <span className="ml-2 text-gray-400">· {tt.sold}/{tt.capacity} sold</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-gray-400 hover:text-brand transition-colors p-1.5"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <form action={deleteAction}>
            <button
              type="submit"
              className="text-red-400 hover:text-red-600 transition-colors p-1.5"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="p-4 bg-brand/5 rounded-lg border border-brand/20 space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
          <input
            name="name"
            required
            defaultValue={tt.name}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Price in cents</label>
          <input
            name="priceCents"
            type="number"
            required
            min={1}
            defaultValue={tt.priceCents}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Capacity (blank = unlimited)</label>
          <input
            name="capacity"
            type="number"
            min={1}
            defaultValue={tt.capacity ?? ""}
            placeholder="unlimited"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
          />
        </div>
      </div>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
          {state.error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 bg-brand text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-brand-800 transition-colors"
        >
          <Check className="w-3.5 h-3.5" /> Save
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
      </div>
    </form>
  );
}
