/**
 * AI-powered Speech-to-Text and Summarization
 * Uses Transformers.js for local inference (privacy-first, no API costs)
 */

import { pipeline, env } from '@xenova/transformers';

// Configure Transformers.js environment
env.allowLocalModels = false;
env.allowRemoteModels = true;
env.backends.onnx.wasm.numThreads = 1;

// Singleton instances for performance
let transcriber: any = null;
let summarizer: any = null;

/**
 * Initialize the speech-to-text model (Whisper)
 * Downloads model on first use (~40MB, cached after first load)
 */
async function getTranscriber() {
  if (!transcriber) {
    console.log('🎤 Loading Whisper model for speech-to-text...');
    try {
      transcriber = await pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-tiny.en',
        { 
          quantized: true,
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`📥 Downloading: ${progress.file} - ${Math.round((progress.loaded / progress.total) * 100)}%`);
            } else if (progress.status === 'done') {
              console.log(`✅ Downloaded: ${progress.file}`);
            }
          }
        }
      );
      console.log('✅ Whisper model loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load Whisper model:', error);
      throw new Error('Failed to load speech recognition model. Please check your internet connection and try again.');
    }
  }
  return transcriber;
}

/**
 * Initialize the summarization model
 * Downloads model on first use (~150MB for DistilBART)
 */
async function getSummarizer() {
  if (!summarizer) {
    console.log('📝 Loading summarization model...');
    try {
      summarizer = await pipeline(
        'summarization',
        'Xenova/distilbart-cnn-6-6',
        {
          quantized: true,
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`📥 Downloading: ${progress.file} - ${Math.round((progress.loaded / progress.total) * 100)}%`);
            }
          }
        }
      );
      console.log('✅ Summarization model loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load summarization model:', error);
      throw new Error('Failed to load summarization model. Please check your internet connection.');
    }
  }
  return summarizer;
}

/**
 * Convert audio blob to the format expected by Whisper
 * @param audioBlob - Audio blob from recording
 * @returns Audio data ready for Whisper
 */
async function prepareAudioForWhisper(audioBlob: Blob): Promise<Float32Array> {
  return new Promise((resolve, reject) => {
    const audioContext = new AudioContext({ sampleRate: 16000 });
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      try {
        const arrayBuffer = fileReader.result as ArrayBuffer;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Get audio data as Float32Array (mono, 16kHz)
        let audioData = audioBuffer.getChannelData(0);
        
        // Resample to 16kHz if needed
        if (audioBuffer.sampleRate !== 16000) {
          console.log(`🔄 Resampling from ${audioBuffer.sampleRate}Hz to 16000Hz`);
          const ratio = audioBuffer.sampleRate / 16000;
          const newLength = Math.floor(audioData.length / ratio);
          const resampled = new Float32Array(newLength);
          
          for (let i = 0; i < newLength; i++) {
            const srcIndex = Math.floor(i * ratio);
            resampled[i] = audioData[srcIndex];
          }
          audioData = resampled;
        }
        
        resolve(audioData);
      } catch (err) {
        console.error('❌ Audio decoding error:', err);
        reject(new Error('Failed to decode audio. Please ensure your microphone is working.'));
      }
    };

    fileReader.onerror = () => {
      reject(new Error('Failed to read audio file'));
    };

    fileReader.readAsArrayBuffer(audioBlob);
  });
}

/**
 * Transcribe audio to text using Whisper
 * @param audioBlob - Audio blob from recording
 * @returns Transcribed text
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    console.log('🎤 Preparing audio for transcription...');
    const model = await getTranscriber();
    
    // Convert and prepare audio
    const audioData = await prepareAudioForWhisper(audioBlob);
    
    console.log(`🎤 Audio prepared: ${audioData.length} samples at 16kHz`);
    
    // Transcribe
    console.log('🎤 Running Whisper model...');
    const result = await model(audioData);
    
    console.log('✅ Transcription result:', result);
    
    return result.text || '';
  } catch (error) {
    console.error('❌ Transcription error:', error);
    throw new Error('Failed to transcribe audio. Please try again.');
  }
}

/**
 * Summarize text and extract key emotional insights
 * @param text - Full transcribed text
 * @returns Summarized text with key points
 */
export async function summarizeText(text: string): Promise<{
  summary: string;
  originalLength: number;
  summaryLength: number;
}> {
  try {
    if (text.length < 100) {
      // Too short to summarize, return as-is
      return {
        summary: text,
        originalLength: text.length,
        summaryLength: text.length
      };
    }

    const model = await getSummarizer();
    
    // Summarize with constraints
    const result = await model(text, {
      max_length: 150,
      min_length: 30,
      do_sample: false
    });
    
    return {
      summary: result[0].summary_text || text,
      originalLength: text.length,
      summaryLength: result[0].summary_text?.length || text.length
    };
  } catch (error) {
    console.error('❌ Summarization error:', error);
    // Return original text if summarization fails
    return {
      summary: text,
      originalLength: text.length,
      summaryLength: text.length
    };
  }
}

/**
 * Complete workflow: Record → Transcribe → Summarize
 * @param audioBlob - Audio recording
 * @returns Object with transcription and summary
 */
export async function processAudioDiary(audioBlob: Blob): Promise<{
  transcription: string;
  summary: string;
  timestamp: string;
}> {
  try {
    // Step 1: Transcribe audio to text
    console.log('🎤 Transcribing audio...');
    const transcription = await transcribeAudio(audioBlob);
    
    if (!transcription || transcription.trim().length === 0) {
      throw new Error('No speech detected in the audio. Please try speaking again.');
    }
    
    // Step 2: Summarize the transcription
    console.log('📝 Summarizing transcription...');
    const { summary } = await summarizeText(transcription);
    
    return {
      transcription,
      summary,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Audio processing error:', error);
    throw error;
  }
}

/**
 * Preload models in the background for better UX
 * Call this when the app loads
 */
export async function preloadModels(): Promise<void> {
  try {
    console.log('🔄 Preloading AI models...');
    await Promise.all([
      getTranscriber(),
      getSummarizer()
    ]);
    console.log('✅ All AI models loaded and ready');
  } catch (error) {
    console.warn('⚠️ Failed to preload models:', error);
    // Non-critical, models will load on first use
  }
}

/**
 * Extract emotional keywords from text
 * Simple keyword-based approach for now
 */
export function extractEmotionalKeywords(text: string): string[] {
  const keywords: string[] = [];
  const emotionWords = [
    'happy', 'sad', 'anxious', 'worried', 'stressed', 'calm', 'peaceful',
    'angry', 'frustrated', 'depressed', 'hopeful', 'grateful', 'lonely',
    'overwhelmed', 'tired', 'energetic', 'motivated', 'confused', 'clear',
    'scared', 'confident', 'hopeless', 'optimistic'
  ];
  
  const lowerText = text.toLowerCase();
  emotionWords.forEach(word => {
    if (lowerText.includes(word)) {
      keywords.push(word);
    }
  });
  
  return [...new Set(keywords)]; // Remove duplicates
}
