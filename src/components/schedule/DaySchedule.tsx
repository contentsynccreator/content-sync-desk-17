import React from 'react';
import { Calendar, Clock, ExternalLink } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

interface DayScheduleProps {
  selectedDate: Date | undefined;
  scheduledVideos: any[];
  onUnscheduleVideo: (videoId: string) => void;
}

export const DaySchedule: React.FC<DayScheduleProps> = ({
  selectedDate,
  scheduledVideos,
  onUnscheduleVideo
}) => {
  const videosForSelectedDate = scheduledVideos.filter(video => {
    if (!selectedDate) return false;
    const isSame = isSameDay(video.data_agendada, selectedDate);
    console.log('🎥 Verificando vídeo:', video.titulo, 'Data do vídeo:', format(video.data_agendada, 'dd/MM/yyyy'), 'Data selecionada:', format(selectedDate, 'dd/MM/yyyy'), 'É mesmo dia?', isSame);
    return isSame;
  }).sort((a, b) => a.hora_agendada.localeCompare(b.hora_agendada));

  return (
    <div className="card-primary p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">
        Agendamentos para {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Selecione uma data'}
        {selectedDate && videosForSelectedDate.length > 0 && (
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({videosForSelectedDate.length} vídeo{videosForSelectedDate.length > 1 ? 's' : ''})
          </span>
        )}
      </h2>
      
      {videosForSelectedDate.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Nenhum vídeo agendado para esta data</p>
        </div>
      ) : (
        <div className="space-y-3">
          {videosForSelectedDate.map(video => (
            <div key={video.id} className="card-secondary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: video.canal_cor }}
                ></div>
                <div>
                  <h3 className="font-medium text-foreground">{video.titulo}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{video.canal_nome}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{video.hora_agendada}</span>
                    </div>
                  </div>
                  {video.link_youtube && (
                    <a 
                      href={video.link_youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm flex items-center gap-1 mt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Ver no YouTube
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  video.status === 'agendado' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                }`}>
                  {video.status === 'agendado' ? 'Agendado' : 'Publicado'}
                </div>
                
                {video.status === 'agendado' && (
                  <button
                    onClick={() => onUnscheduleVideo(video.id)}
                    className="btn-ghost text-xs px-2 py-1"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};