/**
 * SpeechToText Component
 * Browser-based speech recognition for diary entries
 */

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import type { Locale } from '@/i18n/messages';

interface SpeechToTextProps {
  onTranscript: (text: string) => void;
  locale: Locale;
  className?: string;
}

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

export function SpeechToText({ onTranscript, locale, className = '' }: SpeechToTextProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const t = getTranslations(locale);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      // Initialize recognition
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = locale === 'mi' ? 'mi-NZ' : 'en-NZ';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }

        if (finalTranscript) {
          onTranscript(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setError(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError('not-supported');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [locale, onTranscript]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setError(null);
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start recognition:', err);
        setError('failed-to-start');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isSupported) {
    return (
      <div className={`flex items-center gap-2 text-sm text-gray-500 ${className}`}>
        <Volume2 className="h-4 w-4" />
        <span>{t.notSupported}</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={isListening ? stopListening : startListening}
          variant={isListening ? 'destructive' : 'outline'}
          size="sm"
          className="gap-2"
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4 animate-pulse" />
              {t.stopRecording}
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              {t.startRecording}
            </>
          )}
        </Button>
        
        {isListening && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex gap-1">
              <span className="w-1 h-4 bg-red-500 rounded animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-4 bg-red-500 rounded animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-4 bg-red-500 rounded animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
            <span>{t.listening}</span>
          </div>
        )}
      </div>

      {error && error !== 'not-supported' && (
        <div className="text-xs text-red-600">
          {getErrorMessage(error, locale)}
        </div>
      )}

      {isListening && (
        <div className="text-xs text-gray-500 italic">
          {t.tip}
        </div>
      )}
    </div>
  );
}

function getErrorMessage(error: string, locale: Locale): string {
  const messages: Record<string, Record<string, string>> = {
    en: {
      'no-speech': 'No speech detected. Please try again.',
      'audio-capture': 'No microphone found. Please check your device.',
      'not-allowed': 'Microphone access denied. Please allow microphone access.',
      'network': 'Network error. Please check your connection.',
      'failed-to-start': 'Failed to start recording. Please try again.',
      default: 'An error occurred. Please try again.',
    },
    mi: {
      'no-speech': 'Kāore i kitea he kōrero. Tēnā whakamātau anō.',
      'audio-capture': 'Kāore i kitea he hopuoro. Tēnā tirohia tō taputapu.',
      'not-allowed': 'Kua whakakāhoretia te urunga hopuoro. Tēnā whakaaetia.',
      'network': 'He hapa whatunga. Tēnā tirohia tō hononga.',
      'failed-to-start': 'I rahua te tīmata hopu. Tēnā whakamātau anō.',
      default: 'I puta he hapa. Tēnā whakamātau anō.',
    },
  };

  return messages[locale]?.[error] || messages[locale]?.default || messages.en.default;
}

function getTranslations(locale: Locale) {
  interface Translations {
    startRecording: string;
    stopRecording: string;
    listening: string;
    notSupported: string;
    tip: string;
  }

  const translations: Record<string, Translations> = {
    en: {
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
      listening: 'Listening...',
      notSupported: 'Speech recognition not supported in this browser',
      tip: 'Speak clearly into your microphone. Your speech will be automatically transcribed.',
    },
    mi: {
      startRecording: 'Tīmata Hopu',
      stopRecording: 'Mutu Hopu',
      listening: 'E whakarongo ana...',
      notSupported: 'Kāore e tautokona te mōhiotanga kōrero i tēnei pūtirotiro',
      tip: 'Kōrero mārama ki tō hopuoro. Ka tuhia aunoa tō kōrero.',
    },
  };

  return translations[locale] || translations.en;
}
