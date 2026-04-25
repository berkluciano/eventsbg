"use client";

import { useActionState } from "react";
import { CheckCircle, Ticket, Megaphone, MonitorSmartphone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroBackground from "@/components/HeroBackground";
import { submitPartnershipApplication } from "@/actions/partnership";
import type { PartnershipState } from "@/actions/partnership";
import { SubmitButton } from "@/components/SubmitButton";

const initial: PartnershipState = {};

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{" "}
        {required && <span className="text-red-500">*</span>}
        {hint && <span className="text-gray-400 font-normal text-xs ml-1">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand";

export function WorkWithUsContent() {
  const { t } = useLanguage();
  const [state, action] = useActionState(submitPartnershipApplication, initial);

  const benefits = [
    { icon: <MonitorSmartphone className="w-6 h-6 text-brand" />, title: t.work.benefit1Title, desc: t.work.benefit1Desc },
    { icon: <Ticket className="w-6 h-6 text-emerald-600" />, title: t.work.benefit2Title, desc: t.work.benefit2Desc },
    { icon: <Megaphone className="w-6 h-6 text-violet-600" />, title: t.work.benefit3Title, desc: t.work.benefit3Desc },
  ];

  return (
    <main className="flex-1 bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand text-white py-14 md:py-20">
        <HeroBackground tickets={false} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t.work.heroTitle}</h1>
          <p className="text-lg text-blue-100 leading-relaxed">{t.work.heroSubtitle}</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3">
                  {b.icon}
                </div>
                <div className="font-bold text-gray-900 mb-1">{b.title}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{t.work.formTitle}</h2>
            <p className="text-sm text-gray-500 mb-7">{t.work.formSubtitle}</p>

            {state.success ? (
              <div className="flex flex-col items-center text-center py-10 gap-4">
                <CheckCircle className="w-14 h-14 text-green-500" />
                <h3 className="text-xl font-bold text-gray-900">{t.work.successTitle}</h3>
                <p className="text-gray-500">{t.work.successDesc}</p>
              </div>
            ) : (
              <form action={action} className="space-y-5">
                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label={t.work.firstName} required>
                    <input name="firstName" required className={inputCls} />
                  </Field>
                  <Field label={t.work.lastName} required>
                    <input name="lastName" required className={inputCls} />
                  </Field>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={t.work.email} required>
                    <input name="email" type="email" required className={inputCls} />
                  </Field>
                  <Field label={t.work.phone} required>
                    <input name="phone" type="tel" required className={inputCls} />
                  </Field>
                </div>

                {/* Business */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={t.work.businessName} required>
                    <input name="businessName" required className={inputCls} />
                  </Field>
                  <Field label={t.work.businessId} required>
                    <input name="businessId" required placeholder={t.work.businessIdPlaceholder} className={inputCls} />
                  </Field>
                </div>

                {/* Social */}
                <Field label={t.work.socialLink} hint={t.work.socialLinkHint}>
                  <input name="socialLink" type="url" placeholder={t.work.socialLinkPlaceholder} className={inputCls} />
                </Field>

                <hr className="border-gray-100" />

                {/* Event details */}
                <Field label={t.work.eventName} required>
                  <input name="eventName" required className={inputCls} />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={t.work.eventLocation} required>
                    <input name="eventLocation" required placeholder={t.work.eventLocationPlaceholder} className={inputCls} />
                  </Field>
                  <Field label={t.work.eventDate} required>
                    <input name="eventDate" type="datetime-local" required className={inputCls} />
                  </Field>
                </div>

                <Field label={t.work.comment} hint={t.work.commentHint}>
                  <textarea name="comment" rows={4} placeholder={t.work.commentPlaceholder} className={`${inputCls} resize-y`} />
                </Field>

                {state.error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                    {state.error}
                  </div>
                )}

                <SubmitButton loadingText={t.work.submitting}>
                  {t.work.submit}
                </SubmitButton>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
