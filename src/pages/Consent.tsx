import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getConsent, setConsent } from "@/utils/storage";
import useTranslation from "@/i18n/useTranslation";

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
    setOpen(false);
    onConsent();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-4xl p-0 gap-0"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-col md:flex-row">
          {/* Left: Content */}
          <div className="p-6 md:p-8 flex-1">
            <DialogHeader>
              <DialogTitle className="text-xl">{t("consentTitle")}</DialogTitle>
              <DialogDescription className="pt-4 space-y-8 text-gray-800">
                <p>{t("consentText")}</p>

                <div className="bg-[#D1F08B] border-l-4 border-[#009490] p-4 my-8 text-sm">
                  <h4 className="font-semibold mb-2 text-base">
                    {t("consentKnowHeading")}
                  </h4>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>{t("consentPoint1")}</li>
                    <li>{t("consentPoint2")}</li>
                    <li>{t("consentPoint3")}</li>
                    <li>{t("consentPoint4")}</li>
                    <li>{t("consentPoint5")}</li>
                    <li>{t("consentPoint6")}</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-800 italic">
                  {t("disclaimer")}
                </p>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-6">
              <Button onClick={handleConsent} className="w-full sm:w-auto">
                {t("consentButton")}
              </Button>
            </DialogFooter>
          </div>

          {/* Right: Image */}
          <div className="hidden md:flex bg-gray-100 items-center justify-center">
            <img
              src="/dolphin-cover.png"
              alt="Privacy illustration"
              className="h-[300px] w-auto object-contain"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConsentModal;
