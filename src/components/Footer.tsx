import useTranslation from "@/i18n/useTranslation";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className=" border-t-2 border-indigo-200 mt-10">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch pt-8">
          {/* Image - Left */}
          <div className="order-2 md:order-1 flex justify-center md:justify-start">
            <img
              src="/group.png"
              alt="Community support illustration"
              className="w-full max-w-md h-auto"
            />
          </div>

          {/* Text Content - Right */}
          <div className="order-1 md:order-2 text-center md:text-right flex flex-col h-full justify-between">
            <div>
              <p className="text-gray-600 text-2xl my-4 font-bold">{t('footerMessage')}</p>
              <p className="text-indigo-400 mb-3 text-right">{t('footerDisclaimer')}</p>
            </div>

            <p className="text-gray-600 text-right mt-auto">© 2025 Aroha • Made with love in Aotearoa 🇳🇿</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
