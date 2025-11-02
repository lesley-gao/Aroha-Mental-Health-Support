import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { clearAllData, exportAllData } from '@/utils/storage';
import { getMessages, type Locale } from '@/i18n/messages';
import { Download, Trash2, Shield, Info } from 'lucide-react';

interface PrivacyPageProps {
  locale: Locale;
}

/**
 * Privacy & Data Management page
 * Allows users to delete all data or export it as JSON
 */
export function PrivacyPage({ locale }: PrivacyPageProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const messages = getMessages(locale);

  const handleDeleteAllData = async () => {
    setIsDeleting(true);
    try {
      await clearAllData();
      setShowDeleteConfirm(false);
      alert('All data has been deleted successfully.');
      // Reload the page to reset the app state
      window.location.reload();
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Failed to delete data. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const jsonData = await exportAllData();
      
      // Create a blob and download it
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `aroha-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{messages.privacyTitle}</h1>
        <p className="text-gray-600">Manage your data and privacy settings</p>
      </div>

      {/* Privacy Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Your Privacy
          </CardTitle>
          <CardDescription>How your data is stored and protected</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Local Storage Only
            </h3>
            <p className="text-sm text-green-800">
              All your assessment data is stored only on this device in your browser's local storage. 
              No data is sent to external servers or cloud services.
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>What we store:</strong> PHQ-9 assessment responses, scores, dates, language preference, and consent status.
            </p>
            <p>
              <strong>What we don't store:</strong> No personal identification, no account information, no tracking data.
            </p>
            <p>
              <strong>Data persistence:</strong> Your data remains on this device until you delete it or clear your browser data.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Export Data Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            Export Your Data
          </CardTitle>
          <CardDescription>Download all your data as a JSON file</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 mb-4">
            Export all your assessment records, settings, and data in JSON format. 
            You can share this file with a healthcare provider or keep it as a backup.
          </p>
          <Button 
            onClick={handleExportData} 
            disabled={isExporting}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : messages.privacyExportButton}
          </Button>
        </CardContent>
      </Card>

      {/* Delete Data Card */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Trash2 className="h-5 w-5" />
            Delete All Data
          </CardTitle>
          <CardDescription>Permanently remove all your data from this device</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 mb-4">
            This will permanently delete all your PHQ-9 assessments, history, and settings. 
            This action cannot be undone. Consider exporting your data first.
          </p>
          <Button 
            onClick={() => setShowDeleteConfirm(true)}
            variant="destructive"
            className="w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {messages.privacyDeleteButton}
          </Button>
        </CardContent>
      </Card>

      {/* Attribution */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <p className="text-xs text-gray-600">{messages.translationAttribution}</p>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-700">Confirm Deletion</DialogTitle>
            <DialogDescription className="pt-4">
              {messages.privacyDeleteConfirm}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              {messages.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAllData}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : messages.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PrivacyPage;
