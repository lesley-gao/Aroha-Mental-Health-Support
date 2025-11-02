/**
 * AudioPlayer component for playing mindfulness and meditation audio
 * Uses HTML5 audio element for simple, accessible playback
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  title?: string;
  description?: string;
  locale?: 'en' | 'mi';
}

export function AudioPlayer({ src, title, description, locale = 'en' }: AudioPlayerProps) {
  const defaultTitle = locale === 'en' ? 'Mindfulness Audio' : 'Oro Whakaarohia';
  const defaultDescription = locale === 'en' 
    ? 'Take a moment to relax and listen to this mindfulness exercise'
    : 'Tangohia he wā ki te whakangā me te whakarongo ki tēnei whakamāoritanga whakaarohia';

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Music className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">{title || defaultTitle}</CardTitle>
            <CardDescription className="text-sm">
              {description || defaultDescription}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <audio 
          controls 
          src={src}
          className="w-full"
          preload="metadata"
        >
          <p className="text-sm text-gray-600">
            {locale === 'en'
              ? 'Your browser does not support the audio element.'
              : 'Kāore tō pūtirotiro e tautoko i te huānga oro.'}
          </p>
        </audio>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-900">
            {locale === 'en'
              ? 'Find a quiet space and use headphones for the best experience.'
              : 'Kimihia he wāhi mārie me te whakamahi i ngā pakitara hei wheako pai rawa atu.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
