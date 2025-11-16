/**
 * AI-Powered Speech-to-Text Component
 * Uses Transformers.js for local speech recognition and summarization
 */

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, Sparkles } from 'lucide-react';
import { processAudioDiary, extractEmotionalKeywords } from '@/utils/aiSpeech';
import type { Locale } from '@/i18n/messages';
import useTranslation from '@/i18n/useTranslation';

interface AISpeechToTextProps {
  onTranscript: (text: string) => void;
  onSummary?: (summary: string) => void;
  locale?: Locale;
  showSummary?: boolean;
}

export function AISpeechToText({ 
  onTranscript, 
  onSummary,
  locale = 'en',
  showSummary = true 
}: AISpeechToTextProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<number | null>(null);
  const { t, locale: providerLocale } = useTranslation();
  const activeLocale = locale ?? providerLocale;
  console.debug('AISpeechToText activeLocale:', activeLocale);

  const startRecording = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];
      setRecordingDuration(0);

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1, // Mono audio
          sampleRate: 16000, // Whisper expects 16kHz
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      
      // Use the best available audio format
      const options: MediaRecorderOptions = {};
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options.mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        options.mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        options.mimeType = 'audio/ogg;codecs=opus';
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      console.log('🎤 Recording with:', options.mimeType || 'default format');

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Clear duration interval
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }

        // Process the recording
        await processRecording();
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Recording error:', err);
      setError(String(t('permissionDenied')));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processRecording = async () => {
    setIsProcessing(true);
    
    try {
      // Create audio blob
      const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
      
      if (audioBlob.size === 0) {
        throw new Error(String(t('noSpeech')));
      }

      console.log('🎤 Audio recorded:', audioBlob.size, 'bytes, type:', mimeType);

      // Process with AI
      const result = await processAudioDiary(audioBlob);
      
      if (!result.transcription || result.transcription.trim().length === 0) {
        throw new Error(String(t('noSpeech')));
      }
      
      console.log('✅ Transcription:', result.transcription);
      console.log('📝 Summary:', result.summary);

      // Extract emotional keywords
      const emotions = extractEmotionalKeywords(result.transcription);
      if (emotions.length > 0) {
        console.log('💭 Detected emotions:', emotions.join(', '));
      }

      // Send results to parent
      if (showSummary && onSummary) {
        onSummary(result.summary);
      }
      onTranscript(result.transcription);
      
      // Clear error on success
      setError(null);

    } catch (err) {
      console.error('Processing error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process audio';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
      audioChunksRef.current = [];
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
          disabled={isProcessing}
          className="flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {String(t('processing'))}
            </>
          ) : isRecording ? (
            <>
              <MicOff className="w-4 h-4" />
              {String(t('stopRecording'))}
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              {String(t('startRecording'))}
            </>
          )}
        </Button>

        {/* AI Badge */}
        <div className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
          <Sparkles className="w-3 h-3" />
          {String(t('aiPowered'))}
        </div>

        {/* Recording Duration */}
        {isRecording && (
          <div className="flex items-center gap-2  text-red-600 animate-pulse">
            <div className="w-2 h-2 bg-red-600 rounded-full" />
            {String(t('recordingTime'))}: {formatDuration(recordingDuration)}
          </div>
        )}
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2  text-blue-700">
            <Loader2 className="w-4 h-4 animate-spin" />
            <div>
              <div className="font-medium">{String(t('transcribing'))}</div>
              {showSummary && (
                <div className="text-xs text-blue-600 mt-1">{String(t('summarizing'))}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div className=" text-red-700">
              <div className="font-medium">{String(t('error'))}</div>
              <div>{error}</div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setError(null)}
            >
              {String(t('tryAgain'))}
            </Button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500">{String(t('aiHelpText'))}</div>
    </div>
  );
}
