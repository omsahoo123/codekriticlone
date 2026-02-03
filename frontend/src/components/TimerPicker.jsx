import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';

export function TimerPicker({ onConfirm, onCancel }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState({ hours: '00', minutes: '00' });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState('calendar'); // 'calendar' or 'time'

  // Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateSelect = (day) => {
    if (day) {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      setSelectedDate(newDate);
      setView('time');
    }
  };

  const handleTimeChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    let finalValue = numValue;

    if (field === 'hours') {
      finalValue = Math.min(Math.max(numValue, 0), 23);
    } else if (field === 'minutes') {
      finalValue = Math.min(Math.max(numValue, 0), 59);
    }

    setSelectedTime({
      ...selectedTime,
      [field]: String(finalValue).padStart(2, '0'),
    });
  };

  const handleConfirm = () => {
    const finalDateTime = new Date(selectedDate);
    finalDateTime.setHours(parseInt(selectedTime.hours), parseInt(selectedTime.minutes), 0);
    onConfirm(finalDateTime.toISOString());
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const calendarDays = generateCalendarDays();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!day) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-white font-semibold">{monthName}</h3>
            <Button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs text-slate-400 font-semibold py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(day)}
                disabled={!day}
                className={`
                  p-2 rounded-lg text-sm font-medium transition-all
                  ${!day ? 'invisible' : ''}
                  ${isSelected(day)
                    ? 'bg-cyan-500 text-black shadow-lg'
                    : isToday(day)
                    ? 'bg-slate-700 text-cyan-400 border border-cyan-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }
                `}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Selected Date Display */}
          <div className="bg-slate-800 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-400">Selected Date</p>
            <p className="text-white font-semibold">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={() => setView('time')} className="btn-primary flex-1">
              <Clock className="w-4 h-4 mr-2" />
              Select Time
            </Button>
          </div>
        </div>
      )}

      {/* Time View */}
      {view === 'time' && (
        <div className="space-y-4">
          {/* Date Display */}
          <div className="bg-slate-800 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-400">Selected Date</p>
            <p className="text-white font-semibold">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Time Picker */}
          <div className="space-y-3">
            <Label className="text-slate-300">Select Time</Label>
            <div className="flex items-center justify-center gap-4">
              {/* Hours */}
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={() => handleTimeChange('hours', (parseInt(selectedTime.hours) + 1) % 24)}
                  variant="ghost"
                  size="sm"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <ChevronLeft className="w-4 h-4 rotate-90" />
                </Button>
                <div className="bg-slate-800 rounded-lg px-6 py-4 text-center">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={selectedTime.hours}
                    onChange={(e) => handleTimeChange('hours', e.target.value)}
                    className="w-16 bg-transparent text-white text-3xl font-bold text-center outline-none"
                  />
                  <p className="text-xs text-slate-400 mt-1">Hours</p>
                </div>
                <Button
                  onClick={() => handleTimeChange('hours', (parseInt(selectedTime.hours) - 1 + 24) % 24)}
                  variant="ghost"
                  size="sm"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <ChevronLeft className="w-4 h-4 -rotate-90" />
                </Button>
              </div>

              {/* Separator */}
              <div className="text-3xl text-white font-bold">:</div>

              {/* Minutes */}
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={() => handleTimeChange('minutes', (parseInt(selectedTime.minutes) + 1) % 60)}
                  variant="ghost"
                  size="sm"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <ChevronLeft className="w-4 h-4 rotate-90" />
                </Button>
                <div className="bg-slate-800 rounded-lg px-6 py-4 text-center">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={selectedTime.minutes}
                    onChange={(e) => handleTimeChange('minutes', e.target.value)}
                    className="w-16 bg-transparent text-white text-3xl font-bold text-center outline-none"
                  />
                  <p className="text-xs text-slate-400 mt-1">Minutes</p>
                </div>
                <Button
                  onClick={() => handleTimeChange('minutes', (parseInt(selectedTime.minutes) - 1 + 60) % 60)}
                  variant="ghost"
                  size="sm"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <ChevronLeft className="w-4 h-4 -rotate-90" />
                </Button>
              </div>
            </div>
          </div>

          {/* Time Display */}
          <div className="bg-slate-800 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-400">Selected Time</p>
            <p className="text-white font-semibold text-2xl">
              {selectedTime.hours}:{selectedTime.minutes}
            </p>
          </div>

          {/* Full DateTime Display */}
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-400">Hackathon End Time</p>
            <p className="text-cyan-400 font-semibold">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}{' '}
              at {selectedTime.hours}:{selectedTime.minutes}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={() => setView('calendar')} variant="outline" className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleConfirm} className="btn-primary flex-1">
              Confirm Timer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
