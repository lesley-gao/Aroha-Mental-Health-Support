/**
 * Localization messages for Aroha MVP
 * Supports English (en) and te reo Māori (mi)
 * 
 * PHQ-9 translations sourced from phqscreeners.com
 * Note: Professional review recommended before production use
 */

export type Locale = 'en' | 'mi' | 'zh';

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
  loginButton: string;
  
  // Privacy
  privacyDeleteButton: string;
  privacyDeleteConfirm: string;
  privacyExportButton: string;
  privacyPageIntro: string;
  privacyCardTitle: string;
  privacyCardDescription: string;
  privacyLocalStorageHeading: string;
  privacyLocalStorageText: string;
  privacyWhatWeStore: string;
  privacyWhatWeDontStore: string;
  privacyDataPersistence: string;
  privacyExportCardTitle: string;
  privacyExportCardDescription: string;
  privacyExportExplanation: string;
  privacyExporting: string;
  privacyDeleteCardTitle: string;
  privacyDeleteCardDescription: string;
  privacyDeleteWarning: string;
  privacyConfirmDeletionTitle: string;
  
  // History
  historyEmpty: string;
  historyExportPDF: string;
  
  // Settings
  settingsLanguage: string;
  settingsAbout: string;
  settingsDescription: string;
  languageOptionMiDesc: string;
  languageApplyImmediately: string;

  cloudSyncDescription: string;
  cloudSyncTitle: string;
  cloudSyncEnableLabel: string;
  cloudSyncSyncing: string;
  cloudSyncEnabledText: string;
  cloudSyncEnableText: string;
  cloudSyncActiveText: string;
  cloudSyncLocalOnlyText: string;
  cloudSyncPrivacyNote: string;

  privacyManageData: string;
  privacyGoToSettings: string;

  // Privacy list labels (separate from full sentences)
  privacyWhatWeStoreLabel: string;
  privacyWhatWeDontStoreLabel: string;
  privacyDataPersistenceLabel: string;

  aboutDescription: string;
  
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
  
  // Consent details
  consentKnowHeading: string;
  consentPoint1: string;
  consentPoint2: string;
  consentPoint3: string;
  consentPoint4: string;
  consentPoint5: string;
  consentPoint6: string;
  
  // Footer
  footerMessage: string;
  footerDisclaimer: string;
  navHome: string;
  logoutButton: string;
  migrateTitle: string;
  migrateBody: string;
  migrateKeepLocal: string;
  migrateNow: string;
  noRecordsToExport: string;
  failedExport: string;
  pleaseAnswerAll: string;
  saving: string;
  savedSuccessfully: string;
  aiHelpText: string;
  
  // PHQ-9 Information
  phq9InfoTitle: string;
  phq9InfoDescription: string;
  phq9InfoValidation: string;
  // Home page / marketing copy
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageText: string;
  getStarted: string;

  phq9Description: string;
  takeAssessment: string;

  diaryTitle: string;
  diaryDescription: string;
  startWriting: string;

  historyDescription: string;
  viewProgress: string;

  whyArohaTitle: string;
  privateSecureTitle: string;
  privateSecureDesc: string;
  insightsTitle: string;
  insightsDesc: string;
  aiPoweredTitle: string;
  aiPoweredDesc: string;
  nzFocusedTitle: string;
  nzFocusedDesc: string;

  quickStartTitle: string;
  quickStartSubtitle: string;
  step1: string;
  step2: string;
  step3: string;
  beginJourney: string;
  // Speech component / browser STT
  startRecording: string;
  stopRecording: string;
  browserPowered: string;
  processing: string;
  transcribing: string;
  summarizing: string;
  aiPowered: string;
  listening: string;
  tip: string;
  error: string;
  notSupported: string;
  permissionDenied: string;
  noSpeech: string;
  tryAgain: string;
  recordingTime: string;
  requiresInternet: string;
  aiSummary: string;
  // Diary page strings
  diaryPageTitle: string;
  diarySubtitle: string;
  diaryEntryTitle: string;
  diaryTitlePlaceholder: string;
  diaryPlaceholder: string;
  diarySaveEntry: string;
  diarySaved: string;
  diaryClear: string;
  diaryClearConfirm: string;
  diaryNoEntries: string;
  diarySelectDate: string;
  diaryCharacters: string;
  diaryClearSummary: string;
  diaryInsertSummary: string;
  diaryShowAllDiaries: string;
  diaryRecentEntries: string;
  diaryLocalNotice: string;
  diaryLoginCreate: string;
  diaryViewFull: string;
  loading: string;
  backToDiary: string;
  noEntry: string;
  previous: string;
  next: string;
  untitled: string;
  edit: string;
  created: string;
  lastModified: string;
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
    phq9Title: 'Assessment',
    historyTitle: 'History',
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
    consentText: 'We want you to feel safe and in control:',
    consentButton: 'I understand and consent',
    loginButton: 'Login',
    
    privacyDeleteButton: 'Delete All My Data',
    privacyDeleteConfirm: 'Are you sure you want to delete all your data? This action cannot be undone.',
    privacyExportButton: 'Export All Data (JSON)',
    privacyPageIntro: 'Manage your data and privacy settings',
    privacyCardTitle: 'Your Privacy',
    privacyCardDescription: 'How your data is stored and protected',
    privacyLocalStorageHeading: 'Local Storage Only',
    privacyLocalStorageText: "All your assessment data is stored only on this device in your browser's local storage. No data is sent to external servers or cloud services.",
    privacyWhatWeStore: 'PHQ-9 assessment responses, scores, dates, language preference, and consent status.',
    privacyWhatWeDontStore: 'No personal identification, no account information, no tracking data.',
    privacyDataPersistence: 'Your data remains on this device until you delete it or clear your browser data.',
    privacyWhatWeStoreLabel: 'What we store:',
    privacyWhatWeDontStoreLabel: "What we don't store:",
    privacyDataPersistenceLabel: 'Data persistence:',
    privacyExportCardTitle: 'Export Your Data',
    privacyExportCardDescription: 'Download all your data as a JSON file',
    privacyExportExplanation: 'Export all your assessment records, settings, and data in JSON format. You can share this file with a healthcare provider or keep it as a backup.',
    privacyExporting: 'Exporting...',
    privacyDeleteCardTitle: 'Delete All Data',
    privacyDeleteCardDescription: 'Permanently remove all your data from this device',
    privacyDeleteWarning: 'This will permanently delete all your PHQ-9 assessments, history, and settings. This action cannot be undone. Consider exporting your data first.',
    privacyConfirmDeletionTitle: 'Confirm Deletion',
    
    historyEmpty: 'No assessment records yet. Complete a PHQ-9 assessment to see your history.',
    historyExportPDF: 'Export as PDF',
    
    settingsLanguage: 'Language / Reo',
    settingsAbout: 'About',
    settingsDescription: 'Manage your preferences and application settings',
    
    severityMinimal: 'Minimal',
    severityMild: 'Mild',
    severityModerate: 'Moderate',
    severityModeratelySevere: 'Moderately Severe',
    severitySevere: 'Severe',
    
    crisisTitle: 'Need Immediate Help?',
    crisisText: 'If you\'re in immediate danger or experiencing a crisis:',
    
    disclaimer: 'This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.',
    translationAttribution: 'PHQ-9 translations sourced from phqscreeners.com. Cultural review recommended.',
    
    consentKnowHeading: 'What you should know:',
    consentPoint1: 'You can use Aroha anonymously - no account needed',
    consentPoint2: 'Create an account anytime to save and access your records across devices',
    consentPoint3: 'Your data is always encrypted and stored securely',
    consentPoint4: 'Microphone access is completely optional (only for voice journaling)',
    consentPoint5: 'Export or share your data whenever you need to',
    consentPoint6: "You can delete everything anytime - it's your data",
    
    footerMessage: "You're not alone on this journey. Every step counts.",
    footerDisclaimer:
      "This tool is for self-monitoring only. If you're in crisis, please call 1737 for support.",
    navHome: 'Home',
    logoutButton: 'Logout',
    migrateTitle: 'Migrate local records',
    migrateBody: 'We found {count} local assessment(s) stored on this device. You can copy them to your account to access them from other devices.',
    migrateKeepLocal: 'Keep local',
    migrateNow: 'Migrate now',
    noRecordsToExport: 'No records to export',
    failedExport: 'Failed to export PDF',
    pleaseAnswerAll: 'Please answer all questions',
    saving: 'Saving...',
    savedSuccessfully: 'Saved successfully!',
    aiHelpText: 'AI will transcribe your speech and provide a summary of your thoughts.',
    
    phq9InfoTitle: 'About PHQ-9 Assessment',
    phq9InfoDescription: 'The Patient Health Questionnaire-9 (PHQ-9) is a clinically validated self-administered tool designed to assess the presence and severity of depressive symptoms. Each of its nine items corresponds to the diagnostic criteria for major depressive disorder as outlined in the DSM-5.',
    phq9InfoValidation: 'The PHQ-9 has been validated internationally and is available in over 30 languages. It has been widely used and validated in countries including the United States, United Kingdom, Canada, Australia, New Zealand, and many others across Europe, Asia, and Latin America.',
    // Home / marketing copy
    tagline: 'Mental Health Support for Aotearoa',
    heroTitle: 'Your Journey to Wellbeing Starts Here',
    heroSubtitle:
      'Track your mental health, journal your thoughts, and gain insights with Aroha - a free, private tool designed for young New Zealanders.',
    heroImageText: 'Grow Your Mental Wellness',
    getStarted: 'Get Started',

    phq9Description:
      'Take a clinically-validated depression screening to understand your mental wellbeing.',
    takeAssessment: 'Take Assessment',

    diaryTitle: 'Diary',
    diaryDescription:
      'Express your thoughts with voice-to-text and AI-powered emotional summaries.',
    startWriting: 'Start Writing',

    historyDescription:
      'Visualize your mental health journey with beautiful charts and trend analysis.',
    viewProgress: 'View Progress',

    whyArohaTitle: 'Why Choose Aroha?',
    privateSecureTitle: 'Private & Secure',
    privateSecureDesc:
      'Your data stays with you. Export or delete anytime. Optional cloud sync with encryption.',

    insightsTitle: 'Track & Export',
    insightsDesc:
      'Track your mood daily and export your data as PDF or JSON for future clinical records and healthcare provider visits.',
    aiPoweredTitle: 'AI-Powered Insights',
    aiPoweredDesc:
      'Voice-to-text diary entries with emotional keyword detection and smart summaries.',
    nzFocusedTitle: 'NZ-Focused Resources',
    nzFocusedDesc:
      'Curated mental health resources and crisis support specific to Aotearoa New Zealand.',

    quickStartTitle: 'Get Started in 3 Simple Steps',
    quickStartSubtitle: 'Begin your journey to better mental health today',
    step1: 'Take your first PHQ-9 assessment',
    step2: 'Write a diary entry about your day',
    step3: 'Track your progress over time',
    beginJourney: 'Begin Your Journey',
    // Browser speech / STT messages
    startRecording: 'Start Recording',
    stopRecording: 'Stop Recording',
    browserPowered: 'Speech to text',
    processing: 'Processing...',
    transcribing: 'Transcribing your speech...',
    summarizing: 'Summarizing your thoughts...',
    aiPowered: 'AI-Powered',
    notSupported: 'Speech recognition not supported in this browser. Please use Chrome or Edge.',
    permissionDenied: 'Microphone permission denied',
    noSpeech: 'No speech detected',
    tryAgain: 'Try Again',
    recordingTime: 'Recording',
    requiresInternet: 'Please make sure you are connected to the internet',
    aiSummary: 'Here is what AI summarizes:',
    listening: 'Listening...',
    tip: 'Tip: speak clearly and try to minimise background noise.',
    error: 'Error',
    // Diary
    diaryPageTitle: 'My Diary',
    diarySubtitle: 'Record your thoughts and feelings',
    diaryEntryTitle: 'Entry Title',
    diaryTitlePlaceholder: 'Give your entry a title...',
    diaryPlaceholder: 'Write your thoughts here...',
    diarySaveEntry: 'Save Entry',
    diarySaved: 'Entry Saved',
    diaryClear: 'Clear',
    diaryClearConfirm: 'Are you sure you want to clear this entry?',
    diaryNoEntries: 'No entries yet. Start writing!',
    diarySelectDate: 'Select Date',
    diaryCharacters: 'characters',
    diaryClearSummary: 'Clear',
    diaryInsertSummary: 'Add to Entry',
    diaryShowAllDiaries: 'Show All Diaries',
    diaryRecentEntries: 'Recent Entries',
    diaryLocalNotice: 'You are using the diary locally on this device. Sign in to save and sync entries across devices.',
    diaryLoginCreate: 'Login / Create account',
    diaryViewFull: 'View Full',
    loading: 'Loading...',
    backToDiary: 'Back to Diary',
    noEntry: 'No entry found for this date',
    previous: 'Previous',
    next: 'Next',
    untitled: 'Untitled Entry',
    edit: 'Edit',
    created: 'Created',
    lastModified: 'Last modified',
    // Settings & Cloud copy
    languageOptionMiDesc: 'Display all content in te reo Māori',
    languageApplyImmediately: 'Language changes will apply immediately to all pages',

    cloudSyncDescription: 'Securely backup your PHQ-9 records to the cloud. Your data will be encrypted and accessible from any device.',
    cloudSyncTitle: 'Cloud Sync',
    cloudSyncEnableLabel: 'Enable Cloud Sync',
    cloudSyncSyncing: 'Syncing...',
    cloudSyncEnabledText: 'Enabled',
    cloudSyncEnableText: 'Enable',
    cloudSyncActiveText: '✓ Cloud sync is active. Your records are being automatically backed up.',
    cloudSyncLocalOnlyText: 'Your data is currently stored locally only. Enable cloud sync to access your records from other devices.',
    cloudSyncPrivacyNote: 'Privacy: Your data is encrypted in transit and at rest. You can disable sync and delete cloud data at any time from Privacy settings.',

    privacyManageData: 'Manage your data, review our privacy practices, and control what information is stored.',
    privacyGoToSettings: 'Go to Privacy Settings',

    aboutDescription: 'Aroha is a mental health support tool designed to help young people in New Zealand monitor their wellbeing using the PHQ-9 depression screening questionnaire.',
  },
  
  zh: {
    // PHQ-9 Questions (Simplified Chinese)
    questions: [
      '1. 对做事缺乏兴趣或乐趣',
      '2. 感到沮丧、消沉或绝望',
      '3. 入睡困难、睡眠维持困难或睡得过多',
      '4. 感到疲倦或精力不足',
      '5. 食欲不振或暴饮暴食',
      '6. 对自己感到很糟糕——觉得自己是个失败者或让家人失望',
      '7. 难以集中注意力，比如读报或看电视时',
      '8. 行动或说话缓慢到别人能注意到；或者相反——焦躁不安，动作比平常多',
      '9. 有想死或想伤害自己的念头',
    ],

    responses: [
      '完全没有',
      '有几天',
      '超过一半的日子',
      '几乎每天',
    ],

    appTitle: 'Aroha - 心理健康支持',
    phq9Title: 'PHQ-9 评估',
    historyTitle: '评估记录',
    settingsTitle: '设置',
    privacyTitle: '隐私与数据',

    settingsDescription: '管理您的偏好和应用设置',

    submit: '提交',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    export: '导出',
    back: '返回',

    phq9Instructions: '在过去两周里，以下问题困扰你的频率如何？',
    phq9Question10: '如果你勾选了任何问题，这些问题在工作、照顾家庭或与他人相处方面造成了多大困难？',

    nudgeText: '你的得分表明你可能正在经历中度抑郁症状。请考虑与医疗服务提供者讨论你的感受。',
    escalationText: '你的得分显示你可能正经历较严重的痛苦。我们强烈建议你寻求支持。如果你处于危险之中，请拨打紧急电话。',

    consentTitle: '隐私与同意',
    consentText: '我们希望你感到安心，并且觉得一切尽在你的掌控：',
    consentButton: '我已阅读并同意',
    loginButton: '登录',

    privacyDeleteButton: '删除我的所有数据',
    privacyDeleteConfirm: '你确定要删除所有数据吗？此操作无法撤销。',
    privacyExportButton: '导出所有数据 (JSON)',
    privacyPageIntro: '管理您的数据和隐私设置',
    privacyCardTitle: '您的隐私',
    privacyCardDescription: '您的数据如何被存储和保护',
    privacyLocalStorageHeading: '仅限本地存储',
    privacyLocalStorageText: '您的所有评估数据仅存储在此设备的浏览器本地存储中。不会将数据发送到外部服务器或云服务。',
    privacyWhatWeStore: 'PHQ-9 评估响应、分数、日期、语言偏好和同意状态。',
    privacyWhatWeDontStore: '不存储个人身份信息、帐户信息或跟踪数据。',
    privacyDataPersistence: '您的数据将保留在此设备上，直到您删除它或清除浏览器数据为止。',
    privacyWhatWeStoreLabel: '我们存储的内容：',
    privacyWhatWeDontStoreLabel: '我们不存储：',
    privacyDataPersistenceLabel: '数据保留：',
    privacyExportCardTitle: '导出您的数据',
    privacyExportCardDescription: '将所有数据下载为 JSON 文件',
    privacyExportExplanation: '以 JSON 格式导出所有评估记录、设置和数据。您可以与医疗服务提供者共享此文件或将其保留为备份。',
    privacyExporting: '正在导出...',
    privacyDeleteCardTitle: '删除所有数据',
    privacyDeleteCardDescription: '从此设备永久删除所有数据',
    privacyDeleteWarning: '这将永久删除您所有的 PHQ-9 评估、历史记录和设置。此操作无法撤销。请先考虑导出您的数据。',
    privacyConfirmDeletionTitle: '确认删除',

    historyEmpty: '还没有评估记录。完成 PHQ-9 评估以查看你的历史记录。',
    historyExportPDF: '导出为 PDF',

    settingsLanguage: '语言 / Reo',
    settingsAbout: '关于',

    severityMinimal: '极轻',
    severityMild: '轻度',
    severityModerate: '中度',
    severityModeratelySevere: '中重度',
    severitySevere: '重度',

    crisisTitle: '需要紧急帮助？',
    crisisText: '如果你处于紧急危险或危机中：',

    disclaimer: '此工具仅供参考，不能替代专业医疗建议、诊断或治疗。',
    translationAttribution: 'PHQ-9 翻译来源于 phqscreeners.com。建议进行文化和临床审查。',
    
    consentKnowHeading: '你需要知道的：',
    consentPoint1: '你可以匿名使用 Aroha — 无需创建账户',
    consentPoint2: '随时创建账户以保存并跨设备访问你的记录',
    consentPoint3: '你的数据始终经过加密并安全存储',
    consentPoint4: '麦克风访问完全可选（仅用于语音日记）',
    consentPoint5: '随时导出或分享你的数据',
    consentPoint6: '你可以随时删除所有内容 — 这是你的数据',
    
  footerMessage: '你并不孤单，每一步都很重要。',
  footerDisclaimer: '此工具仅供自我监测使用。如果你处于危机中，请拨打1737寻求帮助。',
  navHome: '主页',
  logoutButton: '登出',
  migrateTitle: '迁移本地记录',
  migrateBody: '我们在此设备上发现 {count} 条本地评估记录。您可以将它们复制到您的账户，以便在其他设备上访问。',
  migrateKeepLocal: '保留本地',
  migrateNow: '立即迁移',
  noRecordsToExport: '没有可导出的记录',
  failedExport: '导出 PDF 失败',
  pleaseAnswerAll: '请回答所有问题',
  saving: '正在保存...',
  savedSuccessfully: '保存成功！',
  aiHelpText: 'AI 会将您的语音转写并提供思路摘要。',

    phq9InfoTitle: '关于 PHQ-9 评估',
    phq9InfoDescription: '患者健康问卷-9（PHQ-9）是一种经临床验证的自评量表，用于评估抑郁症状的存在与严重程度。其九个条目对应 DSM-5 中的抑郁症诊断标准。',
    phq9InfoValidation: 'PHQ-9 已在国际上得到验证并有超过 30 种语言的译本。该量表已在多个国家使用并验证。',
    // Home / marketing copy (Simplified Chinese)
    tagline: '为新西兰提供心理健康支持',
    heroTitle: '你的康复之旅从这里开始',
    heroSubtitle:
      '使用 Aroha 记录心理健康、写日记并获得洞察——这是为新西兰年轻人设计的免费私人工具。',
    heroImageText: '提升你的心理健康',
    getStarted: '开始使用',

    phq9Description:
      '进行经临床验证的抑郁筛查以了解你的心理健康状况。',
    takeAssessment: '开始评估',

    diaryTitle: '日记',
    diaryDescription:
      '通过语音转文字记录想法，使用 AI 自动生成情绪摘要。',
    startWriting: '开始记录',

    historyDescription:
      '通过图表和趋势分析可视化你的心理健康变化。',
    viewProgress: '查看进度',

    whyArohaTitle: '为什么选择 Aroha？',
    privateSecureTitle: '私密且安全',
    privateSecureDesc:
      '你的数据由你掌控。可随时导出或删除。可选的云同步并加密存储。',

    insightsTitle: '记录与导出',
    insightsDesc:
      '每日记录情绪，并将数据导出为 PDF 或 JSON，便于未来临床记录或提供给医疗服务者。',
    aiPoweredTitle: 'AI 驱动的洞察',
    aiPoweredDesc:
      '语音转文字日记，具有情绪关键词检测和智能摘要功能。',
    nzFocusedTitle: '面向新西兰的资源',
    nzFocusedDesc:
      '为新西兰精心策划的心理健康资源与危机支持。',

    quickStartTitle: '三步快速开始',
    quickStartSubtitle: '从今天起开始你的心理健康之旅',
    step1: '完成你的第一次 PHQ-9 评估',
    step2: '写一篇当日的日记',
    step3: '随时间跟踪你的进展',
    beginJourney: '开始你的旅程',
    // Browser speech / STT messages (Simplified Chinese)
    startRecording: '开始录音',
    stopRecording: '停止录音',
    processing: '处理...',
    transcribing: '正在转录您的语音...',
    summarizing: '正在为您总结...',
    aiPowered: 'AI 驱动',
    browserPowered: '语音转文字',
    notSupported: '此浏览器不支持语音识别。请使用 Chrome 或 Edge。',
    permissionDenied: '麦克风权限被拒绝',
    noSpeech: '未检测到语音',
    tryAgain: '重试',
    recordingTime: '录音',
    requiresInternet: '请确保你已连接到互联网',
    aiSummary: 'AI 的摘要如下：',
    listening: '正在聆听...',
    tip: '提示：请清晰讲话并尽量减少背景噪音。',
    error: '错误',
    // Diary
    diaryPageTitle: '我的日记',
    diarySubtitle: '记录你的想法和感受',
    diaryEntryTitle: '条目标题',
    diaryTitlePlaceholder: '为你的条目命名...',
    diaryPlaceholder: '在这里写下你的想法...',
    diarySaveEntry: '保存条目',
    diarySaved: '已保存',
    diaryClear: '清除',
    diaryClearConfirm: '确定要清除此条目吗？',
    diaryNoEntries: '还没有条目。开始写吧！',
    diarySelectDate: '选择日期',
    diaryCharacters: '字符',
    diaryClearSummary: '清除',
    diaryInsertSummary: '添加到条目',
    diaryShowAllDiaries: '显示所有日记',
    diaryRecentEntries: '最近条目',
    diaryLocalNotice: '您当前在此设备上本地使用日记。登录以保存并在多个设备间同步条目。',
    diaryLoginCreate: '登录 / 创建账号',
    diaryViewFull: '查看完整',
    loading: '加载中...',
    backToDiary: '返回日记',
    noEntry: '该日期未找到条目',
    previous: '上一条',
    next: '下一条',
    untitled: '未命名条目',
    edit: '编辑',
    created: '已创建',
    lastModified: '最后修改',
    // Settings & Cloud copy (Simplified Chinese)
    languageOptionMiDesc: '以毛利语显示所有内容',
    languageApplyImmediately: '语言更改将立即应用于所有页面',

    cloudSyncDescription: '将您的 PHQ-9 记录安全备份到云端。您的数据将被加密并可在任何设备上访问。',
    cloudSyncTitle: '云同步',
    cloudSyncEnableLabel: '启用云同步',
    cloudSyncSyncing: '正在同步...',
    cloudSyncEnabledText: '已启用',
    cloudSyncEnableText: '启用',
    cloudSyncActiveText: '✓ 云同步已激活。正在自动备份您的记录。',
    cloudSyncLocalOnlyText: '您的数据当前仅存储在本地。启用云同步以从其他设备访问您的记录。',
    cloudSyncPrivacyNote: '隐私：您的数据在传输和静态时均已加密。您可以随时在隐私设置中禁用同步并删除云数据。',

    privacyManageData: '管理您的数据，查看我们的隐私做法，并控制存储的信息。',
    privacyGoToSettings: '隐私设置',

    aboutDescription: 'Aroha 是一个心理健康支持工具，旨在帮助新西兰的年轻人使用 PHQ-9 抑郁筛查问卷监测他们的健康状况。',
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
    consentText: 'Kei te hiahia mātou kia maurea e koe te haumaru me te mana:',
    consentButton: 'Kua mārama ahau, ka whakaae',
    loginButton: 'Takiuru',
    
    privacyDeleteButton: 'Mukua Aku Raraunga Katoa',
    privacyDeleteConfirm: 'E tino hiahia ana koe ki te muku i ō raraunga katoa? Kāore e taea te whakakore i tēnei mahi.',
    privacyExportButton: 'Kaweake Raraunga Katoa (JSON)',
    privacyPageIntro: 'Whakahaere i ō raraunga me ngā tautuhinga tūmataiti',
    privacyCardTitle: 'Tō Tūmataiti',
    privacyCardDescription: 'Me pēhea te penapena me te tiaki i ō raraunga',
    privacyLocalStorageHeading: 'Rokiroki ā-Rorohiko Anake',
    privacyLocalStorageText: 'Kei te penapena noa ō raraunga aromatawai ki tēnei pūrere i roto i te rokiroki ā-ipurangi o tō pūtirotiro. Kāore e tukuna ngā raraunga ki ngā tūmau o waho, kaituari kapua rānei.',
    privacyWhatWeStore: 'Ngā urupare aromatawai PHQ-9, ngā tohu, ngā rā, te hiahia reo, me te tūnga whakaaetanga.',
    privacyWhatWeDontStore: 'Kāore e penapena i te tuakiri whaiaro, mōhiohio pūkete, rānei i ngā raraunga aru.',
    privacyDataPersistence: 'Ka noho ō raraunga ki runga i tēnei pūrere kia tae rā anō koe ki te muku i a rātou, ki te muku rānei i ngā raraunga pūtirotiro.',
    privacyWhatWeStoreLabel: 'Ngā mea ka penapenahia:',
    privacyWhatWeDontStoreLabel: 'Kāore e penapena:',
    privacyDataPersistenceLabel: 'Te pupuri raraunga:',
    privacyExportCardTitle: 'Kaweake ō Raraunga',
    privacyExportCardDescription: 'Tikiake ō raraunga katoa hei kōnae JSON',
    privacyExportExplanation: 'Kaweakehia ō rekoata aromatawai, ngā tautuhinga, me ngā raraunga katoa ki te hōputu JSON. Ka taea e koe te tiri i tēnei kōnae ki tētahi kaihoko hauora, ki te pupuri rānei hei tārua.',
    privacyExporting: 'E kaweake ana...',
    privacyDeleteCardTitle: 'Mukua Ngā Raraunga Katoa',
    privacyDeleteCardDescription: 'Mukua ngā raraunga katoa i tēnei pūrere mo ake tonu atu',
    privacyDeleteWarning: 'Ka mukua tēnei i ō aromatawai PHQ-9, ō hītori, me ō tautuhinga. Kāore e taea te whakaora. Whakaarohia te kaweake i ō raraunga tuatahi.',
    privacyConfirmDeletionTitle: 'Whakahokia te Mukunga',
    
    historyEmpty: 'Kāore anō kia oti te aromatawai. Whakaotihia tētahi aromatawai PHQ-9 kia kite i tō hītori.',
    historyExportPDF: 'Kaweake hei PDF',
    
    settingsLanguage: 'Reo / Language',
    settingsAbout: 'Mō',
    settingsDescription: 'Whakahaere i ō whiringa me ngā tautuhinga taupānga',
    
    severityMinimal: 'Iti rawa',
    severityMild: 'Māmā',
    severityModerate: 'Wāwāhi',
    severityModeratelySevere: 'Taimaha Wāwāhi',
    severitySevere: 'Taimaha',
    
    crisisTitle: 'Me Āwhina Ināianei?',
    crisisText: 'Mēnā kei te mōrearea koe, kei te pā mai rānei te mate:',
    
    disclaimer: 'He taputapu whakamōhiotanga anake tēnei, ehara i te whakakapi mō te tohutohu rata ngaio, te taumate, te maimoatanga rānei.',
    translationAttribution: 'Ko ngā whakamāoritanga PHQ-9 mai i te phqscreeners.com. Me arotake e te ahurea.',
    
    consentKnowHeading: 'Me mōhio koe:',
    consentPoint1: 'Ka taea e koe te whakamahi i a Aroha me te kore ingoa — kāore e hiahia pūkete',
    consentPoint2: 'Waihanga pūkete i ngā wā katoa hei tiaki me te uru ki ō pūkete puta noa i ngā pūrere',
    consentPoint3: 'Ka whakamunaina tōu raraunga, ka tiakina hoki i te haumaru',
    consentPoint4: 'Ko te uru mikiona he whiringa katoa (mō te pukapuka reo anake)',
    consentPoint5: 'Kaweakehia, tiri rānei i ō raraunga i ngā wā e hiahia ana koe',
    consentPoint6: 'Ka taea e koe te muku i ngā mea katoa i ngā wā katoa — ko tō raraunga tēnei',
    
  footerMessage: 'Ehara koe i te takitahi i runga i tēnei haerenga. He mea nui ia hipanga.',
  footerDisclaimer: 'He taputapu mō te aroturuki whaiaro anake. Mēnā kei te ohotata koe, waea 1737 mō te tautoko.',
  navHome: 'Kāinga',
  logoutButton: 'Wete atu',
  migrateTitle: 'Nohonga whakawhiti raraunga',
  migrateBody: 'Kua kitea e mātou {count} aromatawai i runga i tēnei pūrere. Ka taea e koe te kape ki tō pūkete kia taea te kimi i ngā pūrere kē.',
  migrateKeepLocal: 'Puritia ki te taputapu',
  migrateNow: 'Tukutahi ināianei',
  noRecordsToExport: 'Kāore he pūkete hei kaweake',
  failedExport: 'I rahua te kaweake PDF',
  pleaseAnswerAll: 'Tēnā koa, whakautua ngā pātai katoa',
  saving: 'E tiaki ana...',
  savedSuccessfully: 'Kua whakaorangia!',
  aiHelpText: 'Ka tuhituhi te AI i ō kōrero, ka whakarato whakarāpopototanga o ō whakaaro.',
    
    phq9InfoTitle: 'Mō te Aromatawai PHQ-9',
    phq9InfoDescription: 'Ko te Pātai Hauora Tūroro-9 (PHQ-9) he taputapu whakamātau ā-haumanu i hangaia hei aromātai i te noho me te taumaha o ngā tohu pōuri. Ko ia o ngā mea e iwa e hāngai ana ki ngā paearu whakatau mō te mate pōuri nui e whakaaturia ana i te DSM-5.',
    phq9InfoValidation: 'Kua whakamānā te PHQ-9 ā-ao, ā, e wātea ana i ngā reo neke atu i te 30. Kua whakamahia whānuitia, kua whakamānā hoki i ngā whenua pērā i te United States, te United Kingdom, te Canada, te Australia, Aotearoa, me ētahi atu whenua puta noa i Ūropi, Āhia, me Amerika ki te Tonga.',
    // Home / marketing copy (Māori)
    tagline: 'Tautoko Hauora Hinengaro mō Aotearoa',
    heroTitle: 'Tō Haerenga ki te Oranga Ka Tīmata Ināianei',
    heroSubtitle:
      'Aroturukihia tō hauora hinengaro, tuhia ō whakaaro, ka whiwhi whāinga mā Aroha - he taputapu kore utu, tūmataiti i hangaia mō ngā taiohi o Aotearoa.',
    heroImageText: 'Whakatipu i Tō Hauora Hinengaro',
    getStarted: 'Tīmata',

    phq9Description:
      'Tangohia tētahi aromatawai aromātai pōuri kua whakamānā ā-haumanu ki te mārama i tō oranga hinengaro.',
    takeAssessment: 'Tango Aromatawai',

    diaryTitle: 'Pukapuka',
    diaryDescription:
      'Whakapuakina ō whakaaro mā te reo-ki-kupu me ngā whakarāpopototanga kare-ā-roto e whakamanaia e AI.',
    startWriting: 'Tīmata Tuhi',

    historyDescription:
      'Whakakitea tō haerenga hauora hinengaro mā ngā kauwhata ātaahua me te tātaritanga ia āhua.',
    viewProgress: 'Tirohia te Ahunga',

    whyArohaTitle: 'He Aha te Kōwhiri i a Aroha?',
    privateSecureTitle: 'Tūmataiti & Haumaru',
    privateSecureDesc:
      'Ka noho tō raraunga ki a koe. Kaweakehia, whakakorerangia rānei i ngā wā katoa. He tīpakonga hono kapua me te whakamuna.',

    insightsTitle: 'Aroturuki & Kaweake',
    insightsDesc:
      'Aroturuki ia rā i tō kare-ā-roto me te kaweake i ō raraunga hei PDF, JSON rānei mō ngā pūkete haumanu o te wā kei te heke mai me ngā toronga ki ngā kaiwhakarato hauora.',
    aiPoweredTitle: 'Whāinga e Whakamanaia e AI',
    aiPoweredDesc:
      'Ngā pūkete pukapuka mā te reo-ki-kupu me te kitenga kupu kare-ā-roto me ngā whakarāpopototanga mōhio.',
    nzFocusedTitle: 'Rauemi Arotahi-NZ',
    nzFocusedDesc:
      'Ngā rauemi hauora hinengaro kua whakatauhia me te tautoko ohotata motuhake ki Aotearoa.',

    quickStartTitle: 'Tīmata i Roto i te 3 Māhere Māmā',
    quickStartSubtitle: 'Tīmatahia tō haerenga ki te hauora hinengaro pai ināianei',
    step1: 'Tangohia tō aromatawai PHQ-9 tuatahi',
    step2: 'Tuhia he pūkete pukapuka mō tō rā',
    step3: 'Aroturukihia tō ahunga i roto i te wā',
    beginJourney: 'Tīmata Tō Haerenga',
    // Browser speech / STT messages (Māori)
    startRecording: 'Tīmata Hopu',
    stopRecording: 'Kāti Hopu',
    processing: 'E tukatuka ana...',
    transcribing: 'E tuhituhi ana i tō kōrero...',
    summarizing: 'E whakarāpopoto ana i ō whakaaro...',
    aiPowered: 'Kaha AI',
    browserPowered: 'Kōrero ki te Tuhi',
    notSupported: 'Kāore e tautokohia te whakamātautau kōrero i tēnei pūtirotiro. Whakamahia Chrome, Edge rānei.',
    permissionDenied: 'Kua whakakāhoretia te whakaae mikiona',
    noSpeech: 'Kāore he kōrero i kitea',
    tryAgain: 'Whakamātau Anō',
    recordingTime: 'E hopu ana',
    requiresInternet: 'Me whai hononga ipurangi',
    aiSummary: 'Ko tēnei te whakarāpopototanga a te AI:',
    listening: 'E whakarongo ana...',
    tip: 'Tohutohu: kōrero mārama, whakaiti i ngā oro papori ātaahua.',
    error: 'Hapa',
    // Diary
    diaryPageTitle: 'Taku Pukapuka',
    diarySubtitle: 'Tuhia ō whakaaro me ō kare-ā-roto',
    diaryEntryTitle: 'Taitara Tuhinga',
    diaryTitlePlaceholder: 'Hoatu he taitara ki tō tuhinga...',
    diaryPlaceholder: 'Tuhia ō whakaaro ki konei...',
    diarySaveEntry: 'Tiaki Tuhinga',
    diarySaved: 'Kua Tiakina',
    diaryClear: 'Whakakore',
    diaryClearConfirm: 'Kei te tino hiahia koe ki te whakakore i tēnei tuhinga?',
    diaryNoEntries: 'Kāore anō kia tuhia. Tīmataria!',
    diarySelectDate: 'Kōwhiri Rā',
    diaryCharacters: 'reta',
    diaryClearSummary: 'Whakakore',
    diaryInsertSummary: 'Tāpiri ki te Tuhinga',
    diaryShowAllDiaries: 'Whakaatu Ngā Pukapuka Katoa',
    diaryRecentEntries: 'Ngā Tohu Hou',
    diaryLocalNotice: 'Kei te whakamahi koe i te pukapuka ki tō pūrere anake. Takiuru hei tiaki me te tukutahi i ō tuhinga.',
    diaryLoginCreate: 'Takiuru / Waihanga pūkete',
    diaryViewFull: 'Tirohia Katoa',
      loading: 'E uta ana...',
      backToDiary: 'Hoki ki te Diary',
      noEntry: 'Kāore he tāurunga mō tēnei rā',
      previous: 'O Mua',
      next: 'E Haere Ana',
      untitled: 'Tāurunga Kāore i Ingoatia',
      edit: 'Whakatika',
      created: 'I Hangaia',
      lastModified: 'I whakapaihia whakamutunga',
      // Settings & Cloud copy (Māori)
      languageOptionMiDesc: 'Whakaatuhia ngā ihirangi katoa i te reo Māori',
      languageApplyImmediately: 'Ka tū tōmua ngā huringa reo ki ngā whārangi katoa',

      cloudSyncDescription: 'Tiakina ngā rekoata PHQ-9 ki te kapua me te haumaru. Ka whakamunatia ō raraunga ka taea te uru mai i tētahi pūrere.',
        cloudSyncTitle: 'Tukutahi Kapua',
        cloudSyncEnableLabel: 'Whakahohe i te Tukutahi Kapua',
      cloudSyncSyncing: 'E tukutahi ana...',
      cloudSyncEnabledText: 'Kua whakahohe',
      cloudSyncEnableText: 'Whakahohe',
      cloudSyncActiveText: '✓ Kei te mahi te tukutahi kapua. Kei te tiakina aunoa ō pūkete.',
      cloudSyncLocalOnlyText: 'Kei te tiakina noa ō raraunga i te wāhi. Whakahohe i te tukutahi kapua kia uru ō pūkete mai i ētahi atu pūrere.',
      cloudSyncPrivacyNote: 'Tūmataiti: Ka whakamunaina ō raraunga i te haerenga me te okiokinga. Ka taea e koe te whakakore i te tukutahi me te muku i ngā raraunga kapua i te wā katoa mai i ngā tautuhinga Tūmataiti.',

      privacyManageData: 'Whakahaere i ō raraunga, arotake i ā mātou tikanga tūmataiti, me te whakahaere i ngā mōhiohio e tiakina ana.',
      privacyGoToSettings: 'Haere ki ngā Tautuhinga Tūmataiti',

      aboutDescription: 'Ko Aroha he taputapu tautoko hauora hinengaro i hangaia hei āwhina i ngā taiohi o Aotearoa ki te aroturuki i tō rātou oranga mā te whakamahi i te pātai aromātai pōuri PHQ-9.',
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
