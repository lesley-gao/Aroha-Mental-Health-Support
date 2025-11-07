# AI-Powered Speech-to-Text Features

## Overview

The Aroha MVP now includes **local AI-powered speech recognition and summarization** using Transformers.js. This provides:

- ✅ **100% Free** - No API costs
- ✅ **Privacy-First** - All processing happens locally in the browser
- ✅ **Offline-Capable** - Works after initial model download
- ✅ **High Accuracy** - Uses OpenAI's Whisper model
- ✅ **AI Summarization** - Automatically summarizes diary entries

## Features

### 1. Speech-to-Text Transcription
- Uses OpenAI's Whisper tiny model (~40MB)
- Accurate speech recognition in English
- Processes audio locally - no data sent to servers

### 2. AI Summarization
- Uses DistilBART model (~150MB)
- Automatically summarizes long diary entries
- Extracts key points and emotional content

### 3. Emotional Keyword Detection
- Identifies emotional words in transcriptions
- Tracks mood patterns over time
- Helps users understand their mental health journey

## How It Works

### For Users:

1. **Click "Start Recording"** in the Diary page
2. **Speak your thoughts** (the AI listens and records)
3. **Click "Stop Recording"** when done
4. **AI processes** your speech:
   - Transcribes what you said
   - Creates a summary of your thoughts
   - Detects emotional keywords
5. **Text appears** in your diary entry automatically

### Technical Flow:

```
User speaks → Audio Recording → Whisper (transcription) → DistilBART (summarization) → Diary Entry
```

## Model Details

### Whisper Tiny (Speech-to-Text)
- **Size**: ~40MB (quantized)
- **Language**: English
- **Speed**: Fast, suitable for real-time use
- **Accuracy**: Good for clear speech
- **Upgrade Option**: Can switch to `Xenova/whisper-small` for better accuracy

### DistilBART (Summarization)
- **Size**: ~150MB (quantized)
- **Model**: `Xenova/distilbart-cnn-6-6`
- **Purpose**: Condense long text into key points
- **Speed**: Fast on modern devices

## Installation & Setup

### Already Installed ✅
The necessary package is already added:
```bash
npm install @xenova/transformers
```

### First-Time Usage

**Important**: On first use, the models will be downloaded (~200MB total). This happens automatically and models are cached for future use.

**Expected First Load Times**:
- Whisper Model: 5-10 seconds
- Summarization Model: 10-15 seconds
- Subsequent loads: Instant (cached)

### Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari 16+
- ❌ Internet Explorer (not supported)

## Privacy & Security

### Data Privacy
- **All processing happens locally** in your browser
- **No audio is uploaded** to any server
- **No API calls** to external services
- **Models are cached** on your device

### Storage
- Models: ~200MB cached in browser
- Can be cleared via browser cache settings
- Automatically managed by browser

## Performance

### Recommended Device Specs
- **RAM**: 4GB minimum, 8GB recommended
- **Internet**: Required only for first-time model download
- **Storage**: 200MB free space for model cache

### Processing Times (on modern devices)
- 1 minute of audio: ~5-10 seconds to transcribe
- Summarization: 2-5 seconds
- Total: ~7-15 seconds for complete processing

## Usage Tips

### For Best Results:
1. **Speak clearly** and at normal pace
2. **Reduce background noise** when possible
3. **Keep recordings under 5 minutes** for optimal performance
4. **Wait for processing** - don't interrupt AI analysis

### Common Issues:

**Problem**: "Microphone permission denied"
- **Solution**: Allow microphone access in browser settings

**Problem**: "No speech detected"
- **Solution**: Speak louder or check microphone is working

**Problem**: Models loading slowly
- **Solution**: First-time download requires good internet; subsequent uses are instant

## Development

### Files Structure
```
src/
├── utils/
│   └── aiSpeech.ts           # AI processing logic
├── components/
│   └── speech/
│       └── AISpeechToText.tsx # UI component
└── pages/
    └── Diary.tsx              # Integration
```

### Key Functions

**`transcribeAudio(blob)`**
- Converts audio to text using Whisper

**`summarizeText(text)`**
- Summarizes long text to key points

**`processAudioDiary(blob)`**
- Complete workflow: record → transcribe → summarize

**`preloadModels()`**
- Loads models in background on app start

### Customization

#### Use Better Accuracy (Larger Model):
```typescript
// In src/utils/aiSpeech.ts, change:
'Xenova/whisper-tiny.en' → 'Xenova/whisper-small'
// Trade-off: Better accuracy, larger download (~250MB)
```

#### Adjust Summary Length:
```typescript
// In summarizeText(), modify:
max_length: 150  // Increase for longer summaries
min_length: 30   // Decrease for shorter summaries
```

## Future Enhancements

Potential improvements:
- [ ] Multilingual support (Te Reo Māori)
- [ ] Sentiment analysis
- [ ] Voice-activated PHQ-9 responses
- [ ] Mood tracking from voice tone
- [ ] Export audio with transcripts

## Troubleshooting

### Clear Cache
If experiencing issues:
```javascript
// Open browser console and run:
caches.keys().then(keys => keys.forEach(key => caches.delete(key)))
```

### Check Browser Support
```javascript
// Test if WebAssembly is supported:
console.log(typeof WebAssembly === 'object')
```

## Cost Comparison

| Solution | First Use | Ongoing | Data Privacy |
|----------|-----------|---------|--------------|
| **Local AI (Current)** | Free | Free | 100% Private |
| OpenAI Whisper API | $0.006/min | $0.006/min | Cloud |
| Azure Speech | Free tier | $1/hour | Cloud |
| Google Speech | Free tier | $0.006/15s | Cloud |

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify microphone permissions
3. Ensure browser supports WebAssembly
4. Clear browser cache and retry

---

**Built with ❤️ using Transformers.js**

Powered by:
- [Transformers.js](https://huggingface.co/docs/transformers.js)
- [OpenAI Whisper](https://github.com/openai/whisper)
- [Facebook DistilBART](https://huggingface.co/facebook/bart-large-cnn)
