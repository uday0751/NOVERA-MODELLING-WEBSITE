'use client';

import { useState } from 'react';
import { Step1BasicInfo } from './step1-basic-info';
import { Step2PhysicalStats } from './step2-physical-stats';
import { Step3Categories } from './step3-categories';
import { Step4MediaUpload } from './step4-media-upload';
import { Step5Rates } from './step5-rates';
import { Step6ReviewSubmit } from './step6-review-submit';

interface WizardProps {
  profile: any;
  details: any;
  media: any[];
  rates: any;
}

export function OnboardingWizard({ profile, details, media, rates }: WizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const steps = [
    'Basic Info',
    'Physical Stats',
    'Categories',
    'Portfolio Media',
    'Rate Card',
    'Review & Submit',
  ];

  return (
    <div className="space-y-6">
      {/* Stepper Header */}
      <div className="border p-4 rounded bg-gray-50">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Onboarding Wizard</p>
        <div className="flex justify-between items-center mt-2">
          {steps.map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isDone = currentStep > stepNum;
            return (
              <div key={label} className="text-center flex-1">
                <div
                  className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-xs font-bold border ${
                    isActive
                      ? 'bg-black text-white border-black'
                      : isDone
                      ? 'bg-gray-300 text-gray-800 border-gray-400'
                      : 'bg-white text-gray-400 border-gray-200'
                  }`}
                >
                  {stepNum}
                </div>
                <span className={`text-xs mt-1 block ${isActive ? 'font-bold' : 'text-gray-500'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Renderers */}
      {currentStep === 1 && (
        <Step1BasicInfo
          defaultValues={{
            phone: profile.phone || '',
            dateOfBirth: '',
            location: '',
          }}
          onNext={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 2 && (
        <Step2PhysicalStats
          defaultValues={{
            height: details?.height || 170,
            weight: details?.weight || 60,
            bust: details?.bust || null,
            waist: details?.waist || null,
            hips: details?.hips || null,
            shoeSize: details?.shoe_size || 8,
            hairColor: details?.hair_color || '',
            eyeColor: details?.eye_color || '',
            ethnicity: details?.ethnicity || '',
            tattoos: details?.tattoos || false,
            piercings: details?.piercings || false,
            bio: details?.bio || '',
          }}
          onNext={() => setCurrentStep(3)}
          onPrev={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <Step3Categories
          defaultValues={{
            categories: details?.categories || [],
            languages: details?.languages || ['English'],
          }}
          onNext={() => setCurrentStep(4)}
          onPrev={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <Step4MediaUpload
          existingMedia={media}
          onNext={() => setCurrentStep(5)}
          onPrev={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 5 && (
        <Step5Rates
          defaultValues={{
            hourlyRate: rates?.hourly_rate || 50,
            halfDayRate: rates?.half_day_rate || 200,
            fullDayRate: rates?.full_day_rate || 350,
            currency: rates?.currency || 'USD',
          }}
          onNext={() => setCurrentStep(6)}
          onPrev={() => setCurrentStep(4)}
        />
      )}

      {currentStep === 6 && (
        <Step6ReviewSubmit
          data={{
            basicInfo: { phone: profile.phone },
            physicalStats: details,
            categories: { categories: details?.categories, languages: details?.languages },
            mediaCount: media.length,
            rates,
          }}
          onPrev={() => setCurrentStep(5)}
        />
      )}
    </div>
  );
}
