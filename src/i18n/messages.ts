/**
 * Localization messages for Aroha MVP
 * Supports English (en) and te reo Māori (mi)
 * 
 * PHQ-9 translations sourced from phqscreeners.com
 * Note: Professional review recommended before production use
 */

export type Locale = 'en' | 'mi';

export interface Messages {
  // PHQ-9 Questions
  questions: string[];
  
  // Response options (0-3)
  responses: string[];
  
  // UI Labels
  appTitle: string;
  phq9Title: string;
  historyTitle: string;
  settingsTitle: string;
  privacyTitle: string;
  
  // Form labels
  submit: string;
  cancel: string;
  save: string;
  delete: string;
  export: string;
  back: string;
  
  // PHQ-9 specific
  phq9Instructions: string;
  phq9Question10: string;
  
  // Messages
  nudgeText: string;
  escalationText: string;
  consentTitle: string;
  consentText: string;
  consentButton: string;
  
  // Privacy
  privacyDeleteButton: string;
  privacyDeleteConfirm: string;
  privacyExportButton: string;
  
  // History
  historyEmpty: string;
  historyExportPDF: string;
  
  // Settings
  settingsLanguage: string;
  settingsAbout: string;
  
  // Severity levels
  severityMinimal: string;
  severityMild: string;
  severityModerate: string;
  severityModeratelySevere: string;
  severitySevere: string;
  
  // Crisis resources
  crisisTitle: string;
  crisisText: string;
  
  // Disclaimers
  disclaimer: string;
  translationAttribution: string;
}

const messages: Record<Locale, Messages> = {
  en: {
    // PHQ-9 Questions (English)
    questions: [
      '1. Little interest or pleasure in doing things',
      '2. Feeling down, depressed, or hopeless',
      '3. Trouble falling or staying asleep, or sleeping too much',
      '4. Feeling tired or having little energy',
      '5. Poor appetite or overeating',
      '6. Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
      '7. Trouble concentrating on things, such as reading the newspaper or watching television',
      '8. Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
      '9. Thoughts that you would be better off dead, or of hurting yourself in some way',
    ],
    
    responses: [
      'Not at all',
      'Several days',
      'More than half the days',
      'Nearly every day',
    ],
    
    appTitle: 'Aroha - Mental Health Support',
    phq9Title: 'PHQ-9 Assessment',
    historyTitle: 'Assessment History',
    settingsTitle: 'Settings',
    privacyTitle: 'Privacy & Data',
    
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    export: 'Export',
    back: 'Back',
    
    phq9Instructions: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
    phq9Question10: 'If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?',
    
    nudgeText: 'Your score indicates you may be experiencing moderate depression symptoms. Consider speaking with a healthcare provider about your feelings.',
    escalationText: 'Your score indicates you may be experiencing significant distress. We strongly encourage you to reach out for support. If you\'re in immediate danger, please call 111.',
    
    consentTitle: 'Privacy & Consent',
    consentText: 'Your responses are stored only on this device. No data is sent to external servers without your explicit consent. You can export your data as a PDF or JSON file to share with a healthcare provider. You can delete all your data at any time from the Privacy settings.',
    consentButton: 'I understand and consent',
    
    privacyDeleteButton: 'Delete All My Data',
    privacyDeleteConfirm: 'Are you sure you want to delete all your data? This action cannot be undone.',
    privacyExportButton: 'Export All Data (JSON)',
    
    historyEmpty: 'No assessment records yet. Complete a PHQ-9 assessment to see your history.',
    historyExportPDF: 'Export as PDF',
    
    settingsLanguage: 'Language / Reo',
    settingsAbout: 'About',
    
    severityMinimal: 'Minimal',
    severityMild: 'Mild',
    severityModerate: 'Moderate',
    severityModeratelySevere: 'Moderately Severe',
    severitySevere: 'Severe',
    
    crisisTitle: 'Need Immediate Help?',
    crisisText: 'If you\'re in immediate danger or experiencing a crisis:',
    
    disclaimer: 'This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.',
    translationAttribution: 'PHQ-9 translations sourced from phqscreeners.com. Cultural review recommended.',
  },
  
  mi: {
    // PHQ-9 Questions (te reo Māori)
    // Note: These are approximate translations and should be reviewed by a certified translator
    questions: [
      '1. He iti noa iho te hiahia, te koa rānei ki te mahi i ngā mea',
      '2. E rongo ana koe ki te pōuri, ki te whakaparahako, ki te kore tūmanako rānei',
      '3. He uaua ki te taka ki te moe, ki te moe tonu, moe roa rānei',
      '4. E rongo ana ki te ngenge, he iti noa iho te kaha',
      '5. He iti te hiahia kai, kai nui rānei',
      '6. E kino ana tō whakaaro mōu anō — he rahua koe, kua tukua iho e koe tō whānau rānei',
      '7. He uaua ki te aro ki ngā mea, pēnei i te pānui niupepa, te mātaki pouaka whakaata rānei',
      '8. E nuku ana koe, e kōrero ana koe i te pōturi rawa, ka kite ētahi atu tāngata. Me te huarahi kē – kua kanekane koe, kua okioki koe i te nui ake',
      '9. Ngā whakaaro mēnā kua mate koe, ka pai ake, me te mea kia mamae koe ki a koe anō',
    ],
    
    responses: [
      'Kāore rawa',
      'Ētahi rā',
      'Nui ake i te hāwhe o ngā rā',
      'Tata ki ia rā',
    ],
    
    appTitle: 'Aroha - Tautoko Hauora Hinengaro',
    phq9Title: 'Aromatawai PHQ-9',
    historyTitle: 'Hītori Aromatawai',
    settingsTitle: 'Tautuhinga',
    privacyTitle: 'Tūmataiti me ngā Raraunga',
    
    submit: 'Tuku',
    cancel: 'Whakakore',
    save: 'Tiaki',
    delete: 'Mukua',
    export: 'Kaweake',
    back: 'Hoki',
    
    phq9Instructions: 'I roto i ngā wiki 2 kua pahure, kua pēhea te auahatanga o ēnei raru ki a koe?',
    phq9Question10: 'Mēnā i tohua e koe ētahi raru, he pēhea te uaua o ēnei raru ki te mahi i tō mahi, tiaki i ngā mea ki te kāinga, whakawhiti rānei ki ētahi atu tāngata?',
    
    nudgeText: 'Ko tō tohu e tohu ana kei te pā mai pea ngā tohu pōuri wāwāhi. Whakaarohia te kōrero ki tētahi kaiwhakarato hauora mō ō whakaaro.',
    escalationText: 'Ko tō tohu e tohu ana kei te pā mai pea te mamae nui. E tino akiaki ana mātou kia toro atu koe ki te tautoko. Mēnā kei te mōrearea tūturu koe, waea ināianei ki te 111.',
    
    consentTitle: 'Tūmataiti me te Whakaae',
    consentText: 'Ko ō whakautu ka tiakina ki runga i tēnei pūrere anake. Kāore he raraunga ka tukuna ki ngā tūmau o waho kore tō whakaae tūturu. Ka taea e koe te kaweake i ō raraunga hei PDF, JSON rānei hei toha ki tētahi kaiwhakarato hauora. Ka taea e koe te muku i ō raraunga katoa i ngā wā katoa mai i ngā tautuhinga Tūmataiti.',
    consentButton: 'Kua mārama ahau, ka whakaae',
    
    privacyDeleteButton: 'Mukua Aku Raraunga Katoa',
    privacyDeleteConfirm: 'E tino hiahia ana koe ki te muku i ō raraunga katoa? Kāore e taea te whakakore i tēnei mahi.',
    privacyExportButton: 'Kaweake Raraunga Katoa (JSON)',
    
    historyEmpty: 'Kāore anō kia oti te aromatawai. Whakaotihia tētahi aromatawai PHQ-9 kia kite i tō hītori.',
    historyExportPDF: 'Kaweake hei PDF',
    
    settingsLanguage: 'Reo / Language',
    settingsAbout: 'Mō',
    
    severityMinimal: 'Iti rawa',
    severityMild: 'Māmā',
    severityModerate: 'Wāwāhi',
    severityModeratelySevere: 'Taimaha Wāwāhi',
    severitySevere: 'Taimaha',
    
    crisisTitle: 'Me Āwhina Ināianei?',
    crisisText: 'Mēnā kei te mōrearea koe, kei te pā mai rānei te mate:',
    
    disclaimer: 'He taputapu whakamōhiotanga anake tēnei, ehara i te whakakapi mō te tohutohu rata ngaio, te taumate, te maimoatanga rānei.',
    translationAttribution: 'Ko ngā whakamāoritanga PHQ-9 mai i te phqscreeners.com. Me arotake e te ahurea.',
  },
};

/**
 * Get messages for a specific locale
 * @param locale - The locale code ('en' or 'mi')
 * @returns Messages object for the locale
 */
export function getMessages(locale: Locale): Messages {
  return messages[locale] || messages.en;
}

/**
 * Get a specific message by key and locale
 * @param locale - The locale code
 * @param key - The message key
 * @returns The localized message string
 */
export function t(locale: Locale, key: keyof Messages): string | string[] {
  const msgs = getMessages(locale);
  return msgs[key];
}

export default messages;
