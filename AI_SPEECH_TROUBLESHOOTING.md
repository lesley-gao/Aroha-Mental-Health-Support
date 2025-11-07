# AI Speech-to-Text Troubleshooting Guide

## Quick Diagnosis

### Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for error messages starting with ❌

### Common Error Messages & Solutions

#### Error: "Failed to transcribe audio. Please try again."

**Possible Causes:**

1. **Model Download Failed**
   - Check console for: "Loading Whisper model..."
   - If stuck, check internet connection
   - Models download from Hugging Face CDN (~190MB)
   
2. **Audio Format Issue**
   - Fixed in latest update
   - Browser should now use optimal format automatically
   
3. **No Speech Detected**
   - Make sure you spoke during recording
   - Check microphone is working
   - Recording duration should be > 1 second

4. **Microphone Permission Denied**
   - Browser blocked microphone access
   - Click the lock icon in address bar
   - Allow microphone permission
   - Refresh page and try again

## Step-by-Step Debugging

### Test 1: Check Browser Support
```javascript
// Run in browser console:
console.log('WebAssembly:', typeof WebAssembly === 'object');
console.log('AudioContext:', typeof AudioContext !== 'undefined');
console.log('MediaRecorder:', typeof MediaRecorder !== 'undefined');
```
All should return `true`. If not, try Chrome/Edge browser.

### Test 2: Check Microphone
```javascript
// Run in browser console:
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    console.log('✅ Microphone working:', stream.getTracks());
    stream.getTracks().forEach(t => t.stop());
  })
  .catch(err => console.error('❌ Microphone error:', err));
```

### Test 3: Check Model Loading
Open console and look for these messages:
```
🎤 Loading Whisper model for speech-to-text...
✅ Whisper model loaded
📝 Loading summarization model...
✅ Summarization model loaded
```

If models don't load:
- Check network tab in DevTools
- Look for downloads from `huggingface.co`
- Check for CORS errors
- Try on stable internet connection

### Test 4: Check Audio Recording
After recording, console should show:
```
🎤 Audio recorded: [size] bytes, type: audio/webm;codecs=opus
🎤 Preparing audio for transcription...
🎤 Audio prepared: [samples] samples at 16kHz
🎤 Running Whisper model...
✅ Transcription result: { text: "..." }
```

## Fixes Applied

### Version 2 Updates (Latest)

1. ✅ **Audio Format Conversion**
   - Added `prepareAudioForWhisper()` function
   - Converts any audio format to Float32Array
   - Resamples to 16kHz mono (Whisper requirement)
   
2. ✅ **Better Recording Settings**
   - Mono audio (1 channel)
   - 16kHz sample rate
   - Echo cancellation enabled
   - Noise suppression enabled
   
3. ✅ **Format Detection**
   - Tries `audio/webm;codecs=opus` first
   - Falls back to `audio/webm`
   - Falls back to `audio/ogg;codecs=opus`
   - Uses browser's default if none supported
   
4. ✅ **Enhanced Error Messages**
   - More detailed console logging
   - Better error context
   - Empty transcription detection

## Browser Compatibility

### ✅ Fully Supported
- Chrome 90+ (Recommended)
- Edge 90+
- Safari 16.4+

### ⚠️ Partial Support
- Firefox 100+ (may have performance issues)

### ❌ Not Supported
- Internet Explorer
- Safari < 16.4
- Chrome < 90

## Performance Issues

### Models Loading Slowly
**Normal first-time behavior:**
- Whisper model: ~40MB (5-15 seconds)
- Summarization model: ~150MB (10-30 seconds)
- Total: ~190MB first download

**After first load:**
- Models cached in browser
- Subsequent loads: < 1 second

### Processing Taking Long
**Expected processing times:**
- 1 min audio: 5-10 seconds transcription
- Summarization: 2-5 seconds
- Total: 7-15 seconds

**If slower:**
- Check CPU usage (should be < 50%)
- Close other heavy browser tabs
- Try on better hardware

## Advanced Debugging

### Clear Model Cache
If models seem corrupted:
```javascript
// Run in browser console:
caches.keys().then(keys => {
  console.log('Clearing caches:', keys);
  return Promise.all(keys.map(key => caches.delete(key)));
}).then(() => {
  console.log('✅ Cache cleared. Refresh page.');
});
```

### Force Model Reload
```javascript
// In src/utils/aiSpeech.ts, add to top:
transcriber = null;
summarizer = null;
```

### Test with Sample Audio
```javascript
// Create test audio blob and try processing:
fetch('/path/to/test.wav')
  .then(r => r.blob())
  .then(blob => processAudioDiary(blob))
  .then(result => console.log('Test result:', result))
  .catch(err => console.error('Test failed:', err));
```

## Common Solutions

### Solution 1: Hard Refresh
1. Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clears cached code
3. Reloads latest version

### Solution 2: Clear Browser Data
1. Settings → Privacy → Clear browsing data
2. Select "Cached images and files"
3. Don't clear "Cookies" (will log you out of Supabase)
4. Refresh and try again

### Solution 3: Try Incognito/Private Window
1. Open incognito window (Ctrl+Shift+N)
2. Navigate to your app
3. Allow microphone permission
4. Try recording again
5. If it works, your browser extensions might be interfering

### Solution 4: Switch Browser
If Chrome doesn't work:
1. Try Microsoft Edge
2. Or Firefox (latest version)
3. Or Safari 16.4+ (Mac only)

## Getting Help

### What to Include in Bug Report
1. **Browser & Version**
   ```javascript
   console.log(navigator.userAgent);
   ```

2. **Console Errors**
   - Screenshot of red error messages
   - Include full stack trace

3. **Network Status**
   - Open Network tab in DevTools
   - Try recording
   - Screenshot any failed requests (red)

4. **Steps to Reproduce**
   - What you clicked
   - What you said
   - When error appeared

## Environment Variables

Check if you need to configure:
```env
# Not needed for local AI, but check if set:
VITE_ENABLE_AI=true  # Should be true or undefined
```

## Still Not Working?

### Last Resort Options:

1. **Disable AI and use basic recording**
   - Comment out AI processing
   - Just use MediaRecorder
   - Save raw audio files

2. **Use smaller model**
   ```typescript
   // In aiSpeech.ts, change:
   'Xenova/whisper-tiny.en' → 'Xenova/whisper-base.en'
   ```

3. **Skip summarization**
   ```tsx
   // In Diary.tsx:
   <AISpeechToText 
     showSummary={false}  // Disable summary
     onSummary={undefined}
   />
   ```

## Success Indicators

You'll know it's working when you see:
1. ✅ Red recording dot pulsing
2. ✅ Recording timer counting up
3. ✅ "Processing..." state after stopping
4. ✅ "Transcribing your speech..." message
5. ✅ Text appearing in diary textarea
6. ✅ Console showing transcription and summary

## Model Information

### Current Models Used:
- **Whisper**: `Xenova/whisper-tiny.en`
  - Size: ~40MB
  - Language: English only
  - Speed: Very fast
  - Accuracy: Good for clear speech

- **Summarization**: `Xenova/distilbart-cnn-6-6`
  - Size: ~150MB  
  - Speed: Fast
  - Quality: Good summaries

### Alternative Models (if needed):

**For better accuracy:**
```typescript
'Xenova/whisper-small'  // ~250MB, better accuracy
'Xenova/whisper-base'   // ~150MB, balanced
```

**For better summaries:**
```typescript
'Xenova/bart-large-cnn'  // ~500MB, best quality
'facebook/bart-large-cnn-samsum'  // Optimized for conversations
```

## Contact

If you've tried everything and it still doesn't work:
1. Create an issue on GitHub
2. Include console logs
3. Include browser info
4. Describe what you tried

---

**Updated**: November 7, 2025
**Version**: 2.0 (with audio format fixes)
