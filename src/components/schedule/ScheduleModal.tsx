import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Video } from '@/contexts/AppContext';
import { getNextAvailableSlot } from '@/utils/scheduleSlots';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
  readyVideos: Video[];
  canais: any[];
  scheduledVideos: any[];
  onSchedule: (videoId: string, date: Date, time: string, youtubeLink: string) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  video,
  readyVideos,
  canais,
  scheduledVideos,
  onSchedule
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(new Date());
  const [scheduleTime, setScheduleTime] = useState<string>('09:00');
  const [youtubeLink, setYoutubeLink] = useState<string>('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (video) {
        setSelectedVideo(video.id);
        const canal = canais.find(c => c.id === video.canal_id);
        if (canal) {
          const occupiedSlots = scheduledVideos.map(sv => ({
            data_agendada: sv.data_agendada,
            hora_agendada: sv.hora_agendada
          }));
          const normalized = { ...canal, dias_postagem: (canal.dias_postagem || []).map(d => d.toLowerCase()) } as any;
          const nextSlot = getNextAvailableSlot(normalized, occupiedSlots);
          if (nextSlot) {
            setScheduleDate(nextSlot.date);
            setScheduleTime(nextSlot.time);
          }
        }
      } else {
        setSelectedVideo('');
      }
      setYoutubeLink('');
    }
  }, [isOpen, video, canais, scheduledVideos]);

  // Sugere automaticamente o próximo slot ao selecionar um vídeo no modal
  useEffect(() => {
    if (!selectedVideo) return;
    const v = readyVideos.find(rv => rv.id === selectedVideo);
    if (!v) return;
    const canal = canais.find(c => c.id === v.canal_id);
    if (!canal) return;
    const occupiedSlots = scheduledVideos.map(sv => ({
      data_agendada: sv.data_agendada,
      hora_agendada: sv.hora_agendada
    }));
    const normalized = { ...canal, dias_postagem: (canal.dias_postagem || []).map((d: string) => d.toLowerCase()) } as any;
    const nextSlot = getNextAvailableSlot(normalized, occupiedSlots);
    if (nextSlot) {
      setScheduleDate(nextSlot.date);
      setScheduleTime(nextSlot.time);
    }
  }, [selectedVideo, canais, scheduledVideos, readyVideos]);
 
   const handleSubmit = () => {
    if (!selectedVideo || !scheduleDate || !scheduleTime) return;
    
    onSchedule(selectedVideo, scheduleDate, scheduleTime, youtubeLink);
    onClose();
  };

  const resetForm = () => {
    setSelectedVideo('');
    setScheduleDate(new Date());
    setScheduleTime('09:00');
    setYoutubeLink('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card-primary p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Agendar Vídeo</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Vídeo
            </label>
            <select 
              value={selectedVideo}
              onChange={(e) => setSelectedVideo(e.target.value)}
              className="input-primary w-full"
            >
              <option value="">Selecione um vídeo</option>
              {readyVideos.map(video => (
                <option key={video.id} value={video.id}>
                  {video.titulo} - {video.canal_nome}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Data
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !scheduleDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {scheduleDate ? format(scheduleDate, 'dd/MM/yyyy') : 'Selecione a data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border border-border shadow-lg z-[60]" align="start">
                <CalendarComponent
                  mode="single"
                  selected={scheduleDate}
                  onSelect={setScheduleDate}
                  disabled={(date) => date < startOfDay(new Date())}
                  initialFocus
                  className={cn("p-3 pointer-events-auto bg-card")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Horário
            </label>
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="input-primary w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Link do YouTube (opcional)
            </label>
            <input
              type="url"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="input-primary w-full"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button 
            onClick={handleSubmit} 
            className="flex-1"
            disabled={!selectedVideo || !scheduleDate || !scheduleTime}
          >
            Confirmar Agendamento
          </Button>
          <Button 
            variant="outline"
            onClick={resetForm} 
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};