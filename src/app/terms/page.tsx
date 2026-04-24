import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Общи условия",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Общи условия на Events BG</h1>
          <p className="text-sm text-gray-400 mb-10">Последна актуализация: 2025 г.</p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-10 text-gray-700 leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">I. Общи разпоредби</h2>
              <div className="space-y-3 text-sm">
                <p><span className="font-medium">Чл.1. (1)</span> Настоящите общи условия уреждат реда и условията за ползване на услугите, предоставяни от Events BG чрез уебсайта (наричан за краткост „Платформата").</p>
                <p><span className="font-medium">(2)</span> С извършването на поръчка през Платформата, потребителят приема настоящите общи условия и се задължава да ги спазва.</p>
                <p><span className="font-medium">(3)</span> Events BG си запазва правото да променя общите условия по всяко време, като промените влизат в сила от момента на публикуването им.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">II. За нашата услуга</h2>
              <div className="space-y-3 text-sm">
                <p><span className="font-medium">Чл.2. (1)</span> Events BG е посредническа услуга за закупуване на билети. Ние не сме организатор на събитията и не продаваме билети директно.</p>
                <p><span className="font-medium">(2)</span> Нашата услуга се състои в следното: след получаване на вашето плащане, ние закупуваме билет от официалния продавач на ваше име, с вашите данни. Билетът се изпраща директно от официалния продавач на посочения от вас имейл адрес.</p>
                <p><span className="font-medium">(3)</span> Данни за контакт: имейл: <a href="mailto:support@eventor.bg" className="text-brand hover:underline">support@eventor.bg</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">III. Поръчка и плащане</h2>
              <div className="space-y-3 text-sm">
                <p><span className="font-medium">Чл.3. (1)</span> За извършване на поръчка потребителят предоставя: три имена, имейл адрес и телефонен номер. Тези данни се използват единствено за закупуване на билета от официалния продавач на ваше име.</p>
                <p><span className="font-medium">(2)</span> Цената на билета е идентична с цената на официалния продавач. Към нея се добавя такса за обслужване в размер на 5 евро на билет, която покрива разходите по посредническата услуга.</p>
                <p><span className="font-medium">(3)</span> Цената се заплаща изцяло предварително чрез сигурна онлайн платежна система (Stripe). Плащането се счита за потвърждение на поръчката.</p>
                <p><span className="font-medium">(4)</span> След успешно плащане потребителят получава имейл потвърждение от Events BG.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">IV. Получаване на билета</h2>
              <div className="space-y-3 text-sm">
                <p><span className="font-medium">Чл.4. (1)</span> След получаване на плащането, Events BG закупува билета от официалния продавач на името и с имейл адреса на потребителя.</p>
                <p><span className="font-medium">(2)</span> Билетът се изпраща директно от официалния продавач на посочения от потребителя имейл адрес. Events BG не изпраща и не съхранява билети.</p>
                <p><span className="font-medium">(3)</span> Времето за получаване на билета зависи от официалния продавач, но обичайно е в рамките на няколко часа след поръчката.</p>
                <p><span className="font-medium">(4)</span> Events BG не носи отговорност ако потребителят е предоставил грешен имейл адрес.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">V. Такса за обслужване</h2>
              <div className="space-y-3 text-sm">
                <p><span className="font-medium">Чл.5. (1)</span> Таксата за обслужване от 5 евро на билет е невъзвращаема при всякакви обстоятелства, тъй като покрива извършената посредническа услуга.</p>
                <p><span className="font-medium">(2)</span> Таксата е ясно обозначена като отделен ред в процеса на поръчка преди финалното потвърждение.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">VI. Застраховка на билети — Allianz</h2>
              <div className="space-y-3 text-sm">
                <p><span className="font-medium">Чл.6. (1)</span> Events BG предлага по избор на потребителя застраховка „Анулиране на билет", предоставяна от Allianz България.</p>
                <p><span className="font-medium">(2)</span> Застраховката покрива стойността на билета (без таксата за обслужване) при настъпване на застрахователно събитие съгласно общите условия на Allianz, включително, но не само: заболяване, злополука, смърт на близък, извънредни обстоятелства.</p>
                <p><span className="font-medium">(3)</span> Застраховката е незадължителна и се добавя по избор на потребителя в процеса на поръчка срещу допълнително заплащане.</p>
                <p><span className="font-medium">(4)</span> Можете да подадете заявка за анулиране на полица на имейл{" "}
                  <a href="mailto:support@eventor.bg" className="text-brand hover:underline">support@eventor.bg</a>.{" "}
                  Ще Ви бъде възстановена сумата за застраховката, ако анулирате в рамките на 14-дневен срок, при условие че не е заведена щета и събитието не е започнало. Заявката следва да съдържа вашите две имена, телефон за връзка с Вас, а според начина на плащане:</p>
                <div className="ml-4 space-y-2 text-gray-600">
                  <p><span className="font-medium text-gray-800">а) При заплащане на билети с банкова карта и през портала с ДСК</span> — стойността на полицата се възстановява по картата, с която са платени билетите.</p>
                  <p><span className="font-medium text-gray-800">б) При заплащане на билети с банкова карта и през Epaybg или с наложен платеж</span>, следва да ни изпратите:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Актуални банкови данни (IBAN, Имена на титуляра)</li>
                    <li>Номер на Вашата поръчка (може да я откриете в получения имейл с билетите) или кода, който ще откриете на билета</li>
                    <li>Имейл адресът, който сте въвели при закупуване на билетите</li>
                  </ul>
                </div>
                <p><span className="font-medium">(5)</span> Events BG действа единствено като посредник при предлагането на застраховката и не носи отговорност за решенията на Allianz по застрахователни претенции.</p>
                <p><span className="font-medium">(6)</span> Заплатената застрахователна премия не подлежи на връщане при отказ от застраховката след потвърждение на поръчката.</p>
                <p><span className="font-medium">(7)</span> За подробна информация относно покритието, изключенията и условията на застраховката, потребителят следва да се запознае с пълните документи на Allianz:</p>
                <div className="ml-4 flex flex-col gap-2">
                  <a
                    href="/documents/GTC_EventsBG_Ticket_cancelation_BG.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-brand hover:underline font-medium"
                  >
                    <span>📄</span> Общи условия на застраховката
                  </a>
                  <a
                    href="/documents/IPID_EventsBG_Ticket_cancelation_BG.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-brand hover:underline font-medium"
                  >
                    <span>📄</span> Информационен документ за застрахователния продукт (IPID)
                  </a>
                  <a
                    href="/documents/Privacy_Notice_BG.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-brand hover:underline font-medium"
                  >
                    <span>📄</span> Политика за защита на данните
                  </a>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">VII. Отказ и връщане</h2>
              <div className="space-y-3 text-sm">
                <p><span className="font-medium">Чл.7. (1)</span> След извършване на поръчката и плащането, отказ не е възможен, тъй като Events BG незабавно пристъпва към закупуване на билета от официалния продавач.</p>
                <p><span className="font-medium">(2)</span> В случай на отмяна или отлагане на събитие от организатора, потребителят има право на възстановяване на стойността на билета (без таксата за обслужване) по реда, определен от официалния продавач.</p>
                <p><span className="font-medium">(3)</span> Events BG съдейства на потребителя при комуникацията с официалния продавач в случай на отменено събитие.</p>
                <p><span className="font-medium">(4)</span> Events BG не носи отговорност за решения на организатора на събитието относно промени в програмата, изпълнителите, датата или мястото на провеждане.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">VIII. Отговорност</h2>
              <div className="space-y-3 text-sm">
                <p><span className="font-medium">Чл.8. (1)</span> Events BG е посредник и не носи отговорност за: качеството на събитието, действията на организатора, технически проблеми на официалния продавач, наличността на билети след извършване на поръчката.</p>
                <p><span className="font-medium">(2)</span> В редки случаи билет може да не е наличен към момента на закупуване (напр. разпродаден между потвърждението и покупката). В такъв случай Events BG възстановява пълната платена сума включително таксата за обслужване.</p>
                <p><span className="font-medium">(3)</span> Events BG не гарантира конкретно място или сектор, освен ако това е изрично упоменато в описанието на събитието.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">IX. Лични данни и поверителност</h2>
              <div className="space-y-3 text-sm">
                <p><span className="font-medium">Чл.9. (1)</span> Events BG събира и обработва следните лични данни: три имена, имейл адрес и телефонен номер.</p>
                <p><span className="font-medium">(2)</span> Данните се използват единствено за:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  <li>Закупуване на билет от официалния продавач на името на потребителя;</li>
                  <li>Изпращане на потвърждение за поръчката;</li>
                  <li>Комуникация при проблем с поръчката;</li>
                  <li>Издаване на застрахователна полица при избрана застраховка.</li>
                </ul>
                <p><span className="font-medium">(3)</span> Данните не се споделят с трети страни освен с официалния продавач на билети и Allianz България (при избрана застраховка), единствено за целите на услугата.</p>
                <p><span className="font-medium">(4)</span> Events BG не съхранява данни за платежни карти. Всички плащания се обработват сигурно от Stripe.</p>
                <p><span className="font-medium">(5)</span> Обработването на лични данни е в съответствие с Регламент (ЕС) 2016/679 (GDPR) и българското законодателство за защита на личните данни.</p>
                <p><span className="font-medium">(6)</span> Потребителят има следните права по отношение на личните си данни:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                  <li>Право на достъп до съхраняваните данни;</li>
                  <li>Право на коригиране на неточни данни;</li>
                  <li>Право на изтриване („право да бъдеш забравен");</li>
                  <li>Право на ограничаване на обработването;</li>
                  <li>Право на преносимост на данните.</li>
                </ul>
                <p><span className="font-medium">(7)</span> За упражняване на горепосочените права потребителят може да изпрати искане на <a href="mailto:support@eventor.bg" className="text-brand hover:underline">support@eventor.bg</a>.</p>
                <p><span className="font-medium">(8)</span> При съмнение за нарушение на правата по защита на личните данни, потребителят може да подаде жалба до Комисията за защита на личните данни:</p>
                <address className="not-italic ml-4 text-gray-600 space-y-0.5">
                  <p>Адрес: гр. София, ул. „Проф. Цветан Лазаров" № 2</p>
                  <p>Уебсайт: <a href="https://www.cpdp.bg" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">www.cpdp.bg</a></p>
                  <p>Имейл: <a href="mailto:kzld@cpdp.bg" className="text-brand hover:underline">kzld@cpdp.bg</a></p>
                </address>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">X. Бисквитки (Cookies)</h2>
              <div className="space-y-3 text-sm">
                <p><span className="font-medium">Чл.10. (1)</span> Уебсайтът на Events BG използва бисквитки (cookies) за подобряване на потребителското изживяване.</p>
                <p><span className="font-medium">(2)</span> Видове бисквитки, които използваме:</p>
                <div className="ml-4 space-y-2 text-gray-600">
                  <p><span className="font-medium text-gray-800">Задължителни бисквитки</span> — необходими за функционирането на сайта. Не могат да бъдат изключени. Включват бисквитки за сесията и сигурността на плащането.</p>
                  <p><span className="font-medium text-gray-800">Аналитични бисквитки</span> — помагат ни да разберем как потребителите използват сайта (напр. Google Analytics). Събират анонимна информация.</p>
                  <p><span className="font-medium text-gray-800">Функционални бисквитки</span> — запомнят вашите предпочитания за по-добро изживяване при следващо посещение.</p>
                </div>
                <p><span className="font-medium">(3)</span> При първото посещение на сайта потребителят е информиран за използването на бисквитки и може да управлява своите предпочитания.</p>
                <p><span className="font-medium">(4)</span> Потребителят може по всяко време да изтрие или блокира бисквитките чрез настройките на своя браузър, като това може да повлияе на функционалността на сайта.</p>
                <p><span className="font-medium">(5)</span> Events BG не използва бисквитки за рекламно проследяване или споделяне на данни с рекламодатели.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">XI. Извънсъдебно решаване на спорове</h2>
              <div className="space-y-3 text-sm">
                <p><span className="font-medium">Чл.11. (1)</span> При спор между Events BG и потребител, страните се стремят към решаване по взаимно съгласие чрез преговори.</p>
                <p><span className="font-medium">(2)</span> При невъзможност за постигане на съгласие, потребителят може да се обърне към Комисията за защита на потребителите:</p>
                <address className="not-italic ml-4 text-gray-600 space-y-0.5">
                  <p>Адрес: гр. София, пл. „Славейков" № 4А, ет. 3, 4 и 6</p>
                  <p>Гореща линия: <a href="tel:070011122" className="text-brand hover:underline">0700 111 22</a></p>
                  <p>Уебсайт: <a href="https://www.kzp.bg" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">www.kzp.bg</a></p>
                </address>
                <p><span className="font-medium">(3)</span> Потребителите имат достъп и до Европейската платформа за онлайн решаване на спорове: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">ec.europa.eu/consumers/odr</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">XII. Заключителни разпоредби</h2>
              <div className="space-y-3 text-sm">
                <p><span className="font-medium">Чл.12. (1)</span> За всички неуредени въпроси се прилага действащото българско законодателство.</p>
                <p><span className="font-medium">(2)</span> Настоящите общи условия са съставени на български език. В случай на несъответствие с преведена версия, версията на български език е меродавна.</p>
                <p><span className="font-medium">(3)</span> Ако някоя разпоредба от настоящите общи условия се окаже недействителна, това не засяга действителността на останалите разпоредби.</p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
