"use client";

import Link from "next/link";
import { Check, MonitorSmartphone, Ticket, Megaphone, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroBackground from "@/components/HeroBackground";

export function AboutContent() {
  const { t } = useLanguage();

  const services = [
    {
      icon: <MonitorSmartphone className="w-7 h-7 text-brand" />,
      title: t.about.saasTitle,
      subtitle: t.about.saasSubtitle,
      desc: t.about.saasDesc,
      color: "bg-brand/5 border-brand/15",
      points: [t.about.saasPoint1, t.about.saasPoint2, t.about.saasPoint3, t.about.saasPoint4],
    },
    {
      icon: <Ticket className="w-7 h-7 text-emerald-600" />,
      title: t.about.conciergeTitle,
      subtitle: t.about.conciergeSubtitle,
      desc: t.about.conciergeDesc,
      color: "bg-emerald-50 border-emerald-100",
      points: [t.about.conciergePoint1, t.about.conciergePoint2, t.about.conciergePoint3, t.about.conciergePoint4],
    },
    {
      icon: <Megaphone className="w-7 h-7 text-violet-600" />,
      title: t.about.marketingTitle,
      subtitle: t.about.marketingSubtitle,
      desc: t.about.marketingDesc,
      color: "bg-violet-50 border-violet-100",
      points: [t.about.marketingPoint1, t.about.marketingPoint2, t.about.marketingPoint3, t.about.marketingPoint4],
    },
  ];

  return (
    <main className="flex-1 bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand text-white py-16 md:py-24">
        <HeroBackground />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {t.about.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            {t.about.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-8 ${service.color}`}
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 bg-white rounded-xl shadow-sm border border-white/60 flex items-center justify-center">
                  {service.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                    {service.subtitle}
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                    {service.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-5">
                    {service.desc}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
            {t.about.ctaTitle}
          </h2>
          <p className="text-gray-500 mb-8">{t.about.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-brand text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-800 transition-colors"
            >
              {t.about.ctaContact} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:border-brand hover:text-brand transition-colors"
            >
              {t.about.ctaEvents}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
