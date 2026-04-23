"use client";

import { useState, useActionState } from "react";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { SubmitButton } from "@/components/SubmitButton";

type ActionFn = (formData: FormData) => Promise<void | { error?: string; success?: boolean }>;

interface EventFormProps {
  action: ActionFn;
  defaultValues?: {
    name?: string;
    description?: string;
    city?: string;
    venue?: string;
    startsAt?: string;
    endsAt?: string;
    squareImage?: string | null;
    published?: boolean;
  };
  submitLabel?: string;
}

type FormState = { error?: string };

export function EventForm({ action, defaultValues = {}, submitLabel = "Save Event" }: EventFormProps) {
  const [imageUrl, setImageUrl] = useState(defaultValues.squareImage ?? "");

  const [state, formAction] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const result = await action(formData);
      if (result && "error" in result && result.error) {
        return { error: result.error };
      }
      return {};
    },
    {}
  );

  const toDateTimeLocal = (d?: string) => {
    if (!d) return "";
    try {
      return new Date(d).toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden image field — kept in sync with upload state */}
      <input type="hidden" name="squareImage" value={imageUrl} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            required
            defaultValue={defaultValues.name}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            name="city"
            required
            defaultValue={defaultValues.city}
            placeholder="Sofia"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Venue <span className="text-red-500">*</span>
          </label>
          <input
            name="venue"
            required
            defaultValue={defaultValues.venue}
            placeholder="National Palace of Culture"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            name="startsAt"
            type="datetime-local"
            required
            defaultValue={toDateTimeLocal(defaultValues.startsAt)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date & Time{" "}
            <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            name="endsAt"
            type="datetime-local"
            defaultValue={toDateTimeLocal(defaultValues.endsAt)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            required
            rows={5}
            defaultValue={defaultValues.description}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand resize-y"
          />
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Image <span className="text-gray-400 text-xs">(square, max 4MB)</span>
          </label>
          <div className="flex items-start gap-4">
            {imageUrl && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                <Image src={imageUrl} alt="Event preview" fill className="object-cover" />
              </div>
            )}
            <div className="flex-1">
              <UploadButton
                endpoint="eventImage"
                onClientUploadComplete={(res) => {
                  if (res[0]) setImageUrl(res[0].ufsUrl);
                }}
                onUploadError={(err) => console.error("Upload error:", err.message)}
                appearance={{
                  button:
                    "bg-brand text-white hover:bg-brand-800 transition-colors text-sm font-medium px-4 py-2 rounded-lg",
                  allowedContent: "text-gray-400 text-xs mt-1",
                }}
              />
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="mt-2 text-xs text-red-500 hover:underline"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Published */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              name="published"
              type="checkbox"
              value="true"
              defaultChecked={defaultValues.published}
              className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Published</span>
              <p className="text-xs text-gray-400 mt-0.5">
                Published events appear publicly and can be booked.
              </p>
            </div>
          </label>
        </div>
      </div>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {state.error}
        </div>
      )}

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
