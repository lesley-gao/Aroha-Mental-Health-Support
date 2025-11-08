import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ReaderIcon,
  Pencil2Icon,
  ActivityLogIcon,
  RocketIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";
import type { Locale } from "@/i18n/messages";

interface HomeProps {
  locale: Locale;
}

export function Home({ locale }: HomeProps) {
  const t = getTranslations(locale);

  return (
    <div className="container mx-auto px-4 pt-12 max-w-6xl">
      {/* Hero Section with Background Image */}
      <div className="text-center mb-16 relative">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {t.heroTitle}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          {t.heroSubtitle}
        </p>
        <Link to="/phq9">
          <Button
            size="lg"
            className="text-lg px-8 py-6 gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <RocketIcon className="h-5 w-5" />
            {t.getStarted}
          </Button>
        </Link>
      </div>

      {/* Hero Image - Mental Wellness */}
      <div className="mb-20 rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative h-64 md:h-80 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-6xl md:text-8xl mb-4">🌿</div>
            <p className="text-xl md:text-2xl font-semibold text-gray-700">
              {t.heroImageText}
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid - Equal Weight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20">
        {/* PHQ-9 Assessment */}
        <Card className="p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-xl opacity-20"></div>
            <div className="relative bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center">
              <ReaderIcon className="h-7 w-7 text-white" />
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            {t.phq9Title}
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base min-h-[80px]">
            {t.phq9Description}
          </p>
          <div className="mb-4 h-32 md:h-40 bg-white rounded-xl flex items-center justify-center text-5xl md:text-6xl">
            📋
          </div>
          <Link to="/phq9">
            <Button className="w-full gap-2" size="lg">
              {t.takeAssessment}
              <LightningBoltIcon className="h-4 w-4" />
            </Button>
          </Link>
        </Card>

        {/* Diary Feature */}
        <Card className="p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-purple-600 rounded-2xl blur-xl opacity-20"></div>
            <div className="relative bg-purple-600 w-14 h-14 rounded-2xl flex items-center justify-center">
              <Pencil2Icon className="h-7 w-7 text-white" />
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            {t.diaryTitle}
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base min-h-[80px]">
            {t.diaryDescription}
          </p>
          <div className="mb-4 h-32 md:h-40 bg-white rounded-xl flex items-center justify-center text-5xl md:text-6xl">
            ✍️
          </div>
          <Link to="/diary">
            <Button
              className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              {t.startWriting}
              <Pencil2Icon className="h-4 w-4" />
            </Button>
          </Link>
        </Card>

        {/* History & Insights */}
        <Card className="p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-teal-50 to-cyan-50">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-teal-600 rounded-2xl blur-xl opacity-20"></div>
            <div className="relative bg-teal-600 w-14 h-14 rounded-2xl flex items-center justify-center">
              <ActivityLogIcon className="h-7 w-7 text-white" />
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            {t.historyTitle}
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base min-h-[80px]">
            {t.historyDescription}
          </p>
          <div className="mb-4 h-32 md:h-40 bg-white rounded-xl flex items-center justify-center text-5xl md:text-6xl">
            📊
          </div>
          <Link to="/history">
            <Button
              className="w-full gap-2 bg-teal-600 hover:bg-teal-700"
              size="lg"
            >
              {t.viewProgress}
              <ActivityLogIcon className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* Why Aroha Section - Cultural Elements */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white mb-20 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          {t.whyArohaTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="flex gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                🔒
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">
                {t.privateSecureTitle}
              </h4>
              <p className="text-white/90 text-sm leading-relaxed">
                {t.privateSecureDesc}
              </p>
            </div>
          </div>
          <div className="flex gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                🤖
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">{t.aiPoweredTitle}</h4>
              <p className="text-white/90 text-sm leading-relaxed">
                {t.aiPoweredDesc}
              </p>
            </div>
          </div>
          <div className="flex gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                📊
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">{t.insightsTitle}</h4>
              <p className="text-white/90 text-sm leading-relaxed">
                {t.insightsDesc}
              </p>
            </div>
          </div>
          <div className="flex gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                🌏
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">{t.nzFocusedTitle}</h4>
              <p className="text-white/90 text-sm leading-relaxed">
                {t.nzFocusedDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Guide - Journey Visualization */}
      <div className="text-center mb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {t.quickStartTitle}
        </h2>
        <p className="text-gray-600 mb-12 text-lg">{t.quickStartSubtitle}</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-12 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4 bg-indigo-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow w-full md:w-auto">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                1
              </div>
              <span className="text-gray-700 font-medium text-left">
                {t.step1}
              </span>
            </div>
          </div>
          <div className="hidden md:block text-gray-400 text-2xl">→</div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4 bg-purple-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow w-full md:w-auto">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                2
              </div>
              <span className="text-gray-700 font-medium text-left">
                {t.step2}
              </span>
            </div>
          </div>
          <div className="hidden md:block text-gray-400 text-2xl">→</div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4 bg-teal-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow w-full md:w-auto">
              <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                3
              </div>
              <span className="text-gray-700 font-medium text-left">
                {t.step3}
              </span>
            </div>
          </div>
        </div>
        <Link to="/phq9">
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 border-2 hover:bg-indigo-50"
          >
            {t.beginJourney}
          </Button>
        </Link>
      </div>

      {/* Footer Section - Simple & Warm */}
      <footer className="mt-20 pt-8 pb-4 border-t border-gray-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">💚</span>
            <p className="text-gray-600 text-lg">{t.footerMessage}</p>
          </div>

          <p className=" text-gray-400 mb-3 max-w-xl mx-auto">
            {t.footerDisclaimer}
          </p>

          <p className=" text-gray-500">
            © 2025 Aroha • Made with love in Aotearoa 🇳🇿
          </p>
        </div>
      </footer>
    </div>
  );
}

// Translations with Cultural Elements
function getTranslations(locale: Locale) {
  return locale === "en"
    ? {
        tagline: "Mental Health Support for Aotearoa",
        heroTitle: "Your Journey to Wellbeing Starts Here",
        heroSubtitle:
          "Track your mental health, journal your thoughts, and gain insights with Aroha - a free, private tool designed for young New Zealanders.",
        heroImageText: "Grow Your Mental Wellness",
        getStarted: "Get Started",

        // Features - Equal Weight
        phq9Title: "PHQ-9 Assessment",
        phq9Description:
          "Take a clinically-validated depression screening to understand your mental wellbeing.",
        takeAssessment: "Take Assessment",

        diaryTitle: "Personal Diary",
        diaryDescription:
          "Express your thoughts with voice-to-text and AI-powered emotional summaries.",
        startWriting: "Start Writing",

        historyTitle: "Track Progress",
        historyDescription:
          "Visualize your mental health journey with beautiful charts and trend analysis.",
        viewProgress: "View Progress",

        // Why Aroha - Cultural Focus
        whyArohaTitle: "Why Choose Aroha?",
        privateSecureTitle: "Private & Secure",
        privateSecureDesc:
          "Your data stays with you. Export or delete anytime. Optional cloud sync with encryption.",
        aiPoweredTitle: "AI-Powered Insights",
        aiPoweredDesc:
          "Voice-to-text diary entries with emotional keyword detection and smart summaries.",
        insightsTitle: "Visual Insights",
        insightsDesc:
          "Beautiful charts and trend analysis help you understand your mental health patterns.",
        nzFocusedTitle: "NZ-Focused Resources",
        nzFocusedDesc:
          "Curated mental health resources and crisis support specific to Aotearoa New Zealand.",

        // Quick Start
        quickStartTitle: "Get Started in 3 Simple Steps",
        quickStartSubtitle: "Begin your journey to better mental health today",
        step1: "Take your first PHQ-9 assessment",
        step2: "Write a diary entry about your day",
        step3: "Track your progress over time",
        beginJourney: "Begin Your Journey",

        // Footer - Simplified
        footerMessage:
          "You're not alone on this journey. Every step counts. 🌅",
        footerDisclaimer:
          "This tool is for self-monitoring only. If you're in crisis, please call 1737 for support.",
      }
    : {
        tagline: "Tautoko Hauora Hinengaro mō Aotearoa",
        heroTitle: "Tō Haerenga ki te Oranga Ka Tīmata Ināianei",
        heroSubtitle:
          "Aroturukihia tō hauora hinengaro, tuhia ō whakaaro, ka whiwhi whāinga mā Aroha - he taputapu kore utu, tūmataiti i hangaia mō ngā taiohi o Aotearoa.",
        heroImageText: "Whakatipu i Tō Hauora Hinengaro",
        getStarted: "Tīmata",

        // Features
        phq9Title: "Aromatawai PHQ-9",
        phq9Description:
          "Tangohia tētahi aromatawai aromātai pōuri kua whakamānā ā-haumanu ki te mārama i tō oranga hinengaro.",
        takeAssessment: "Tango Aromatawai",

        diaryTitle: "Pukapuka Whaiaro",
        diaryDescription:
          "Whakapuakina ō whakaaro mā te reo-ki-kupu me ngā whakarāpopototanga kare-ā-roto e whakamanaia e AI.",
        startWriting: "Tīmata Tuhi",

        historyTitle: "Aroturuki Ahunga",
        historyDescription:
          "Whakakitea tō haerenga hauora hinengaro mā ngā kauwhata ātaahua me te tātaritanga ia āhua.",
        viewProgress: "Tirohia te Ahunga",

        // Why Aroha
        whyArohaTitle: "He Aha te Kōwhiri i a Aroha?",
        privateSecureTitle: "Tūmataiti & Haumaru",
        privateSecureDesc:
          "Ka noho tō raraunga ki a koe. Kaweakehia, whakakorerangia rānei i ngā wā katoa. He tīpakonga hono kapua me te whakamuna.",
        aiPoweredTitle: "Whāinga e Whakamanaia e AI",
        aiPoweredDesc:
          "Ngā pūkete pukapuka mā te reo-ki-kupu me te kitenga kupu kare-ā-roto me ngā whakarāpopototanga mōhio.",
        insightsTitle: "Whāinga Ataata",
        insightsDesc:
          "Ngā kauwhata ātaahua me te tātaritanga ia āhua ka āwhina i a koe ki te mārama i ō ia āhua hauora hinengaro.",
        nzFocusedTitle: "Rauemi Arotahi-NZ",
        nzFocusedDesc:
          "Ngā rauemi hauora hinengaro kua whakatauhia me te tautoko ohotata motuhake ki Aotearoa.",

        // Quick Start
        quickStartTitle: "Tīmata i Roto i te 3 Māhere Māmā",
        quickStartSubtitle:
          "Tīmatahia tō haerenga ki te hauora hinengaro pai ināianei",
        step1: "Tangohia tō aromatawai PHQ-9 tuatahi",
        step2: "Tuhia he pūkete pukapuka mō tō rā",
        step3: "Aroturukihia tō ahunga i roto i te wā",
        beginJourney: "Tīmata Tō Haerenga",

        // Footer - Simplified
        footerMessage: "Ehara koe i te takitahi. Ko ia hipanga he mea nui. 🌅",
        footerDisclaimer:
          "Mō te aroturuki whaiaro anake. Mēnā kei te ohotata koe, waea mai ki te 1737.",
      };
}
