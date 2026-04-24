"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: fd.get("email"),
      password: fd.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Невалиден имейл или парола.");
    } else {
      router.push("/account/tickets");
      router.refresh();
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {t.account.loginTitle}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.account.password}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder={t.account.passwordPlaceholder}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand text-white font-semibold py-3 rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-60"
              >
                {loading ? t.account.loggingIn : t.account.loginBtn}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              {t.account.noAccount}{" "}
              <Link href="/account/register" className="text-brand font-medium hover:underline">
                {t.account.register}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
