"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { registerUser } from "@/actions/auth";

const initialState = { error: undefined, success: undefined };

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(registerUser, initialState);

  useEffect(() => {
    if (state?.success) {
      const form = document.getElementById("register-form") as HTMLFormElement;
      if (!form) return;
      const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
      const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;
      signIn("credentials", { email, password, redirect: false }).then(() => {
        router.push("/account/tickets");
        router.refresh();
      });
    }
  }, [state?.success, router]);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {t.account.registerTitle}
            </h1>

            <form id="register-form" action={formAction} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.account.name}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder={t.account.namePlaceholder}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                />
              </div>

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
                  minLength={8}
                  placeholder={t.account.passwordPlaceholder}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand"
                />
              </div>

              {state?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  {state.error}
                </div>
              )}

              <button
                type="submit"
                disabled={pending || !!state?.success}
                className="w-full bg-brand text-white font-semibold py-3 rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-60"
              >
                {pending || state?.success ? t.account.registering : t.account.registerBtn}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              {t.account.hasAccount}{" "}
              <Link href="/account/login" className="text-brand font-medium hover:underline">
                {t.account.login}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
