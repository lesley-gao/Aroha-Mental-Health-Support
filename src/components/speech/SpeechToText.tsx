/**
 * SpeechToText Component
 * Browser-based speech recognition for diary entries
 */

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import type { Locale } from '@/i18n/messages';
import useTranslation from '@/i18n/useTranslation';
import { getMessages } from '@/i18n/messages';

interface SpeechToTextProps {
  onTranscript: (text: string) => void;
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

export function SpeechToText({ onTranscript, className = '' }: SpeechToTextProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const { t, locale } = useTranslation();

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      // Initialize recognition
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = locale === 'mi' ? 'mi-NZ' : locale === 'zh' ? 'zh-CN' : 'en-NZ';

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
        <div className={`flex items-center gap-2  text-gray-500 ${className}`}>
        <Volume2 className="h-4 w-4" />
        <span>{t('notSupported')}</span>
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
              {t('stopRecording')}
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              {t('startRecording')}
            </>
          )}
        </Button>
        
        {isListening && (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="flex gap-1">
              <span className="w-1 h-4 bg-red-500 rounded animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-4 bg-red-500 rounded animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-4 bg-red-500 rounded animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
            <span>{t('listening')}</span>
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
          {t('tip')}
        </div>
      )}
    </div>
  );
}

function getErrorMessage(error: string, locale: Locale): string {
  const msgs = getMessages(locale);

  const map: Record<string, string> = {
    'no-speech': msgs.noSpeech || msgs.tryAgain,
    'audio-capture': msgs.permissionDenied || msgs.tryAgain,
    'not-allowed': msgs.permissionDenied || msgs.tryAgain,
    'permission-denied': msgs.permissionDenied || msgs.tryAgain,
    'network': msgs.tryAgain || msgs.error || 'Network error',
    'failed-to-start': msgs.tryAgain || msgs.error,
  };

  return map[error] || msgs.error || msgs.tryAgain || 'An error occurred.';
}
