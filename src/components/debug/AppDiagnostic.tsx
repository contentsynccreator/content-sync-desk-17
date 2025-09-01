import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';

export const AppDiagnostic = () => {
  const { user } = useAuth();
  const { canais, videos, ideias, scheduledVideos, loading } = useApp();

  const diagnostics = [
    {
      category: 'Autenticação',
      items: [
        {
          label: 'Usuário logado',
          status: user ? 'success' : 'error',
          message: user ? `Logado como: ${user.email}` : 'Nenhum usuário logado'
        }
      ]
    },
    {
      category: 'Dados da Aplicação',
      items: [
        {
          label: 'Estado de carregamento',
          status: loading ? 'warning' : 'success',
          message: loading ? 'Carregando dados...' : 'Dados carregados'
        },
        {
          label: 'Canais cadastrados',
          status: canais.length > 0 ? 'success' : 'warning',
          message: `${canais.length} canais encontrados`
        },
        {
          label: 'Vídeos em produção',
          status: videos.length > 0 ? 'success' : 'info',
          message: `${videos.length} vídeos em produção`
        },
        {
          label: 'Ideias no banco',
          status: ideias.length > 0 ? 'success' : 'info',
          message: `${ideias.length} ideias cadastradas`
        },
        {
          label: 'Vídeos agendados',
          status: scheduledVideos.length > 0 ? 'success' : 'info',
          message: `${scheduledVideos.length} vídeos agendados`
        }
      ]
    },
    {
      category: 'Sistema de Alarmes',
      items: [
        {
          label: 'Configuração de alarmes',
          status: canais.some(c => c.alarme_tipo) ? 'success' : 'warning',
          message: canais.some(c => c.alarme_tipo) 
            ? `${canais.filter(c => c.alarme_tipo).length} canais com alarmes configurados`
            : 'Nenhum canal com alarme configurado'
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-primary p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Diagnóstico do Sistema</h2>
        
        {diagnostics.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <h3 className="text-lg font-medium text-foreground mb-3">{category.category}</h3>
            <div className="space-y-2">
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`p-3 border-l-4 rounded-r ${getStatusColor(item.status)}`}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <div className="font-medium text-foreground">{item.label}</div>
                      <div className="text-sm text-muted-foreground">{item.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Debug Information */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Informações de Debug</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>Timestamp: {new Date().toISOString()}</div>
            <div>User ID: {user?.id || 'N/A'}</div>
            <div>Environment: {import.meta.env.MODE}</div>
          </div>
        </div>
      </div>
    </div>
  );
};