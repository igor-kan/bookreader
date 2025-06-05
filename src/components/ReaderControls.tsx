
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ReaderControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onToggleToc: () => void;
  currentLocation: string;
  totalLocations: number;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  bookType: 'epub' | 'pdf' | null;
}

const ReaderControls: React.FC<ReaderControlsProps> = ({
  onPrev,
  onNext,
  onToggleToc,
  currentLocation,
  totalLocations,
  fontSize,
  onChangeFontSize,
  bookType,
}) => {
  // Calculate progress for the progress bar
  let progress = 0;
  if (bookType === 'epub') {
    // For EPUB, parse the progress from the CFI if possible
    progress = totalLocations ? (parseInt(currentLocation.split('/')[4] || '0', 10) / totalLocations) * 100 : 0;
  } else if (bookType === 'pdf') {
    // For PDF, we can directly use page numbers
    progress = totalLocations ? (parseInt(currentLocation, 10) / totalLocations) * 100 : 0;
  }

  // Ensure progress is within 0-100 range
  progress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="bg-white border-b p-3 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onToggleToc}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <span className="ml-2 hidden sm:inline">Contents</span>
        </Button>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
        <Button variant="outline" size="sm" onClick={onPrev}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Button>

        <span className="text-xs sm:text-sm text-gray-500">
          {bookType === 'epub'
            ? `Progress: ${Math.round(progress)}%`
            : `Page ${currentLocation} of ${totalLocations}`}
        </span>

        <Button variant="outline" size="sm" onClick={onNext}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChangeFontSize(Math.max(70, fontSize - 10))}
                disabled={fontSize <= 70}
              >
                <span className="text-xs">A-</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Decrease font size</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="w-24 hidden sm:block">
          <Slider
            defaultValue={[fontSize]}
            min={70}
            max={150}
            step={5}
            onValueChange={(value) => onChangeFontSize(value[0])}
            disabled={bookType !== 'epub'}
          />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChangeFontSize(Math.min(150, fontSize + 10))}
                disabled={fontSize >= 150}
              >
                <span className="text-base font-semibold">A+</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Increase font size</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ReaderControls;
