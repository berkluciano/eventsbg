import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Политика за бисквитки",
};

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Политика за бисквитки</h1>
          <p className="text-sm text-gray-400 mb-10">Последна актуализация: 2025 г.</p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-10 text-gray-700 leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Какво са бисквитките?</h2>
              <div className="space-y-3 text-sm">
                <p>Бисквитките (cookies) са малки текстови файлове, които се съхраняват на вашето устройство (компютър, телефон или таблет) когато посещавате уебсайт. Те се използват широко за да накарат уебсайтовете да работят по-ефективно и за да предоставят информация на собствениците на сайта.</p>
                <p>Бисквитките не могат да изпълняват програми или да пренасят вируси. Те са уникални за вашия браузър и могат да бъдат изтрити или управлявани от вас по всяко време.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Какви бисквитки използваме?</h2>
              <div className="space-y-5 text-sm">

                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                    <span className="font-semibold text-gray-900">1. Задължителни бисквитки</span>
                    <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Не могат да се изключат</span>
                  </div>
                  <div className="px-5 py-4 space-y-2">
                    <p>Тези бисквитки са необходими за правилното функциониране на сайта и не могат да бъдат изключени. Те обикновено се задават в отговор на действия, извършени от вас, като например задаване на предпочитания за поверителност, влизане в профила ви или попълване на формуляри.</p>
                    <ul className="list-disc list-inside ml-2 space-y-1 text-gray-600">
                      <li>Бисквитки за сесия — поддържат вашата сесия докато използвате сайта</li>
                      <li>Бисквитки за сигурност — защитават срещу CSRF атаки при плащане</li>
                      <li>Бисквитки за удостоверяване — запомнят вашето влизане в профила</li>
                      <li>Бисквитки за предпочитания — запомнят избрания от вас език (BG/EN)</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                    <span className="font-semibold text-gray-900">2. Функционални бисквитки</span>
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">По избор</span>
                  </div>
                  <div className="px-5 py-4 space-y-2">
                    <p>Тези бисквитки позволяват на сайта да предоставя подобрена функционалност и персонализация. Ако не разрешите тези бисквитки, някои функции може да не работят правилно.</p>
                    <ul className="list-disc list-inside ml-2 space-y-1 text-gray-600">
                      <li>Запомняне на предпочитания при повторно посещение</li>
                      <li>Персонализиране на съдържанието спрямо вашата история</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                    <span className="font-semibold text-gray-900">3. Аналитични бисквитки</span>
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">По избор</span>
                  </div>
                  <div className="px-5 py-4 space-y-2">
                    <p>Тези бисквитки ни помагат да разберем как посетителите взаимодействат с нашия сайт чрез събиране и докладване на анонимна информация. Всички данни са агрегирани и анонимизирани.</p>
                    <ul className="list-disc list-inside ml-2 space-y-1 text-gray-600">
                      <li>Брой посетители и разглеждани страници</li>
                      <li>Начин на навигация из сайта</li>
                      <li>Технически данни за устройството и браузъра</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                    <span className="font-semibold text-gray-900">4. Бисквитки на трети страни</span>
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">По избор</span>
                  </div>
                  <div className="px-5 py-4 space-y-2">
                    <p>Някои от нашите партньори могат да задават бисквитки на вашето устройство при използване на техните услуги:</p>
                    <ul className="list-disc list-inside ml-2 space-y-1 text-gray-600">
                      <li><span className="font-medium text-gray-800">Stripe</span> — използва бисквитки за обработка на плащания и предотвратяване на измами. Вижте <a href="https://stripe.com/cookie-settings" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">политиката на Stripe</a>.</li>
                      <li><span className="font-medium text-gray-800">Clerk</span> — използва бисквитки за управление на администраторски сесии.</li>
                    </ul>
                  </div>
                </div>

              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Как да управлявате бисквитките?</h2>
              <div className="space-y-3 text-sm">
                <p>Можете да контролирате и/или изтриете бисквитки по ваше желание. Можете да изтриете всички бисквитки вече съхранени на вашия компютър, а повечето браузъри ви позволяват да блокирате поставянето на бисквитки.</p>
                <p>Инструкции за управление на бисквитките в популярните браузъри:</p>
                <ul className="list-disc list-inside ml-2 space-y-1 text-gray-600">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/bg/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Mozilla Firefox</a></li>
                  <li><a href="https://support.microsoft.com/bg-bg/windows/delete-and-manage-cookies" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Microsoft Edge</a></li>
                  <li><a href="https://support.apple.com/bg-bg/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Safari</a></li>
                </ul>
                <p className="text-gray-500 italic">Забележка: блокирането на бисквитките може да повлияе на функционалността на сайта, включително възможността за извършване на плащания.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Контакт</h2>
              <div className="text-sm space-y-2">
                <p>При въпроси относно нашата политика за бисквитки, моля свържете се с нас:</p>
                <p>Имейл: <a href="mailto:support@eventor.bg" className="text-brand hover:underline">support@eventor.bg</a></p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
