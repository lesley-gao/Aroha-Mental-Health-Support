/**
 * Browser Speech-to-Text Component (Web Speech API)
 * Fallback when Transformers.js can't load
 * Works immediately, no downloads needed
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Wifi } from 'lucide-react';
import { 
  createSpeechRecognition, 
  isSpeechRecognitionSupported,
  extractEmotionalKeywords,
  generateSimpleSummary
} from '@/utils/browserSpeech';
import type { Locale } from '@/i18n/messages';

interface BrowserSpeechToTextProps {
  onTranscript: (text: string) => void;
  onSummary?: (summary: string) => void;
  locale?: Locale;
  showSummary?: boolean;
}

export function BrowserSpeechToText({ 
  onTranscript, 
  onSummary,
  locale = 'en',
  showSummary = true 
}: BrowserSpeechToTextProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const recognitionRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const durationIntervalRef = useRef<number | null>(null);

  const translations = {
    en: {
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
      browserPowered: 'Browser Speech API',
      error: 'Error',
      notSupported: 'Speech recognition not supported in this browser. Please use Chrome or Edge.',
      permissionDenied: 'Microphone permission denied',
      noSpeech: 'No speech detected',
      tryAgain: 'Try Again',
      recordingTime: 'Recording',
      requiresInternet: 'Please make sure you are connected to the internet'
    },
    mi: {
      startRecording: 'Tīmata Hopu',
      stopRecording: 'Kāti Hopu',
      browserPowered: 'API Kōrero Pūtirotiro',
      error: 'Hapa',
      notSupported: 'Kāore e tautokohia te whakamātautau kōrero i tēnei pūtirotiro. Whakamahia Chrome, Edge rānei.',
      permissionDenied: 'Kua whakakāhoretia te whakaae mikiona',
      noSpeech: 'Kāore he kōrero i kitea',
      tryAgain: 'Whakamātau Anō',
      recordingTime: 'E hopu ana',
      requiresInternet: 'Me whai hononga ipurangi'
    }
  };

  const t = translations[locale];

  useEffect(() => {
    // Initialize speech recognition
    if (!isSpeechRecognitionSupported()) {
      setError(t.notSupported);
      return;
    }

    try {
      const recognition = createSpeechRecognition({
        language: locale === 'mi' ? 'mi-NZ' : 'en-US',
        continuous: true,
        onResult: (transcript, isFinal) => {
          setCurrentTranscript(transcript);
          if (isFinal) {
            console.log('✅ Final transcript:', transcript);
          }
        },
        onError: (errorMsg) => {
          console.error('❌ Speech error:', errorMsg);
          setError(errorMsg);
          setIsRecording(false);
        },
        onEnd: () => {
          console.log('🎤 Speech recognition ended');
          if (isRecording) {
            // Only finalize if we have a transcript
            if (currentTranscript.trim().length > 0) {
              finalizeTranscript();
            }
          }
          setIsRecording(false);
        }
      });

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      setError(t.notSupported);
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [locale]);

  const startRecording = () => {
    if (!recognitionRef.current) {
      setError(t.notSupported);
      return;
    }

    try {
      setError(null);
      setCurrentTranscript('');
      setRecordingDuration(0);

      recognitionRef.current.start();
      setIsRecording(true);

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Recording error:', err);
      setError(t.permissionDenied);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      if (currentTranscript.trim().length > 0) {
        finalizeTranscript();
      } else {
        setError(t.noSpeech);
      }
    }
  };

  const finalizeTranscript = () => {
    const transcript = currentTranscript.trim();
    
    if (!transcript) {
      setError(t.noSpeech);
      return;
    }

    console.log('✅ Finalizing transcript:', transcript);

    // Extract emotional keywords
    const emotions = extractEmotionalKeywords(transcript);
    if (emotions.length > 0) {
      console.log('💭 Detected emotions:', emotions.join(', '));
    }

    // Generate simple summary
    if (showSummary && onSummary) {
      const summary = generateSimpleSummary(transcript);
      console.log('📝 Summary:', summary);
      onSummary(summary);
    }

    // Send transcript to parent
    onTranscript(transcript);
    
    // Clear error on success
    setError(null);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant={isRecording ? 'destructive' : 'default'}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!isSpeechRecognitionSupported()}
          className="flex items-center gap-2"
        >
          {isRecording ? (
            <>
              <MicOff className="w-4 h-4" />
              {t.stopRecording}
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              {t.startRecording}
            </>
          )}
        </Button>

        {/* Browser API Badge */}
        <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
          <Wifi className="w-3 h-3" />
          {t.browserPowered}
        </div>

        {/* Recording Duration */}
        {isRecording && (
          <div className="flex items-center gap-2 text-sm text-red-600 animate-pulse">
            <div className="w-2 h-2 bg-red-600 rounded-full" />
            {t.recordingTime}: {formatDuration(recordingDuration)}
          </div>
        )}
      </div>

      {/* Live Transcript Preview */}
      {isRecording && currentTranscript && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs text-blue-600 font-medium mb-1">Live Transcript:</div>
          <div className="text-sm text-blue-900">{currentTranscript}</div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-red-700">
              <div className="font-medium">{t.error}</div>
              <div>{error}</div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setError(null)}
            >
              {t.tryAgain}
            </Button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        {locale === 'en' 
          ? 'Using browser speech recognition. Please make sure you are connected to the internet.'
          : 'Mā te whakamātautau kōrero pūtirotiro. Me whai hononga ipurangi.'}
      </div>
    </div>
  );
}
