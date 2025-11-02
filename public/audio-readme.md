# Audio Files

This directory should contain mindfulness and meditation audio files.

## Adding Audio Files

To add a sample meditation audio:

1. Place your MP3 file in this directory (e.g., `sample-meditation.mp3`)
2. Use the `AudioPlayer` component in your pages:

```tsx
import { AudioPlayer } from '@/components/AudioPlayer';

<AudioPlayer 
  src="/sample-meditation.mp3"
  title="5-Minute Mindfulness"
  description="A brief meditation to help you relax"
  locale={locale}
/>
```

## Recommended Audio

For the Aroha MVP, consider using:
- Short (3-5 minute) mindfulness exercises
- Bilingual content (English and te reo Māori) where possible
- CC0 or Creative Commons licensed audio
- Clear, calm narration suitable for youth

## Resources

Free meditation audio resources:
- [Freesound.org](https://freesound.org) - CC0 audio
- [Free Music Archive](https://freemusicarchive.org) - Various licenses
- Ensure proper attribution as required by the license

## Note

The AudioPlayer component is implemented and ready to use. Simply add your audio files to this directory and reference them in the component.
