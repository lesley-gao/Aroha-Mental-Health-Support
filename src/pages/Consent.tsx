import { useEffect, useState } from 'react';
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
import { getMessages, type Locale } from '@/i18n/messages';

interface ConsentModalProps {
  locale: Locale;
  onConsent: () => void;
}

/**
 * Consent modal component
 * Displays privacy information and requires explicit user consent
 * Shows on first run or when consent hasn't been given
 */
export function ConsentModal({ locale, onConsent }: ConsentModalProps) {
  const [open, setOpen] = useState(false);
  const messages = getMessages(locale);

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
    setOpen(false);
    onConsent();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">{messages.consentTitle}</DialogTitle>
          <DialogDescription className="text-base pt-4 space-y-4">
            <p>{messages.consentText}</p>
            
            <div className="bg-[#D1F08B] border-l-4 border-[#009490] p-4 my-4">
              <h4 className="font-semibold mb-2">What you should know:</h4>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>Your data never leaves this device automatically</li>
                <li>No account or login required</li>
                <li>You control all exports and sharing</li>
                <li>Delete your data anytime from Privacy settings</li>
              </ul>
            </div>

            <p className="text-sm text-gray-500 italic">{messages.disclaimer}</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleConsent} className="w-full sm:w-auto">
            {messages.consentButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConsentModal;
