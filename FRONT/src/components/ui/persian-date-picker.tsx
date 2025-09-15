"use client";

import * as React from "react";
// @ts-ignore
import moment from "moment-jalaali";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, X, ChevronLeft, ChevronRight } from "lucide-react";

// Configure moment to use Persian locale
moment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' });

interface PersianDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  language?: 'fa' | 'en';
  includeTime?: boolean;
}

// Persian month names
const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

// English month names
const englishMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Persian day names
const persianDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

// English day names
const englishDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function PersianDatePicker({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
  language = 'fa',
  includeTime = true,
}: PersianDatePickerProps) {
  const defaultPlaceholder = language === 'fa' ? 'انتخاب تاریخ' : 'Pick a date';
  const actualPlaceholder = placeholder || defaultPlaceholder;
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(moment());
  const [timeValue, setTimeValue] = React.useState({ hours: 9, minutes: 0 });

  // Initialize from value
  React.useEffect(() => {
    if (value) {
      setCurrentMonth(moment(value));
      setTimeValue({
        hours: value.getHours(),
        minutes: value.getMinutes(),
      });
    } else {
      setCurrentMonth(moment());
      setTimeValue({ hours: 9, minutes: 0 });
    }
  }, [value]);

  const formatDisplayDate = () => {
    if (!value) return actualPlaceholder;
    
    if (language === 'fa') {
      const jalali = moment(value);
      const dateStr = jalali.format('jYYYY/jMM/jDD');
      if (includeTime) {
        const timeStr = jalali.format('HH:mm');
        return `${dateStr} ساعت ${timeStr}`;
      }
      return dateStr;
    } else {
      const gregorian = moment(value);
      const dateStr = gregorian.format('YYYY/MM/DD');
      if (includeTime) {
        const timeStr = gregorian.format('HH:mm');
        return `${dateStr} at ${timeStr}`;
      }
      return dateStr;
    }
  };

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  const goToPreviousMonth = () => {
    if (language === 'fa') {
      setCurrentMonth((prev: any) => moment(prev).subtract(1, 'jMonth'));
    } else {
      setCurrentMonth((prev: any) => moment(prev).subtract(1, 'month'));
    }
  };

  const goToNextMonth = () => {
    if (language === 'fa') {
      setCurrentMonth((prev: any) => moment(prev).add(1, 'jMonth'));
    } else {
      setCurrentMonth((prev: any) => moment(prev).add(1, 'month'));
    }
  };

  const selectDate = (day: number) => {
    let selectedMoment;
    if (language === 'fa') {
      selectedMoment = moment(currentMonth).jDate(day);
    } else {
      selectedMoment = moment(currentMonth).date(day);
    }
    
    if (includeTime) {
      selectedMoment.hours(timeValue.hours).minutes(timeValue.minutes);
    }
    onChange(selectedMoment.toDate());
  };

  const handleTimeChange = (field: 'hours' | 'minutes', val: string) => {
    const numValue = parseInt(val, 10);
    if (isNaN(numValue)) return;
    
    let newTime = { ...timeValue };
    if (field === 'hours') {
      newTime.hours = Math.max(0, Math.min(23, numValue));
    } else {
      newTime.minutes = Math.max(0, Math.min(59, numValue));
    }
    
    setTimeValue(newTime);
    
    if (value) {
      const updatedMoment = moment(value).hours(newTime.hours).minutes(newTime.minutes);
      onChange(updatedMoment.toDate());
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    let startOfMonth, endOfMonth, startOfWeek, endOfWeek;
    
    if (language === 'fa') {
      startOfMonth = moment(currentMonth).startOf('jMonth');
      endOfMonth = moment(currentMonth).endOf('jMonth');
      startOfWeek = moment(startOfMonth).startOf('week');
      endOfWeek = moment(endOfMonth).endOf('week');
    } else {
      startOfMonth = moment(currentMonth).startOf('month');
      endOfMonth = moment(currentMonth).endOf('month');
      startOfWeek = moment(startOfMonth).startOf('week');
      endOfWeek = moment(endOfMonth).endOf('week');
    }

    const days = [];
    const current = moment(startOfWeek);

    while (current.isSameOrBefore(endOfWeek, 'day')) {
      const isCurrentMonth = language === 'fa' 
        ? current.jMonth() === currentMonth.jMonth()
        : current.month() === currentMonth.month();
        
      days.push({
        date: current.clone(),
        isCurrentMonth,
        isToday: current.isSame(moment(), 'day'),
        isSelected: value && current.isSame(moment(value), 'day'),
        isPast: current.isBefore(moment(), 'day'),
        dayNumber: language === 'fa' ? current.jDate() : current.date(),
      });
      current.add(1, 'day');
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-right font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="ml-2 h-4 w-4" />
          <span className="flex-1 text-right">{formatDisplayDate()}</span>
          {value && (
            <X 
              className="mr-2 h-4 w-4 hover:text-destructive" 
              onClick={clearDate}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className={cn("p-4 space-y-4", language === 'fa' ? "dir-rtl" : "dir-ltr")} dir={language === 'fa' ? 'rtl' : 'ltr'}>
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={language === 'fa' ? goToNextMonth : goToPreviousMonth}
              className="p-2"
            >
              {language === 'fa' ? <ChevronLeft className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <div className="text-center">
              <div className="font-semibold">
                {language === 'fa' 
                  ? `${persianMonths[currentMonth.jMonth()]} ${currentMonth.jYear()}`
                  : `${englishMonths[currentMonth.month()]} ${currentMonth.year()}`
                }
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={language === 'fa' ? goToPreviousMonth : goToNextMonth}
              className="p-2"
            >
              {language === 'fa' ? <ChevronRight className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center text-sm text-muted-foreground">
            {(language === 'fa' ? persianDays : englishDays).map((day, index) => (
              <div key={index} className="p-2 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 w-9 p-0 font-normal",
                  !day.isCurrentMonth && "text-muted-foreground opacity-50",
                  day.isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  day.isToday && !day.isSelected && "bg-accent text-accent-foreground",
                  day.isPast && "opacity-50",
                )}
                onClick={() => !day.isPast && selectDate(day.dayNumber)}
                disabled={day.isPast}
              >
                {day.dayNumber}
              </Button>
            ))}
          </div>
          
          {includeTime && (
            <div className="border-t pt-4">
              <Label className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4" />
                {language === 'fa' ? 'زمان' : 'Time'}
              </Label>
              <div className="flex items-center gap-3 justify-center">
                <div className="text-center">
                  <Label className="text-xs text-muted-foreground">
                    {language === 'fa' ? 'ساعت' : 'Hour'}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={timeValue.hours}
                    onChange={(e) => handleTimeChange('hours', e.target.value)}
                    className="w-16 text-center"
                  />
                </div>
                <span className="text-lg font-semibold mt-5">:</span>
                <div className="text-center">
                  <Label className="text-xs text-muted-foreground">
                    {language === 'fa' ? 'دقیقه' : 'Min'}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    step="5"
                    value={timeValue.minutes}
                    onChange={(e) => handleTimeChange('minutes', e.target.value)}
                    className="w-16 text-center"
                  />
                </div>
              </div>
              
              {/* Quick time buttons */}
              <div className="flex gap-1 mt-3 flex-wrap justify-center">
                {[
                  { label: '9:00', hours: 9, minutes: 0 },
                  { label: '12:00', hours: 12, minutes: 0 },
                  { label: '15:00', hours: 15, minutes: 0 },
                  { label: '18:00', hours: 18, minutes: 0 },
                ].map((time) => (
                  <Button
                    key={time.label}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1"
                    onClick={() => {
                      setTimeValue({ hours: time.hours, minutes: time.minutes });
                      if (value) {
                        const updatedMoment = moment(value).hours(time.hours).minutes(time.minutes);
                        onChange(updatedMoment.toDate());
                      }
                    }}
                  >
                    {time.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              {language === 'fa' ? 'انصراف' : 'Cancel'}
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              {language === 'fa' ? 'تأیید' : 'Confirm'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}