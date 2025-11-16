import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getMessages } from '@/i18n/messages';
import useTranslation from '@/i18n/useTranslation';
import { saveRecord, type PHQ9Record } from '@/utils/storage';
import { getSeverity, shouldShowNudge, shouldEscalate, getSeverityColor } from '@/utils/severity';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { ReaderIcon } from '@radix-ui/react-icons';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Link } from 'react-router-dom';

export function PHQ9() {
  const { locale } = useTranslation();
  const messages = getMessages(locale);
  
  // State for answers (0-3 for each question)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(9).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoginCTA, setShowLoginCTA] = useState(false);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = parseInt(value, 10);
    setAnswers(newAnswers);
  };

  const computePHQ9Total = (): number => {
    return answers.reduce((sum, answer) => (sum ?? 0) + (answer ?? 0), 0) as number;
  };

  const isFormValid = (): boolean => {
    return answers.every(answer => answer !== null);
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      alert(messages.pleaseAnswerAll || 'Please answer all questions');
      return;
    }

    setIsSubmitting(true);

    try {
      const total = computePHQ9Total();
      const severity = getSeverity(total);
      
      const record: PHQ9Record = {
        id: crypto.randomUUID(),
        answers: answers as number[],
        total,
        severity,
        locale,
        createdAt: new Date().toISOString(),
      };

      await saveRecord(record);
      
      // Show success message briefly
      setShowSuccess(true);
      // If user is not authenticated, show CTA to login/create account to save records to cloud
      try {
        if (isSupabaseConfigured() && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            setShowLoginCTA(true);
          }
        } else {
          // No supabase configured -> treat as unauthenticated
          setShowLoginCTA(true);
        }
      } catch {
        setShowLoginCTA(true);
      }
      setTimeout(() => {
        setShowSuccess(false);
        // Reset form
        setAnswers(Array(9).fill(null));
      }, 2000);

    } catch (error) {
      console.error('Failed to save record:', error);
      alert('Failed to save assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const responseOptions = [
    { value: '0', label: messages.responses[0] },
    { value: '1', label: messages.responses[1] },
    { value: '2', label: messages.responses[2] },
    { value: '3', label: messages.responses[3] },
  ];

  // Calculate current total for preview
  const currentTotal = computePHQ9Total();
  const hasAnswers = answers.some(a => a !== null);
  const severity = getSeverity(currentTotal);

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card className="bg-white/30">
        <CardHeader>
          <CardTitle className="text-2xl">{messages.phq9Title}</CardTitle>
          <CardDescription className="text-base">
            {messages.phq9Instructions}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4  text-blue-900">
            {messages.disclaimer}
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {messages.questions.map((question: string, index: number) => (
              <div key={index} className="border-b pb-6 last:border-b-0">
                <Label className="text-base mb-4 block">
                  {question}
                </Label>
                <RadioGroup
                  value={answers[index]?.toString() ?? ''}
                  onValueChange={(value) => handleAnswerChange(index, value)}
                  className="space-y-2"
                >
                  {responseOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem
                        value={option.value}
                        id={`q${index}-${option.value}`}
                      />
                      <Label
                        htmlFor={`q${index}-${option.value}`}
                        className="font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>

          {/* Score Preview */}
          {hasAnswers && (
            <div className="bg-white/30 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="  font-medium text-gray-700">
                  Latest Score:
                </span>
                <span className={`text-lg font-bold ${getSeverityColor(severity)}`}>
                  {currentTotal} / 27
                </span>
              </div>
              {isFormValid() && (
                <p className="  text-gray-600 mt-2">
                  {severity === 'Minimal' && messages.severityMinimal}
                  {severity === 'Mild' && messages.severityMild}
                  {severity === 'Moderate' && messages.severityModerate}
                  {severity === 'Moderately severe' && messages.severityModeratelySevere}
                  {severity === 'Severe' && messages.severitySevere}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className="flex-1 shadow-md "
            >
              {isSubmitting ? messages.saving || 'Saving...' : messages.submit}
            </Button>
            {showSuccess && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="  font-medium">
                  {messages.savedSuccessfully || 'Saved successfully!'}
                </span>
              </div>
            )}
          </div>

          {showLoginCTA && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-800">
                {messages.nudgeText || 'You can keep track of score changes by creating an account.'}
              </p>
              <div className="mt-3">
                <Link to="/auth">
                  <Button variant="default" className="mt-2">{messages.loginButton || 'Login / Create account'}</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Show nudge or escalation after submission preview */}
          {isFormValid() && shouldShowNudge(currentTotal) && (
            <Card className="bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="  text-amber-900 font-medium">
                      {shouldEscalate(currentTotal) 
                        ? messages.crisisTitle
                        : 'Consider Seeking Support'}
                    </p>
                    <p className="  text-amber-800">
                      {shouldEscalate(currentTotal)
                        ? messages.escalationText
                        : messages.nudgeText}
                    </p>
                    {shouldEscalate(currentTotal) && (
                      <div className="mt-3 space-y-2">
                        <p className="  font-semibold text-amber-900">
                          {messages.crisisText}
                        </p>
                        <ul className="  text-amber-800 space-y-1">
                          <li>📞 <strong>111</strong> - Emergency Services</li>
                          <li>📞 <strong>0800 543 354</strong> - Lifeline</li>
                          <li>📞 <strong>1737</strong> - Need to Talk</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* PHQ-9 Information Card */}
      <div className="mt-8">
        <Card className="p-6 md:p-8 bg-linear-to-r from-indigo-100/30 via-purple-100/30 to-pink-100/30 backdrop-blur-sm rounded-xl shadow-md">
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center">
                <ReaderIcon className="w-6 h-6 text-[#009490]" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-3 text-gray-900">
                {messages.phq9InfoTitle}
              </h3>
              <p className="text-gray-700 text-base leading-relaxed mb-3">
                {messages.phq9InfoDescription}
              </p>
              <p className="text-gray-600 text-base leading-relaxed">
                {messages.phq9InfoValidation}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
