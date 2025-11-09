/**
 * Browser Speech Recognition (Web Speech API)
 * Fallback solution when Transformers.js models can't load
 * Works immediately, no downloads needed
 */

export interface SpeechRecognitionResult {
  transcription: string;
  timestamp: string;
  confidence?: number;
}

/**
 * Check if browser supports Web Speech API
 */
export function isSpeechRecognitionSupported(): boolean {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

/**
 * Transcribe audio using browser's built-in speech recognition
 * @param _audioBlob - Audio blob from recording (unused - Web Speech API doesn't support blob processing)
 * @returns Transcribed text
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function transcribeWithBrowserAPI(_audioBlob: Blob): Promise<string> {
  // For now, we use live recognition during recording instead of blob processing
  // This is a limitation of Web Speech API
  throw new Error('Please use BrowserSpeechRecognition component for live transcription');
}

// Types for Web Speech API
interface SpeechRecognitionWindow extends Window {
  webkitSpeechRecognition?: new () => SpeechRecognition;
  SpeechRecognition?: new () => SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

/**
 * Create a speech recognition instance
 */
export function createSpeechRecognition(options: {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
  language?: string;
  continuous?: boolean;
}): { start: () => void; stop: () => void } {
  const SpeechRecognition = (window as SpeechRecognitionWindow).webkitSpeechRecognition || (window as SpeechRecognitionWindow).SpeechRecognition;
  
  if (!SpeechRecognition) {
    throw new Error('Speech recognition not supported in this browser');
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = options.continuous ?? true;
  recognition.interimResults = true;
  recognition.lang = options.language || 'en-US';
  recognition.maxAlternatives = 1;

  let finalTranscript = '';
  let interimTranscript = '';

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
        options.onResult(finalTranscript, true);
      } else {
        interimTranscript += transcript;
        options.onResult(finalTranscript + interimTranscript, false);
      }
    }
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error('Speech recognition error:', event.error);
    
    const errorMessages: Record<string, string> = {
      'no-speech': 'No speech detected. Please try speaking again.',
      'audio-capture': 'Microphone not accessible. Please check permissions.',
      'not-allowed': 'Microphone permission denied.',
      'network': 'Network error. Please check your internet connection.',
      'aborted': 'Speech recognition was aborted.',
    };
    
    options.onError(errorMessages[event.error] || `Speech recognition error: ${event.error}`);
  };

  recognition.onend = () => {
    options.onEnd();
  };

  return {
    start: () => {
      finalTranscript = '';
      interimTranscript = '';
      recognition.start();
    },
    stop: () => {
      recognition.stop();
    }
  };
}

/**
 * Extract emotional keywords from text
 * Enhanced with more emotions and sentiment patterns
 */
export function extractEmotionalKeywords(text: string): string[] {
  const keywords: string[] = [];
  
  const emotionPatterns = {
    // Positive emotions
    positive: ['happy', 'joy', 'joyful', 'excited', 'grateful', 'thankful', 'blessed', 
               'pleased', 'delighted', 'content', 'satisfied', 'proud', 'hopeful', 
               'optimistic', 'confident', 'relaxed', 'calm', 'peaceful', 'cheerful',
               'good', 'great', 'wonderful', 'amazing', 'fantastic', 'awesome', 'lovely',
               'nice', 'fine', 'glad', 'love', 'enjoy', 'enjoying'],
    
    // Negative emotions
    negative: ['sad', 'unhappy', 'depressed', 'down', 'upset', 'hurt', 'disappointed',
               'heartbroken', 'lonely', 'isolated', 'helpless', 'hopeless', 'worthless',
               'bad', 'terrible', 'awful', 'horrible', 'miserable', 'worst'],
    
    // Anxiety/Stress
    anxious: ['anxious', 'worried', 'stressed', 'nervous', 'tense', 'afraid', 'scared',
              'frightened', 'panicked', 'overwhelmed', 'pressure', 'burden', 'concern',
              'concerned', 'uneasy'],
    
    // Anger/Frustration
    angry: ['angry', 'mad', 'frustrated', 'annoyed', 'irritated', 'furious', 'rage',
            'bitter', 'resentful', 'hostile', 'hate', 'dislike'],
    
    // Fatigue/Energy
    energy: ['tired', 'exhausted', 'drained', 'weary', 'fatigued', 'energetic', 
             'motivated', 'inspired', 'determined', 'driven', 'refreshed', 'energized',
             'sleepy', 'restless'],
    
    // Confusion/Clarity
    mental: ['confused', 'lost', 'unclear', 'foggy', 'clear', 'focused', 'sharp',
             'mindful', 'present', 'certain', 'sure', 'understand']
  };
  
  const lowerText = text.toLowerCase();
  
  // Check each emotion category
  Object.values(emotionPatterns).forEach((words) => {
    words.forEach(word => {
      // Use word boundary to avoid partial matches
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(lowerText)) {
        keywords.push(word);
      }
    });
  });
  
  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Generate an intelligent summary of the text
 * Uses rule-based approach with keyword extraction and sentence scoring
 */
export function generateSimpleSummary(text: string): string {
  if (text.length < 100) {
    return text;
  }

  // First, try to split by punctuation
  let sentences: string[] | null = text.match(/[^.!?]+[.!?]+/g);
  
  // If no punctuation, split by common patterns (and, but, so, because, etc.)
  if (!sentences || sentences.length <= 1) {
    // Split by common conjunctions while keeping them
    const splits = text.split(/\b(and|but|so|because|however|although|though|while)\b/gi);
    const tempSentences: string[] = [];
    for (let i = 0; i < splits.length; i += 2) {
      if (splits[i].trim()) {
        const conjunction = splits[i + 1] || '';
        tempSentences.push((splits[i] + ' ' + conjunction).trim());
      }
    }
    sentences = tempSentences.length > 0 ? tempSentences : null;
  }
  
  // If still only one sentence, create a shorter version
  if (!sentences || sentences.length <= 1) {
    const words = text.split(' ');
    if (words.length <= 30) {
      return text;
    }
    
    // Extract key phrases with emotional words
    const emotions = extractEmotionalKeywords(text);
    if (emotions.length > 0) {
      return `Key points: ${text.substring(0, 150)}...\n\n💭 Emotions detected: ${emotions.join(', ')}`;
    }
    
    // Just return first 150 characters
    return text.substring(0, 150) + '...';
  }
  
  if (sentences.length <= 2) {
    return text;
  }

  // Extract emotional keywords
  const emotions = extractEmotionalKeywords(text);
  
  // Score sentences based on important keywords
  const importantWords = [
    ...emotions,
    'feel', 'feeling', 'felt', 'think', 'thought', 'believe',
    'want', 'need', 'help', 'important', 'problem', 'issue',
    'today', 'yesterday', 'tomorrow', 'because', 'however',
    'family', 'work', 'friends', 'life', 'really', 'very'
  ];

  const scoredSentences = sentences.map((sentence, index) => {
    let score = 0;
    const lowerSentence = sentence.toLowerCase();
    
    // Boost first and last sentences
    if (index === 0) score += 3;
    if (index === sentences.length - 1) score += 2;
    
    // Score based on important words
    importantWords.forEach(word => {
      if (lowerSentence.includes(word)) score += 1;
    });
    
    // Boost sentences with emotional content
    emotions.forEach(emotion => {
      if (lowerSentence.includes(emotion)) score += 2;
    });
    
    return { sentence: sentence.trim(), score, index };
  });

  // Calculate how many sentences to keep (30-50% of original)
  const targetCount = Math.max(2, Math.min(3, Math.ceil(sentences.length * 0.4)));

  // Sort by score and take top sentences
  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, targetCount)
    .sort((a, b) => a.index - b.index); // Maintain original order

  // Build summary
  let summary = topSentences.map(s => s.sentence).join(' ');
  
  // Add emotional context if detected
  if (emotions.length > 0) {
    summary += `\n\n💭 Emotions: ${emotions.join(', ')}`;
  }
  
  return summary;
}
