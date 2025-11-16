import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Locale } from "@/i18n/messages";
import {
  isCloudSyncEnabled,
  setCloudSyncEnabled,
  syncAllRecordsToSupabase,
} from "@/utils/storage";
import useTranslation from "@/i18n/useTranslation";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Globe, Info, Shield, Cloud, CloudOff } from "lucide-react";

interface SettingsProps {
  // locale?: Locale; // Removed unused locale prop
  onLocaleChange?: (newLocale: Locale) => void;
}

export function Settings(props: SettingsProps) {
  const { t, locale: providerLocale, setLocale } = useTranslation();
  const { onLocaleChange } = props;
  const [selectedLanguage, setSelectedLanguage] = useState<Locale>(providerLocale);
  const [cloudSync, setCloudSync] = useState<boolean>(isCloudSyncEnabled());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const supabaseConfigured = isSupabaseConfigured();

  useEffect(() => {
    setSelectedLanguage(providerLocale);
    if (onLocaleChange) onLocaleChange(providerLocale);
  }, [providerLocale, onLocaleChange]);

  const handleLanguageChange = (value: string) => {
    const newLocale = value as Locale;
    setSelectedLanguage(newLocale);
    try {
      setLocale(newLocale);
    } catch {
      // ignore
    }
    if (onLocaleChange) onLocaleChange(newLocale);
  };

  const handleCloudSyncToggle = async () => {
    const newValue = !cloudSync;
    setCloudSync(newValue);
    setCloudSyncEnabled(newValue);

    // If enabling sync, trigger initial sync
    if (newValue) {
      setIsSyncing(true);
      try {
        await syncAllRecordsToSupabase();
      } catch (error) {
        console.error("Error syncing records:", error);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card className="bg-white/30">
        <CardHeader>
          <CardTitle className="text-2xl">{t('settingsTitle')}</CardTitle>
          <CardDescription>{t('settingsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Language Settings */}
          <div>
                <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-teal-600" />
              <h3 className="text-lg font-semibold text-gray-900">{t('settingsLanguage')}</h3>
            </div>
            <Card className="bg-transparent ring-0 shadow-none">
              <CardContent className="pt-6">
                <RadioGroup
                  value={selectedLanguage}
                  onValueChange={handleLanguageChange}
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="en" id="lang-en" />
                      <Label
                        htmlFor="lang-en"
                        className="cursor-pointer font-normal"
                      >
                        <div>
                          <div className="font-medium">English</div>
                          <div className="text-gray-500">
                            Display all content in English
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="mi" id="lang-mi" />
                      <Label
                        htmlFor="lang-mi"
                        className="cursor-pointer font-normal"
                      >
                        <div>
                          <div className="font-medium">Te Reo Māori</div>
                                <div className="  text-gray-500">{t('languageOptionMiDesc')}</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="zh" id="lang-zh" />
                      <Label
                        htmlFor="lang-zh"
                        className="cursor-pointer font-normal"
                      >
                        <div>
                          <div className="font-medium">中文 (简体)</div>
                          <div className="text-gray-500">以简体中文显示所有内容</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-900">{t('languageApplyImmediately')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300"></div>

          {/* Cloud Sync Settings */}
          {supabaseConfigured && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                {cloudSync ? (
                  <Cloud className="h-5 w-5 text-teal-600" />
                ) : (
                  <CloudOff className="h-5 w-5 text-gray-400" />
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('cloudSyncTitle')}
                </h3>
              </div>
              <Card className="bg-transparent  ring-0 shadow-none">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Label
                          htmlFor="cloud-sync-toggle"
                          className="font-medium text-gray-900 cursor-pointer"
                        >
                          {t('cloudSyncEnableLabel')}
                        </Label>
                      </div>
                        <p className="  text-gray-600">{t('cloudSyncDescription')}</p>
                    </div>
                    <Button
                      id="cloud-sync-toggle"
                      variant={cloudSync ? "default" : "outline"}
                      size="sm"
                      onClick={handleCloudSyncToggle}
                      disabled={isSyncing}
                      className="ml-4 shadow-md"
                    >
                        {isSyncing ? t('cloudSyncSyncing') : cloudSync ? t('cloudSyncEnabledText') : t('cloudSyncEnableText')}
                    </Button>
                  </div>

                  {cloudSync && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-900">
                          {t('cloudSyncActiveText')}
                      </p>
                    </div>
                  )}

                  {!cloudSync && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-900">
                          {t('cloudSyncLocalOnlyText')}
                      </p>
                    </div>
                  )}

                  <div className="pt-3">
                    <p className="text-xs text-gray-500">
                      {t('cloudSyncPrivacyNote')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-300"></div>

          {/* Privacy Link */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-teal-600" />
                <h3 className="text-lg font-semibold text-gray-900">{t('privacyTitle')}</h3>
            </div>
            <Card className="bg-transparent  ring-0 shadow-none">
              <CardContent className="pt-6">
                <p className="  text-gray-700 mb-4">
                  {t('privacyManageData')}
                </p>
                <Button variant="outline" asChild>
                  <Link to="/privacy">
                    {t('privacyGoToSettings')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300"></div>

          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-teal-600" />
                <h3 className="text-lg font-semibold text-gray-900">{t('settingsAbout')}</h3>
            </div>
            <Card className="bg-transparent ring-0 shadow-none">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {providerLocale === "en" ? "About Aroha" : "Mō Aroha"}
                  </h4>
                  <p className="  text-gray-700">
                    {t('aboutDescription')}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                      {providerLocale === "en" ? "Version" : "Putanga"}
                  </h4>
                  <p className="  text-gray-700">0.1.0 (MVP)</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {providerLocale === "en"
                      ? "Translation Attribution"
                      : "Tohu Whakamāoritanga"}
                  </h4>
                  <p className="  text-gray-700">
                    {t('translationAttribution')}
                  </p>
                </div>

                <div className="pt-4">
                  <p className="text-base text-gray-500">
                    {providerLocale === "en"
                      ? "© 2025 Aroha Mental Health Support. This tool is for informational purposes only."
                      : "© 2025 Aroha Tautoko Hauora Hinengaro. He taputapu whakamōhiotanga anake tēnei."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300"></div>

          {/* Disclaimer */}
          <div className="bg-amber-50 rounded-lg p-4">
              <p className="  text-amber-900">
              <strong>{providerLocale === "en" ? "Important:" : "Tino nui:"}</strong>{" "}
              {t('disclaimer')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
