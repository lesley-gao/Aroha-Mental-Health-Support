import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ReaderIcon,
  Pencil2Icon,
  ActivityLogIcon,
  RocketIcon,
  LightningBoltIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
import { Wand2, Send } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export function Home() {
  const { t } = useTranslation();

  return (
    <>
      <div className="container mx-auto px-4 pt-12 max-w-6xl">
        {/* Hero Section with Image and Text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center lg:mb-30 mb-20">
          {/* Hero Image - Left */}
          <div className="order-2 md:order-1">
            <img
              src="/hero-image.png"
              alt="Mental wellness illustration"
              className="w-full h-auto rounded-3xl"
            />
          </div>

          {/* Hero Text and CTA - Right */}
          <div className="order-1 md:order-2 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {t("heroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              {t("heroSubtitle")}
            </p>
            <Link to="/phq9">
              <Button
                size="lg"
                className="text-lg px-8 py-6 gap-2 shadow-lg hover:shadow-xl transition-shadow w-full md:w-auto"
              >
                <RocketIcon className="h-5 w-5" />
                {t("getStarted")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid - Equal Weight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:mb-30 mb-10">
          {/* PHQ-9 Assessment */}
          <Card className="p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-linear-to-r from-indigo-100/30 via-purple-100/30 to-pink-100/30">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-teal-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-teal-600 w-14 h-14 rounded-2xl flex items-center justify-center">
                <ReaderIcon className="h-7 w-7 text-white" />
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              {t("phq9Title")}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-base md:text-base min-h-20">
              {t("phq9Description")}
            </p>
            <div className="mb-4 h-48 md:h-56 rounded-xl flex items-center justify-center">
              <img
                src="/assessment.png"
                alt="Assessment"
                className="h-full w-auto object-contain rounded-2xl"
              />
            </div>
            <Link to="/phq9">
              <Button variant="teal" className="w-full gap-2" size="lg">
                {t("takeAssessment")}
                <LightningBoltIcon className="h-4 w-4" />
              </Button>
            </Link>
          </Card>

          {/* Diary Feature */}
          <Card className="p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-linear-to-r from-indigo-100/30 via-purple-100/30 to-pink-100/30">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-teal-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-teal-600 w-14 h-14 rounded-2xl flex items-center justify-center">
                <Pencil2Icon className="h-7 w-7 text-white" />
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              {t("diaryTitle")}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-base md:text-base min-h-20">
              {t("diaryDescription")}
            </p>
            <div className="mb-4 h-48 md:h-56 rounded-xl flex items-center justify-center">
              <img
                src="/diary.png"
                alt="Diary"
                className="h-full w-auto object-contain rounded-2xl"
              />
            </div>
            <Link to="/diary">
              <Button variant="teal" className="w-full gap-2" size="lg">
                {t("startWriting")}
                <Pencil2Icon className="h-4 w-4" />
              </Button>
            </Link>
          </Card>

          {/* History & Insights */}
          <Card className="p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-linear-to-r from-indigo-100/30 via-purple-100/30 to-pink-100/30">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-teal-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-teal-600 w-14 h-14 rounded-2xl flex items-center justify-center">
                <ActivityLogIcon className="h-7 w-7 text-white" />
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              {t("historyTitle")}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-base md:text-base min-h-20">
              {t("historyDescription")}
            </p>
            <div className="mb-4 h-48 md:h-56 rounded-xl flex items-center justify-center">
              <img
                src="/diagram.png"
                alt="Progress Diagram"
                className="h-full w-auto object-contain rounded-2xl"
              />
            </div>
            <Link to="/history">
              <Button variant="teal" className="w-full gap-2" size="lg">
                {t("viewProgress")}
                <ActivityLogIcon className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </div>

        {/* Why Aroha Section - Cultural Elements */}
        <div className=" rounded-3xl py-8 md:py-12 text-gray-900 lg:mb-30 mb-20 ">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {t("whyArohaTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="flex gap-4 bg-linear-to-r from-indigo-100/30 via-purple-100/30 to-pink-100/30  backdrop-blur-sm rounded-xl p-6 hover:bg-white/40 transition-colors shadow-lg border-2 border-indigo-100">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center">
                  <LockClosedIcon className="w-6 h-6 text-[#009490]" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 text-gray-900">
                  {t("privateSecureTitle")}
                </h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  {t("privateSecureDesc")}
                </p>
              </div>
            </div>

            <div className="flex gap-4 bg-linear-to-r from-indigo-100/30 via-purple-100/30 to-pink-100/30  backdrop-blur-sm rounded-xl p-6 hover:bg-white/90 transition-colors shadow-lg border-2 border-indigo-100">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center">
                  <ActivityLogIcon className="w-6 h-6 text-[#009490]" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 text-gray-900">
                  {t("insightsTitle")}
                </h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  {t("insightsDesc")}
                </p>
              </div>
            </div>
            <div className="flex gap-4 bg-linear-to-r from-indigo-100/30 via-purple-100/30 to-pink-100/30  backdrop-blur-sm rounded-xl p-6 hover:bg-white/90 transition-colors shadow-lg border-2 border-indigo-100">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-white/50 rounded-full flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-[#009490]" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 text-gray-900">
                  {t("aiPoweredTitle")}
                </h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  {t("aiPoweredDesc")}
                </p>
              </div>
            </div>
            <div className="flex gap-4 bg-linear-to-r from-indigo-100/30 via-purple-100/30 to-pink-100/30  backdrop-blur-sm rounded-xl p-6 hover:bg-white/90 transition-colors shadow-lg border-2 border-indigo-100">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center">
                  <ReaderIcon className="w-6 h-6 text-[#009490]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-lg text-gray-900">
                    {t("nzFocusedTitle")}
                  </h4>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-gray-700 border border-white">
                    Coming soon
                  </span>
                </div>
                <p className="text-gray-700 text-base leading-relaxed">
                  {t("nzFocusedDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Guide - Journey Visualization */}
        <div className="text-center lg:mb-30 mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {t("quickStartTitle")}
          </h2>
          <p className="text-gray-600 mb-12 text-lg">
            {t("quickStartSubtitle")}
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-20 mx-auto">
            <div className="flex items-center gap-4 bg-white/30 p-6 rounded-2xl shadow-md hover:shadow-lg  hover:scale-105 transition-shadow w-full md:w-96 h-36 border-2 border-indigo-100">
              <div className="w-12 h-12 bg-[#D1F08B] text-black rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                1
              </div>
              <span className="text-gray-700 font-medium text-left">
                {t("step1")}
              </span>
            </div>
            <div className="hidden md:block text-gray-400 text-2xl">→</div>
            <div className="flex items-center gap-4 bg-white/30 p-6 rounded-2xl shadow-md hover:shadow-lg  hover:scale-105 transition-shadow w-full md:w-96 h-36 border-2 border-indigo-100">
              <div className="w-12 h-12 bg-[#D1F08B] text-black rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                2
              </div>
              <span className="text-gray-700 font-medium text-left">
                {t("step2")}
              </span>
            </div>
            <div className="hidden md:block text-gray-400 text-2xl">→</div>
            <div className="flex items-center gap-4 bg-white/30 p-6 rounded-2xl shadow-md hover:shadow-lg  hover:scale-105 transition-shadow w-full md:w-96 h-36 border-2 border-indigo-100">
              <div className="w-12 h-12 bg-[#D1F08B] text-black rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                3
              </div>
              <span className="text-gray-700 font-medium text-left">
                {t("step3")}
              </span>
            </div>
          </div>
          <Link to="/phq9">
            <Button
              size="lg"
              className="text-lg px-8 py-6 gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Send className="h-5 w-5" />
              {t("beginJourney")}
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
