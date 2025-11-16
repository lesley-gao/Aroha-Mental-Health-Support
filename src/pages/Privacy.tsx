import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { clearAllData, exportAllData } from "@/utils/storage";
import useTranslation from "@/i18n/useTranslation";
import { Download, Trash2, Shield, Info } from "lucide-react";



/**
 * Privacy & Data Management page
 * Allows users to delete all data or export it as JSON
 */
export function PrivacyPage() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { t } = useTranslation();

  const handleDeleteAllData = async () => {
    setIsDeleting(true);
    try {
      await clearAllData();
      setShowDeleteConfirm(false);
      alert("All data has been deleted successfully.");
      // Reload the page to reset the app state
      window.location.reload();
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Failed to delete data. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const jsonData = await exportAllData();

      // Create a blob and download it
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `aroha-data-export-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('privacyTitle')}</h1>
        <p className="text-gray-600">{t('privacyPageIntro')}</p>
      </div>

      {/* Privacy Information Card */}
      <Card className="bg-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal-600" />
            {t('privacyCardTitle')}
          </CardTitle>
          <CardDescription>{t('privacyCardDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              {t('privacyLocalStorageHeading')}
            </h3>
            <p className=" text-green-800">{t('privacyLocalStorageText')}</p>
          </div>

          <div className="space-y-2 text-gray-700">
            <p>
              <strong>{t('privacyWhatWeStoreLabel')}</strong> {t('privacyWhatWeStore')}
            </p>
            <p>
              <strong>{t('privacyWhatWeDontStoreLabel')}</strong> {t('privacyWhatWeDontStore')}
            </p>
            <p>
              <strong>{t('privacyDataPersistenceLabel')}</strong> {t('privacyDataPersistence')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Export Data Card */}
      <Card className="bg-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-teal-600" />
            {t('privacyExportCardTitle')}
          </CardTitle>
          <CardDescription>{t('privacyExportCardDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className=" text-gray-700 mb-4">{t('privacyExportExplanation')}</p>
          <Button
            onClick={handleExportData}
            disabled={isExporting}
            variant="default"
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? t('privacyExporting') : t('privacyExportButton')}
          </Button>
        </CardContent>
      </Card>

      {/* Delete Data Card */}
      <Card className="bg-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Trash2 className="h-5 w-5" />
            {t('privacyDeleteCardTitle')}
          </CardTitle>
          <CardDescription>{t('privacyDeleteCardDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className=" text-gray-700 mb-4">{t('privacyDeleteWarning')}</p>
            <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="destructive"
            className="w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
              {t('privacyDeleteButton')}
          </Button>
        </CardContent>
      </Card>

      {/* Attribution */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <p className="text-xs text-gray-600">{t('translationAttribution')}</p>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-700">{t('privacyConfirmDeletionTitle')}</DialogTitle>
            <DialogDescription className="pt-4">
              {t('privacyDeleteConfirm')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAllData}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PrivacyPage;
