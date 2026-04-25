"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SubmitButton } from "@/components/SubmitButton";
import { applyPasswordReset, validateResetToken } from "@/actions/resetPassword";
import { useLanguage } from "@/contexts/LanguageContext";

const initial: { error?: string; success?: boolean } = {};

export function ResetForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [state, action] = useActionState(applyPasswordReset, initial);

  useEffect(() => {
    if (!token) { setTokenValid(false); return; }
    validateResetToken(token).then(({ valid }) => setTokenValid(valid));
  }, [token]);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {t.account.resetPasswordTitle}
            </h1>

            {/* Loading */}
            {tokenValid === null && (
              <p className="text-center text-gray-400 text-sm py-6">{t.common.loading}</p>
            )}

            {/* Invalid / expired token */}
            {tokenValid === false && (
              <div className="text-center space-y-4">
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-4 text-sm">
                  {t.account.resetTokenInvalid}
                </div>
                <Link href="/account/forgot-password" className="inline-block text-brand font-medium hover:underline text-sm">
                  {t.account.requestNewLink}
                </Link>
              </div>
            )}

            {/* Valid token — show form or success */}
            {tokenValid === true && (
              state.success ? (
                <div className="text-center space-y-4">
                  <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-5 text-sm">
                    <p className="font-semibold">{t.account.passwordChanged}</p>
                    <p>{t.account.passwordChangedDesc}</p>
                  </div>
                  <Link href="/account/login" className="inline-block text-brand font-medium hover:underline text-sm">
                    {t.account.backToLogin}
                  </Link>
                </div>
              ) : (
                <form action={action} className="space-y-4">
                  <input type="hidden" name="token" value={token} />

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      {t.account.newPassword}
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      minLength={8}
                      placeholder={t.account.passwordPlaceholder}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                    />
                  </div>

                  {state.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                      {state.error}
                    </div>
                  )}

                  <SubmitButton loadingText={t.account.saving}>
                    {t.account.setNewPassword}
                  </SubmitButton>
                </form>
              )
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
