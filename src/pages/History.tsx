import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMergedRecords, type PHQ9Record } from '@/utils/storage';
import { getSeverityColor, getSeverityBgColor, type SeverityLevel } from '@/utils/severity';
import { getMessages, type Locale } from '@/i18n/messages';
import { FileDown, Calendar, TrendingUp } from 'lucide-react';
import { PHQ9LineChart } from '@/components/charts/PHQ9LineChart';
import { ScoreSummaryCard } from '@/components/charts/ScoreSummary';
import { transformToChartData, calculateScoreSummary } from '@/utils/chartUtils';

interface HistoryProps {
  locale: Locale;
  onExportPDF?: () => void;
}

export function History({ locale, onExportPDF }: HistoryProps) {
  const messages = getMessages(locale);
  const [records, setRecords] = useState<PHQ9Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await getMergedRecords();
      // Already sorted by date descending in getMergedRecords
      setRecords(data);
    } catch (error) {
      console.error('Failed to load records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString(locale === 'mi' ? 'en-NZ' : 'en-NZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSeverityLabel = (severity: string): string => {
    switch (severity) {
      case 'Minimal': return messages.severityMinimal;
      case 'Mild': return messages.severityMild;
      case 'Moderate': return messages.severityModerate;
      case 'Moderately severe': return messages.severityModeratelySevere;
      case 'Severe': return messages.severitySevere;
      default: return severity;
    }
  };

  const calculateTrend = (): { direction: 'up' | 'down' | 'stable'; change: number } | null => {
    if (records.length < 2) return null;
    
    const latest = records[0].total;
    const previous = records[1].total;
    const change = latest - previous;
    
    if (change > 0) return { direction: 'up', change };
    if (change < 0) return { direction: 'down', change: Math.abs(change) };
    return { direction: 'stable', change: 0 };
  };

  const trend = calculateTrend();

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{messages.historyTitle}</CardTitle>
            <CardDescription>{messages.historyEmpty}</CardDescription>
          </CardHeader>
          <CardContent className="py-12">
            <div className="text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{messages.historyEmpty}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{messages.historyTitle}</CardTitle>
              <CardDescription>
                {records.length} {records.length === 1 ? 'assessment' : 'assessments'} recorded
              </CardDescription>
            </div>
            {onExportPDF && (
              <Button onClick={onExportPDF} variant="outline">
                <FileDown className="h-4 w-4 mr-2" />
                {messages.historyExportPDF}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Charts Section - NEW */}
          {records.length >= 2 && (
            <div className="space-y-6">
              {/* Score Summary */}
              <ScoreSummaryCard 
                summary={calculateScoreSummary(records)}
                currentSeverity={records[0].severity}
                locale={locale}
              />

              {/* Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>{locale === 'en' ? 'Score Trend' : 'Ia Kaute'}</CardTitle>
                  <CardDescription>
                    {locale === 'en' 
                      ? 'Your PHQ-9 scores over time' 
                      : 'Ō kaute PHQ-9 i ngā wā katoa'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PHQ9LineChart 
                    data={transformToChartData(records)}
                    locale={locale}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Trend indicator */}
          {trend && (
            <Card className={`${
              trend.direction === 'down' ? 'bg-green-50 border-green-200' :
              trend.direction === 'up' ? 'bg-amber-50 border-amber-200' :
              'bg-gray-50 border-gray-200'
            }`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className={`h-5 w-5 ${
                    trend.direction === 'down' ? 'text-green-600 rotate-180' :
                    trend.direction === 'up' ? 'text-amber-600' :
                    'text-gray-600 rotate-90'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">
                      {trend.direction === 'down' && locale === 'en' && `Score decreased by ${trend.change} points`}
                      {trend.direction === 'down' && locale === 'mi' && `Kua heke te kaute ${trend.change} piro`}
                      {trend.direction === 'up' && locale === 'en' && `Score increased by ${trend.change} points`}
                      {trend.direction === 'up' && locale === 'mi' && `Kua piki te kaute ${trend.change} piro`}
                      {trend.direction === 'stable' && locale === 'en' && 'Score unchanged'}
                      {trend.direction === 'stable' && locale === 'mi' && 'Kāore i rerekē te kaute'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {locale === 'en' ? 'Compared to previous assessment' : 'I te whakataurite ki te aromatawai o mua'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Records list */}
          <div className="space-y-4">
            {records.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {formatDate(record.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityBgColor(record.severity as SeverityLevel)} ${getSeverityColor(record.severity as SeverityLevel)}`}>
                          {getSeverityLabel(record.severity)}
                        </span>
                        <span className="text-2xl font-bold text-gray-900">
                          {record.total}
                          <span className="text-base font-normal text-gray-500"> / 27</span>
                        </span>
                      </div>
                    </div>
                    
                    {/* Question responses summary */}
                    <div className="flex gap-1">
                      {record.answers.map((answer, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-12 rounded ${
                            answer === 0 ? 'bg-green-200' :
                            answer === 1 ? 'bg-yellow-200' :
                            answer === 2 ? 'bg-orange-200' :
                            'bg-red-200'
                          }`}
                          title={`${locale === 'en' ? 'Question' : 'Pātai'} ${idx + 1}: ${answer}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
