"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SubmitButton } from "@/components/SubmitButton";
import { requestPasswordReset } from "@/actions/resetPassword";
import { useLanguage } from "@/contexts/LanguageContext";

const initial: { error?: string; success?: boolean } = {};

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [state, action] = useActionState(requestPasswordReset, initial);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {t.account.forgotPassword}
            </h1>
            <p className="text-sm text-gray-500 text-center mb-6">
              {t.account.forgotPasswordInstructions}
            </p>

            {state.success ? (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-5 text-sm text-center space-y-1">
                <p className="font-semibold">{t.account.resetEmailSent}</p>
                <p>{t.account.resetEmailSentDesc}</p>
              </div>
            ) : (
              <form action={action} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.account.email}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="email@example.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                  />
                </div>

                {state.error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                    {state.error}
                  </div>
                )}

                <SubmitButton loadingText={t.account.sending}>
                  {t.account.sendResetLink}
                </SubmitButton>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-gray-500">
              <Link href="/account/login" className="text-brand font-medium hover:underline">
                ← {t.account.backToLogin}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
