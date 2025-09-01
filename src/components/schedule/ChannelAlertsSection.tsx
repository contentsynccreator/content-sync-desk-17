import React from 'react';
import { AlertTriangle, Clock, Hash } from 'lucide-react';
import { Canal, ScheduledVideo } from '@/contexts/AppContext';

interface ChannelAlert {
  canal: Canal;
  type: 'urgent' | 'warning';
  message: string;
  videosCount: number;
}

interface ChannelAlertsSectionProps {
  canais: Canal[];
  scheduledVideos: ScheduledVideo[];
}

export const ChannelAlertsSection: React.FC<ChannelAlertsSectionProps> = ({
  canais,
  scheduledVideos
}) => {
  const getChannelAlerts = (): ChannelAlert[] => {
    const now = new Date();
    const alerts: ChannelAlert[] = [];

    canais.forEach(canal => {
      // Filtrar vídeos agendados apenas para este canal específico
      const videosDoCanal = scheduledVideos.filter(sv => {
        return sv.canal_nome === canal.nome;
      });
      
      const futuros = videosDoCanal.filter(sv => {
        const dataAgendada = new Date(sv.data_agendada);
        return dataAgendada >= now;
      });

      const tipo = canal.alarme_tipo || 'dias';

      if (tipo === 'quantidade') {
        const minimo = canal.alarme_minimo_videos || 3;
        if (futuros.length < minimo) {
          alerts.push({
            canal,
            type: futuros.length === 0 ? 'urgent' : 'warning',
            message: futuros.length === 0 
              ? 'Nenhum vídeo agendado' 
              : `Apenas ${futuros.length}/${minimo} vídeos agendados`,
            videosCount: futuros.length
          });
        }
      } else {
        if (futuros.length === 0) {
          alerts.push({
            canal,
            type: 'urgent',
            message: 'Sem vídeos agendados',
            videosCount: 0
          });
        } else {
          const proximo = futuros
            .sort((a, b) => new Date(a.data_agendada).getTime() - new Date(b.data_agendada).getTime())[0];
          
          if (proximo) {
            const dataProximo = new Date(proximo.data_agendada);
            const diffDays = Math.ceil((dataProximo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            const diasUrgente = canal.alarme_urgente_dias || 2;
            const diasAlerta = canal.alarme_alerta_dias || 5;
            
            if (diffDays <= diasUrgente) {
              alerts.push({
                canal,
                type: 'urgent',
                message: `Próximo vídeo em ${diffDays} dia(s)`,
                videosCount: futuros.length
              });
            } else if (diffDays <= diasAlerta) {
              alerts.push({
                canal,
                type: 'warning',
                message: `Próximo vídeo em ${diffDays} dia(s)`,
                videosCount: futuros.length
              });
            }
          }
        }
      }
    });

    // Ordenar por urgência (urgent primeiro, depois warning)
    return alerts.sort((a, b) => {
      if (a.type === 'urgent' && b.type === 'warning') return -1;
      if (a.type === 'warning' && b.type === 'urgent') return 1;
      return 0;
    });
  };

  const alerts = getChannelAlerts();

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="card-primary p-4 border-l-4 border-warning mb-6">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-warning" />
        <h3 className="text-lg font-semibold text-foreground">
          Alertas de Agendamento ({alerts.length})
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border-l-4 ${
              alert.type === 'urgent' 
                ? 'bg-destructive/10 border-destructive' 
                : 'bg-warning/10 border-warning'
            }`}
          >
            <div className="flex items-start gap-3">
              <div 
                className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0"
                style={{ backgroundColor: alert.canal.cor }}
              ></div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground truncate">
                    {alert.canal.nome}
                  </h4>
                  {alert.type === 'urgent' ? (
                    <Clock className="w-4 h-4 text-destructive flex-shrink-0" />
                  ) : (
                    <Hash className="w-4 h-4 text-warning flex-shrink-0" />
                  )}
                </div>
                
                <p className={`text-sm mt-1 ${
                  alert.type === 'urgent' ? 'text-destructive' : 'text-warning'
                }`}>
                  {alert.message}
                </p>
                
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {alert.videosCount} vídeos agendados
                  </span>
                  <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    alert.type === 'urgent' 
                      ? 'bg-destructive/20 text-destructive' 
                      : 'bg-warning/20 text-warning'
                  }`}>
                    {alert.type === 'urgent' ? 'URGENTE' : 'ALERTA'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          💡 Dica: Mantenha sempre vídeos agendados para evitar interrupções na publicação dos seus canais
        </p>
      </div>
    </div>
  );
};