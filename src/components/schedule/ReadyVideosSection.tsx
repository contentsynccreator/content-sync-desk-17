
import React from 'react';
import { Play } from 'lucide-react';
import { Video, Canal } from '@/contexts/AppContext';
import { getNextAvailableSlot } from '@/utils/scheduleSlots';

interface ReadyVideosSectionProps {
  readyVideos: Video[];
  canais: Canal[];
  scheduledVideos: any[];
  onScheduleVideo: (videoId: string) => void;
}

export const ReadyVideosSection: React.FC<ReadyVideosSectionProps> = ({
  readyVideos,
  canais,
  scheduledVideos,
  onScheduleVideo
}) => {
  const getNextSlot = (canalId: string) => {
    const canal = canais.find(c => c.id === canalId);
    if (!canal) return null;
    
    const occupiedSlots = scheduledVideos.map(sv => ({
      data_agendada: sv.data_agendada,
      hora_agendada: sv.hora_agendada
    }));
    
    const normalized = { ...canal, dias_postagem: (canal.dias_postagem || []).map(d => d.toLowerCase()) } as Canal;
    return getNextAvailableSlot(normalized, occupiedSlots);
  };

  return (
    <div className="card-primary p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Vídeos Prontos para Agendar</h2>
      
      {readyVideos.length === 0 ? (
        <div className="text-center py-8">
          <Play className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Nenhum vídeo pronto para agendamento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {readyVideos.map(video => {
            const nextSlot = getNextSlot(video.canal_id);
            const canal = canais.find(c => c.id === video.canal_id);
            
            // Alarmes por canal - CORRIGIDO
            const now = new Date();
            let alarmBadge: { className: string; text: string } | null = null;
            
            if (canal) {
              const tipo = canal.alarme_tipo || 'dias';
              
              // Filtrar vídeos agendados apenas para este canal específico
              const videosDoCanal = scheduledVideos.filter(sv => {
                // Usar tanto canal_nome quanto id para máxima compatibilidade
                return sv.canal_nome === canal.nome || 
                       (sv.canal_id && sv.canal_id === canal.id);
              });
              
              const futuros = videosDoCanal.filter(sv => {
                const dataAgendada = new Date(sv.data_agendada);
                return dataAgendada >= now;
              });
              
              console.log('🔍 Canal:', canal.nome, 'Videos do canal:', videosDoCanal.length, 'Futuros:', futuros.length);
              
              if (tipo === 'quantidade') {
                const minimo = canal.alarme_minimo_videos || 3;
                if (futuros.length < minimo) {
                  alarmBadge = { 
                    className: 'bg-warning/20 text-warning', 
                    text: `Alerta: ${futuros.length}/${minimo} agendados` 
                  };
                }
              } else {
                if (futuros.length === 0) {
                  alarmBadge = { 
                    className: 'bg-destructive/20 text-destructive', 
                    text: 'Urgente: sem vídeos agendados' 
                  };
                } else {
                  const proximo = futuros
                    .sort((a: any, b: any) => new Date(a.data_agendada).getTime() - new Date(b.data_agendada).getTime())[0];
                  
                  if (proximo) {
                    const dataProximo = new Date(proximo.data_agendada);
                    const diffDays = Math.ceil((dataProximo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    
                    const diasUrgente = canal.alarme_urgente_dias || 2;
                    const diasAlerta = canal.alarme_alerta_dias || 5;
                    
                    if (diffDays <= diasUrgente) {
                      alarmBadge = { 
                        className: 'bg-destructive/20 text-destructive', 
                        text: `Urgente: ${diffDays} dia(s)` 
                      };
                    } else if (diffDays <= diasAlerta) {
                      alarmBadge = { 
                        className: 'bg-warning/20 text-warning', 
                        text: `Alerta: ${diffDays} dia(s)` 
                      };
                    }
                  }
                }
              }
            }
            
            return (
              <div key={video.id} className="card-secondary p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-foreground line-clamp-2">{video.titulo}</h3>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: canal?.cor || 'hsl(var(--primary))' }}
                  ></div>
                  <span className="text-sm text-foreground">{video.canal_nome}</span>
                </div>
                
                <div className="text-xs text-muted-foreground mb-3">
                  {nextSlot 
                    ? `Próximo slot: ${nextSlot.date.toLocaleDateString('pt-BR')} às ${nextSlot.time}` 
                    : 'Nenhum slot disponível'
                  }
                </div>

                {alarmBadge && (
                  <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium mb-3 ${alarmBadge.className}`}>
                    {alarmBadge.text}
                  </div>
                )}
                
                <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium mb-3 ${
                  video.thumbnail_pronta ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                }`}>
                  Thumbnail: {video.thumbnail_pronta ? 'Pronta' : 'Pendente'}
                </div>
                
                <button
                  onClick={() => onScheduleVideo(video.id)}
                  className="btn-primary w-full text-xs"
                >
                  Agendar
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
