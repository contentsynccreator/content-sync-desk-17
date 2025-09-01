import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface ScheduleCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  scheduledVideos: any[];
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  selectedDate,
  onDateSelect,
  scheduledVideos
}) => {
  const handleDateSelect = (date: Date | undefined) => {
    console.log('📅 Data clicada no calendário:', date);
    onDateSelect(date);
  };

  return (
    <div className="card-primary p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Calendário</h2>
      <CalendarComponent
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        className={cn("rounded-md border-0 pointer-events-auto")}
        modifiers={{
          hasVideos: scheduledVideos.map(v => v.data_agendada)
        }}
        modifiersStyles={{
          hasVideos: { 
            backgroundColor: 'hsl(var(--primary))', 
            color: 'white',
            fontWeight: 'bold'
          }
        }}
        components={{
          Day: ({ date, ...props }) => {
            const videosForDay = scheduledVideos.filter(v => 
              isSameDay(v.data_agendada, date)
            );
            
            if (videosForDay.length === 0) {
              return <button {...props} onClick={() => handleDateSelect(date)}>{date.getDate()}</button>;
            }

            // Get unique colors for the day
            const uniqueColors = [...new Set(videosForDay.map(v => v.canal_cor))];
            
            return (
              <div className="relative">
                <button {...props} onClick={() => handleDateSelect(date)}>{date.getDate()}</button>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                  {uniqueColors.slice(0, 3).map((cor, index) => (
                    <div
                      key={index}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: cor }}
                    />
                  ))}
                  {uniqueColors.length > 3 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                  )}
                </div>
              </div>
            );
          }
        }}
      />
    </div>
  );
};