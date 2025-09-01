
import { useState } from 'react';
import { Calendar, CalendarPlus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { ScheduleModal } from './ScheduleModal';
import { ReadyVideosSection } from './ReadyVideosSection';
import { ScheduleCalendar } from './ScheduleCalendar';
import { DaySchedule } from './DaySchedule';
import { ChannelAlertsSection } from './ChannelAlertsSection';

export const ScheduleView = () => {
  const { videos, canais, scheduledVideos, scheduleVideo, unscheduleVideo } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedVideoForModal, setSelectedVideoForModal] = useState<any>(null);

  // Videos prontos para agendar (devem estar prontos E ter thumbnail pronta)
  const readyVideos = videos.filter(video => video.status === 'pronto' && video.thumbnail_pronta);

  const handleScheduleVideoFromModal = (videoId: string, date: Date, time: string, youtubeLink: string) => {
    const video = readyVideos.find(v => v.id === videoId);
    if (!video) return;

    scheduleVideo(video, date, time, youtubeLink);
  };

  const openScheduleModal = (videoId?: string) => {
    const video = videoId ? readyVideos.find(v => v.id === videoId) : null;
    setSelectedVideoForModal(video);
    setShowScheduleModal(true);
  };

  const handleUnscheduleVideo = (videoId: string) => {
    if (confirm('Deseja cancelar o agendamento deste vídeo?')) {
      unscheduleVideo(videoId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Agendamento</h1>
        </div>
        
        <button 
          onClick={() => openScheduleModal()}
          className="btn-primary"
          disabled={readyVideos.length === 0}
        >
          <CalendarPlus className="w-4 h-4 mr-2" />
          Agendar Vídeo
        </button>
      </div>

      {/* Channel Alerts */}
      <ChannelAlertsSection 
        canais={canais} 
        scheduledVideos={scheduledVideos} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <ScheduleCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            scheduledVideos={scheduledVideos}
          />
        </div>

        {/* Videos for Selected Date */}
        <div className="lg:col-span-2">
          <DaySchedule
            selectedDate={selectedDate}
            scheduledVideos={scheduledVideos}
            onUnscheduleVideo={handleUnscheduleVideo}
          />
        </div>
      </div>

      {/* Ready Videos Section */}
      <ReadyVideosSection
        readyVideos={readyVideos}
        canais={canais}
        scheduledVideos={scheduledVideos}
        onScheduleVideo={openScheduleModal}
      />

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        video={selectedVideoForModal}
        readyVideos={readyVideos}
        canais={canais}
        scheduledVideos={scheduledVideos}
        onSchedule={handleScheduleVideoFromModal}
      />
    </div>
  );
};
