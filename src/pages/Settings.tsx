import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getMessages, type Locale } from '@/i18n/messages';
import { 
  setLanguage, 
  isCloudSyncEnabled, 
  setCloudSyncEnabled, 
  syncAllRecordsToSupabase 
} from '@/utils/storage';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Globe, Info, Shield, Cloud, CloudOff } from 'lucide-react';

interface SettingsProps {
  locale: Locale;
  onLocaleChange: (newLocale: Locale) => void;
}

export function Settings({ locale, onLocaleChange }: SettingsProps) {
  const messages = getMessages(locale);
  const [selectedLanguage, setSelectedLanguage] = useState<Locale>(locale);
  const [cloudSync, setCloudSync] = useState<boolean>(isCloudSyncEnabled());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const supabaseConfigured = isSupabaseConfigured();

  useEffect(() => {
    setSelectedLanguage(locale);
  }, [locale]);

  const handleLanguageChange = (value: string) => {
    const newLocale = value as Locale;
    setSelectedLanguage(newLocale);
    setLanguage(newLocale);
    onLocaleChange(newLocale);
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
        console.error('Error syncing records:', error);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{messages.settingsTitle}</CardTitle>
          <CardDescription>
            {locale === 'en' 
              ? 'Manage your preferences and application settings' 
              : 'Whakahaere i ō whiringa me ngā tautuhinga taupānga'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Language Settings */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {messages.settingsLanguage}
              </h3>
            </div>
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <RadioGroup value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="en" id="lang-en" />
                      <Label htmlFor="lang-en" className="cursor-pointer font-normal">
                        <div>
                          <div className="font-medium">English</div>
                          <div className="text-sm text-gray-500">
                            Display all content in English
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="mi" id="lang-mi" />
                      <Label htmlFor="lang-mi" className="cursor-pointer font-normal">
                        <div>
                          <div className="font-medium">Te Reo Māori</div>
                          <div className="text-sm text-gray-500">
                            {locale === 'en' 
                              ? 'Display all content in te reo Māori' 
                              : 'Whakaatuhia ngā ihirangi katoa i te reo Māori'}
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900">
                    {locale === 'en'
                      ? 'Language changes will apply immediately to all pages'
                      : 'Ka tū tōmua ngā huringa reo ki ngā whārangi katoa'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cloud Sync Settings */}
          {supabaseConfigured && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                {cloudSync ? (
                  <Cloud className="h-5 w-5 text-blue-600" />
                ) : (
                  <CloudOff className="h-5 w-5 text-gray-400" />
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {locale === 'en' ? 'Cloud Sync' : 'Tukutahi Kapua'}
                </h3>
              </div>
              <Card className="bg-gray-50">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="cloud-sync-toggle" className="font-medium text-gray-900 cursor-pointer">
                          {locale === 'en' ? 'Enable Cloud Sync' : 'Whakahohe i te Tukutahi Kapua'}
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600">
                        {locale === 'en'
                          ? 'Securely backup your PHQ-9 records to the cloud. Your data will be encrypted and accessible from any device.'
                          : 'Kia haumaru te tiaki tuauri i ō pūkete PHQ-9 ki te kapua. Ka whakamunaina ō raraunga ka taea te uru mai i tētahi pūrere.'}
                      </p>
                    </div>
                    <Button
                      id="cloud-sync-toggle"
                      variant={cloudSync ? 'default' : 'outline'}
                      size="sm"
                      onClick={handleCloudSyncToggle}
                      disabled={isSyncing}
                      className="ml-4"
                    >
                      {isSyncing ? (
                        locale === 'en' ? 'Syncing...' : 'E tukutahi ana...'
                      ) : cloudSync ? (
                        locale === 'en' ? 'Enabled' : 'Kua whakahohe'
                      ) : (
                        locale === 'en' ? 'Enable' : 'Whakahohe'
                      )}
                    </Button>
                  </div>
                  
                  {cloudSync && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-900">
                        {locale === 'en'
                          ? '✓ Cloud sync is active. Your records are being automatically backed up.'
                          : '✓ Kei te mahi te tukutahi kapua. Kei te tiakina aunoa ō pūkete.'}
                      </p>
                    </div>
                  )}
                  
                  {!cloudSync && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-900">
                        {locale === 'en'
                          ? 'Your data is currently stored locally only. Enable cloud sync to access your records from other devices.'
                          : 'Kei te tiakina noa ō raraunga i te wāhi. Whakahohe i te tukutahi kapua kia uru ō pūkete mai i ētahi atu pūrere.'}
                      </p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      {locale === 'en'
                        ? 'Privacy: Your data is encrypted in transit and at rest. You can disable sync and delete cloud data at any time from Privacy settings.'
                        : 'Tūmataiti: Ka whakamunaina ō raraunga i te haerenga me te okiokinga. Ka taea e koe te whakakore i te tukutahi me te muku i ngā raraunga kapua i te wā katoa mai i ngā tautuhinga Tūmataiti.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Privacy Link */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {messages.privacyTitle}
              </h3>
            </div>
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-700 mb-4">
                  {locale === 'en'
                    ? 'Manage your data, review our privacy practices, and control what information is stored.'
                    : 'Whakahaere i ō raraunga, arotake i ā mātou tikanga tūmataiti, me te whakahaere i ngā mōhiohio e tiakina ana.'}
                </p>
                <Button variant="outline" onClick={() => window.location.hash = '#privacy'}>
                  {locale === 'en' ? 'Go to Privacy Settings' : 'Haere ki ngā Tautuhinga Tūmataiti'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {messages.settingsAbout}
              </h3>
            </div>
            <Card className="bg-gray-50">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {locale === 'en' ? 'About Aroha' : 'Mō Aroha'}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {locale === 'en'
                      ? 'Aroha is a mental health support tool designed to help young people in New Zealand monitor their wellbeing using the PHQ-9 depression screening questionnaire.'
                      : 'Ko Aroha he taputapu tautoko hauora hinengaro i hangaia hei āwhina i ngā taiohi o Aotearoa ki te aroturuki i tō rātou oranga mā te whakamahi i te pātai aromātai pōuri PHQ-9.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {locale === 'en' ? 'Version' : 'Putanga'}
                  </h4>
                  <p className="text-sm text-gray-700">0.1.0 (MVP)</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {locale === 'en' ? 'Translation Attribution' : 'Tohu Whakamāoritanga'}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {messages.translationAttribution}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    {locale === 'en'
                      ? '© 2025 Aroha Mental Health Support. This tool is for informational purposes only.'
                      : '© 2025 Aroha Tautoko Hauora Hinengaro. He taputapu whakamōhiotanga anake tēnei.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              <strong>{locale === 'en' ? 'Important:' : 'Tino nui:'}</strong> {messages.disclaimer}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
