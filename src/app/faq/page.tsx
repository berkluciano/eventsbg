"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface Faq {
  question: string;
  answer: React.ReactNode;
}

const faqs: Faq[] = [
  {
    question: "Как мога да анулирам застраховката на билета?",
    answer: (
      <div className="space-y-3">
        <p>
          Можете да подадете заявка за анулиране на полица на имейл{" "}
          <a href="mailto:support@eventor.bg" className="text-brand hover:underline font-medium">
            support@eventor.bg
          </a>
          . Ще Ви бъде възстановена сумата за застраховката, ако анулирате в рамките на 14-дневен срок, при условие че не е заведена щета и събитието не е започнало.
        </p>
        <p>Заявката следва да съдържа вашите две имена, телефон за връзка с Вас, а според начина на плащане:</p>
        <div className="space-y-2">
          <p>
            <span className="font-medium text-gray-800">а) При заплащане с банкова карта и през портала с ДСК</span> — стойността на полицата се възстановява по картата, с която са платени билетите.
          </p>
          <div>
            <p className="font-medium text-gray-800 mb-1">б) При заплащане с банкова карта и през Epaybg или с наложен платеж, следва да ни изпратите:</p>
            <ul className="list-disc list-inside ml-3 space-y-1">
              <li>Актуални банкови данни (IBAN, Имена на титуляра)</li>
              <li>Номер на Вашата поръчка (може да я откриете в получения имейл с билетите) или кода, който ще откриете на билета</li>
              <li>Имейл адресът, който сте въвели при закупуването на билетите</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    question: "Не успявам да платя с карта — каква може да е причината?",
    answer: (
      <div className="space-y-3">
        <p>
          Една от възможните причини е да нямате активирана 3D парола/верификация за вашата карта. Нужно е да се свържете с банката издател на вашата карта и да активирате тази услуга за сигурност. След активирането ще можете да правите онлайн покупки с вашата карта не само от нашия сайт, а и от всички сайтове с възможност за онлайн плащания.
        </p>
        <p>
          При нужда от допълнително съдействие не се колебайте да се{" "}
          <Link href="/contact" className="text-brand hover:underline font-medium">
            свържете с нас
          </Link>
          .
        </p>
      </div>
    ),
  },
  {
    question: "Какво е 3D парола/верификация?",
    answer: (
      <div className="space-y-3">
        <p>
          3D паролата осигурява допълнителна идентификация на собственика на дебитна или кредитна карта, когато същият реши да плати с нея в интернет.
        </p>
        <p>Тя може да бъде:</p>
        <ul className="list-disc list-inside ml-3 space-y-1">
          <li>
            <span className="font-medium">Еднократна</span> — касае конкретна онлайн транзакция (напр. ДСК и Райфайзенбанк изпращат код на телефона).
          </li>
          <li>
            <span className="font-medium">Постоянна</span> — настройва се в системата за онлайн банкиране (напр. ПИБ, Уникредит Булбанк и ОББ) и се въвежда на последната стъпка от плащането.
          </li>
        </ul>
        <p>
          Тази защита помага при оспорване на транзакция в случай на съмнение за злоупотреба. За активиране на услугата се свържете с вашата банка.
        </p>
      </div>
    ),
  },
  {
    question: "Какви са начините на плащане?",
    answer: (
      <p>Информацията за наличните начини на плащане ще бъде публикувана скоро.</p>
    ),
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Често задавани въпроси</h1>
          <p className="text-gray-500 mb-10">Отговори на най-честите въпроси за нашата услуга.</p>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open === i && (
                  <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
