import { prisma } from "@/lib/prisma";
import { markEmailRead } from "@/actions/inbox";
import { Mail, MailOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Inbox" };

export default async function InboxPage() {
  const emails = await prisma.inboundEmail.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const unread = emails.filter((e) => !e.read).length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {unread > 0 ? `${unread} unread message${unread !== 1 ? "s" : ""}` : "All caught up"}
        </p>
      </div>

      {emails.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No emails received yet.</p>
          <p className="text-xs text-gray-400 mt-1">
            Emails sent to your domain will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {emails.map((email) => (
            <EmailRow key={email.id} email={email} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmailRow({
  email,
}: {
  email: {
    id: string;
    from: string;
    to: string;
    subject: string;
    text: string | null;
    rawPayload: unknown;
    read: boolean;
    createdAt: Date;
  };
}) {
  const markRead = markEmailRead.bind(null, email.id);

  // Try to extract body from rawPayload if text is missing
  const raw = email.rawPayload as Record<string, unknown> | null;
  const rawData = (raw?.data ?? raw) as Record<string, unknown> | null;
  const bodyText: string =
    email.text ??
    (rawData?.text as string) ??
    (rawData?.plain_text as string) ??
    "";

  const preview = bodyText.slice(0, 120).replace(/\n/g, " ");

  return (
    <details className="group">
      <summary className="flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors list-none">
        <form action={markRead} className="mt-0.5 flex-shrink-0">
          <button
            type="submit"
            title={email.read ? "Mark unread" : "Mark as read"}
            className="text-gray-300 hover:text-brand transition-colors"
          >
            {email.read ? (
              <MailOpen className="w-4 h-4 text-gray-400" />
            ) : (
              <Mail className="w-4 h-4 text-brand" />
            )}
          </button>
        </form>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className={`text-sm ${email.read ? "text-gray-600" : "font-semibold text-gray-900"}`}>
              {email.from || "(unknown sender)"}
            </span>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {new Date(email.createdAt).toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className={`text-sm mt-0.5 truncate ${email.read ? "text-gray-500" : "text-gray-800 font-medium"}`}>
            {email.subject}
          </div>
          {preview && (
            <div className="text-xs text-gray-400 mt-0.5 truncate group-open:hidden">
              {preview}
            </div>
          )}
        </div>
      </summary>

      {/* Expanded body */}
      <div className="px-5 pb-5 pt-1 ml-7 border-t border-gray-100 bg-gray-50 space-y-3">
        <div className="text-xs text-gray-400">To: {email.to}</div>

        {bodyText ? (
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {bodyText}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-amber-600 font-medium">
              No body content received from Resend — showing raw payload:
            </p>
            <pre className="bg-white rounded-lg border border-gray-200 p-4 text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(rawData ?? raw, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </details>
  );
}
