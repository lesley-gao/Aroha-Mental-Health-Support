/**
 * Browser Speech-to-Text Component (Web Speech API)
 * Fallback when Transformers.js can't load
 * Works immediately, no downloads needed
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Wifi } from 'lucide-react';
import { 
  createSpeechRecognition, 
  isSpeechRecognitionSupported,
  extractEmotionalKeywords,
  generateSimpleSummary
} from '@/utils/browserSpeech';
import type { Messages } from '@/i18n/messages';
import { getMessages } from '@/i18n/messages';
import useTranslation from '@/i18n/useTranslation';

interface BrowserSpeechToTextProps {
  onTranscript: (text: string) => void;
  onSummary?: (summary: string) => void;
  showSummary?: boolean;
}

export function BrowserSpeechToText({ 
  onTranscript, 
  onSummary,
  showSummary = true 
}: BrowserSpeechToTextProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [wasRecordingStopped, setWasRecordingStopped] = useState(false);
  
  const recognitionRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const durationIntervalRef = useRef<number | null>(null);
  const currentTranscriptRef = useRef('');
  const isRecordingRef = useRef(false);

  // use provider translations (provider is mounted at app root)
  const { locale: providerLocale } = useTranslation();

  const effectiveLocale = providerLocale ?? 'en';
  const msgs = getMessages(effectiveLocale);
  const tr = useCallback(
    (key: keyof Messages) => (msgs as unknown as Record<string, string>)[key] ?? String(key),
    [msgs]
  );

  // Update refs when state changes
  useEffect(() => {
    currentTranscriptRef.current = currentTranscript;
  }, [currentTranscript]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const finalizeTranscript = useCallback(() => {
    const transcript = currentTranscriptRef.current.trim();
    
    if (!transcript) {
      setError(tr('noSpeech'));
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
  }, [onTranscript, onSummary, showSummary, tr]);

  useEffect(() => {
    // Initialize speech recognition
    if (!isSpeechRecognitionSupported()) {
      setError(tr('notSupported'));
      return;
    }

    try {
      const recognition = createSpeechRecognition({
        language: providerLocale === 'mi' ? 'mi-NZ' : providerLocale === 'zh' ? 'zh-CN' : 'en-US',
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
          if (isRecordingRef.current) {
            // Only finalize if we have a transcript
            if (currentTranscriptRef.current.trim().length > 0) {
              finalizeTranscript();
            }
          }
          setIsRecording(false);
        }
      });

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      setError(tr('notSupported'));
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [providerLocale, tr, finalizeTranscript]);

  const startRecording = () => {
    if (!recognitionRef.current) {
      setError(tr('notSupported'));
      return;
    }

    try {
      setError(null);
      setCurrentTranscript('');
      setRecordingDuration(0);
      setWasRecordingStopped(false);

      recognitionRef.current.start();
      setIsRecording(true);

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Recording error:', err);
      setError(tr('permissionDenied'));
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setWasRecordingStopped(true);
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      if (currentTranscript.trim().length > 0) {
        finalizeTranscript();
      } else {
        setError(tr('noSpeech'));
      }
    }
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
              {tr('stopRecording')}
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              {tr('startRecording')}
            </>
          )}
        </Button>

        {/* Browser API Badge */}
        <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
          <Wifi className="w-3 h-3" />
          {tr('browserPowered')}
        </div>

        {/* Recording Duration */}
        {isRecording && (
          <div className="flex items-center gap-2   text-red-600 animate-pulse">
            <div className="w-2 h-2 bg-red-600 rounded-full" />
            {tr('recordingTime')}: {formatDuration(recordingDuration)}
          </div>
        )}
      </div>

      {/* Live Transcript Preview */}
      {isRecording && currentTranscript && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs text-blue-600 font-medium mb-1">Live Transcript:</div>
          <div className="  text-blue-900">{currentTranscript}</div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div className="  text-red-700">
              <div className="font-medium">{tr('error')}</div>
              <div>{error}</div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setError(null)}
            >
              {tr('tryAgain')}
            </Button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className=" text-gray-500">
        {wasRecordingStopped && currentTranscript.trim().length > 0
          ? tr('aiSummary')
          : tr('requiresInternet')}
      </div>
    </div>
  );
}
