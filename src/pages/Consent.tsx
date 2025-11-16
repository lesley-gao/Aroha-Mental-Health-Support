import { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getConsent, setConsent } from '@/utils/storage';
import useTranslation from '@/i18n/useTranslation';

interface ConsentModalProps {
  onConsent: () => void;
}

/**
 * Consent modal component
 * Displays privacy information and requires explicit user consent
 * Shows on first run or when consent hasn't been given
 */
export function ConsentModal({ onConsent }: ConsentModalProps) {
  const [open, setOpen] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const timerRef = useRef<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if user has already consented
    const consent = getConsent();
    if (!consent || !consent.hasConsented) {
      setOpen(true);
    }
  }, []);

  const handleConsent = () => {
    // Save consent with timestamp
    setConsent({
      hasConsented: true,
      consentDate: new Date().toISOString(),
    });
    // Show a brief confirmation then close
    setShowSaved(true);
    // close modal after a short delay so user sees confirmation
    timerRef.current = window.setTimeout(() => {
      setShowSaved(false);
      setOpen(false);
      onConsent();
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[900px] max-w-4xl" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
          <DialogTitle className="text-xl">{t('consentTitle')}</DialogTitle>
          <DialogDescription className="text-sm pt-4 space-y-4">
            <p>{t('consentText')}</p>

            <div className="bg-[#D1F08B] border-l-4 border-[#009490] p-4 my-4 text-sm">
              <h4 className="font-semibold mb-2 text-base">What you should know:</h4>
              <ul className="space-y-2 list-disc list-inside">
                <li>You can use the app anonymously — no account required to take assessments.</li>
                <li>Creating an account and enabling cloud sync lets you save and access records across devices.</li>
                <li>If you enable cloud sync, your data is stored securely in our database.</li>
                <li>Microphone access is optional and only used for speech-to-text features.</li>
                <li>You control exports and sharing (PDF/JSON) and can delete your data at any time.</li>
              </ul>
            </div>

            <p className="text-sm text-gray-500 italic">{t('disclaimer')}</p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          {showSaved && (
            <div className="text-emerald-700 font-medium mr-4">Saved</div>
          )}
          <Button onClick={handleConsent} className="w-full sm:w-auto" disabled={showSaved}>
            {t('consentButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConsentModal;
