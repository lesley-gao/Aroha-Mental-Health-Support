import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMergedRecords, type PHQ9Record } from '@/utils/storage';
import { getMessages, type Locale } from '@/i18n/messages';
import { FileDown, Calendar, ChevronLeft, ChevronRight, List, CalendarDays } from 'lucide-react';
import { PHQ9LineChart } from '@/components/charts/PHQ9LineChart';
import { ScoreSummaryCard } from '@/components/charts/ScoreSummary';
import { transformToChartData, calculateScoreSummary } from '@/utils/chartUtils';

interface HistoryProps {
  locale: Locale;
  onExportPDF?: () => void;
}

const RECORDS_PER_PAGE = 10;

type ViewMode = 'list' | 'calendar';

export function History({ locale, onExportPDF }: HistoryProps) {
  const messages = getMessages(locale);
  const [records, setRecords] = useState<PHQ9Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  const getSeverityStyles = (severity: string): { backgroundColor: string; color: string } => {
    const severityLower = severity.toLowerCase();
    
    if (severityLower.includes('minimal')) {
      return { backgroundColor: '#f0fdf4', color: '#16a34a' }; // green-50, green-600
    } else if (severityLower.includes('mild')) {
      return { backgroundColor: '#fefce8', color: '#ca8a04' }; // yellow-50, yellow-600
    } else if (severityLower.includes('moderate') && !severityLower.includes('severe')) {
      return { backgroundColor: '#fff7ed', color: '#ea580c' }; // orange-50, orange-600
    } else if (severityLower.includes('moderately severe') || severityLower.includes('moderately-severe')) {
      return { backgroundColor: '#fef2f2', color: '#dc2626' }; // red-50, red-600
    } else if (severityLower.includes('severe')) {
      return { backgroundColor: '#fee2e2', color: '#b91c1c' }; // red-100, red-700
    }
    
    return { backgroundColor: '#f9fafb', color: '#4b5563' }; // gray-50, gray-600
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

  // Calendar helper functions
  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days: Date[] = [];
    
    // Add previous month's days to fill the first week
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push(prevDate);
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add next month's days to fill the last week
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const getRecordsForDate = (date: Date): PHQ9Record[] => {
    return records.filter(record => {
      const recordDate = new Date(record.createdAt);
      return recordDate.getFullYear() === date.getFullYear() &&
             recordDate.getMonth() === date.getMonth() &&
             recordDate.getDate() === date.getDate();
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  };

  const isSameMonth = (date: Date, compareDate: Date): boolean => {
    return date.getMonth() === compareDate.getMonth() &&
           date.getFullYear() === compareDate.getFullYear();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString(locale === 'mi' ? 'en-NZ' : 'en-NZ', {
      year: 'numeric',
      month: 'long',
    });
  };

  const calendarDays = getDaysInMonth(currentMonth);
  const weekDays = locale === 'en' 
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Rātapu', 'Rāhina', 'Rātū', 'Rāapa', 'Rāpare', 'Rāmere', 'Rāhoroi'];

  // Pagination calculations
  const totalPages = Math.ceil(records.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;
  const currentRecords = records.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl py-8 px-4">
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
      <div className="container mx-auto max-w-7xl py-8 px-4">
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
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <Card className="bg-white/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{messages.historyTitle}</CardTitle>
              <CardDescription>
                {records.length} {records.length === 1 ? 'assessment' : 'assessments'} recorded
              </CardDescription>
            </div>
            {onExportPDF && (
              <Button onClick={onExportPDF} variant="outline" className="bg-[#D1F08B] text-gray-900 shadow-md hover:bg-[#b8d66a]">
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
                trend={trend}
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

          {/* Daily Records Section */}
          <div className="space-y-4 mt-12">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold leading-none tracking-tight text-gray-900">
                {locale === 'en' ? 'Daily Records' : 'Ngā Pūkete ia Rā'}
              </h3>
              
              {/* View Toggle */}
              <div className="flex items-center gap-1 rounded-lg p-1 border border-gray-400">
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                  className="gap-1"
                >
                  <CalendarDays className="h-4 w-4" />
                  {locale === 'en' ? 'Calendar' : 'Maramataka'}
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="gap-1"
                >
                  <List className="h-4 w-4" />
                  {locale === 'en' ? 'List' : 'Rārangi'}
                </Button>
              </div>
            </div>

            {/* Calendar View */}
            {viewMode === 'calendar' ? (
              <div className="space-y-4">
                {/* Calendar Navigation */}
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-semibold text-gray-900">
                    {formatMonthYear(currentMonth)}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousMonth}
                    >
                      <ChevronLeft className="h-4 w-4" /> 
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToToday}
                    >
                      {locale === 'en' ? 'Today' : 'Ināianei'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextMonth}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md">
                  {/* Week Day Headers */}
                  <div className="grid grid-cols-7 bg-gray-50 border-b">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="p-3 text-center text-sm font-semibold text-gray-700"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7">
                    {calendarDays.map((day, idx) => {
                      const dayRecords = getRecordsForDate(day);
                      const isCurrentMonth = isSameMonth(day, currentMonth);
                      const isTodayDate = isToday(day);
                      
                      return (
                        <div
                          key={idx}
                          className={`min-h-[100px] border-b border-r border-gray-200 p-2 ${
                            !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                          } ${
                            isTodayDate ? 'bg-blue-50' : ''
                          } hover:bg-gray-50 transition-colors cursor-pointer`}
                          onClick={() => dayRecords.length > 0 && setSelectedDate(day)}
                        >
                          <div className={`text-sm font-medium mb-1 ${
                            !isCurrentMonth ? 'text-gray-400' : 'text-gray-900'
                          } ${
                            isTodayDate ? 'text-blue-600 font-bold' : ''
                          }`}>
                            {day.getDate()}
                          </div>
                          
                          {/* Assessment indicators */}
                          {dayRecords.length > 0 && (
                            <div className="space-y-1">
                              {dayRecords.map((record) => (
                                <div
                                  key={record.id}
                                  className="text-xs px-2 py-1 rounded truncate"
                                  style={{
                                    ...getSeverityStyles(record.severity),
                                    fontSize: '0.7rem',
                                  }}
                                  title={`${getSeverityLabel(record.severity)}: ${record.total}/27`}
                                >
                                  <span className="font-semibold">{record.total}</span> - {getSeverityLabel(record.severity)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Date Details */}
                {selectedDate && getRecordsForDate(selectedDate).length > 0 && (
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {formatDate(selectedDate.toISOString())}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDate(null)}
                        >
                          ✕
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {getRecordsForDate(selectedDate).map((record) => (
                        <div key={record.id} className="border-l-4 pl-4" style={{ borderColor: getSeverityStyles(record.severity).color }}>
                          <div className="flex items-center gap-3 mb-2">
                            <span 
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                              style={{
                                ...getSeverityStyles(record.severity),
                                border: '1px solid rgba(0,0,0,0.1)'
                              }}
                            >
                              {getSeverityLabel(record.severity)}
                            </span>
                            <span className="text-xl font-bold text-gray-900">
                              {record.total}
                              <span className="text-sm font-normal text-gray-500"> / 27</span>
                            </span>
                          </div>
                          
                          {/* Question responses summary */}
                          <div className="flex gap-1">
                            {record.answers.map((answer, idx) => (
                              <div
                                key={idx}
                                className={`w-2 h-8 rounded ${
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
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              // List View
              <>
                <div className="space-y-4">
                  {currentRecords.map((record) => (
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
                              <span 
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                                style={{
                                  ...getSeverityStyles(record.severity),
                                  border: '1px solid rgba(0,0,0,0.1)'
                                }}
                              >
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

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      {locale === 'en' 
                        ? `Showing ${startIndex + 1}-${Math.min(endIndex, records.length)} of ${records.length} assessments`
                        : `E whakaatu ana ${startIndex + 1}-${Math.min(endIndex, records.length)} o ${records.length} aromatawai`
                      }
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        {locale === 'en' ? 'Previous' : 'O Mua'}
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => goToPage(page)}
                            className="min-w-10"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        {locale === 'en' ? 'Next' : 'E Haere Ana'}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
