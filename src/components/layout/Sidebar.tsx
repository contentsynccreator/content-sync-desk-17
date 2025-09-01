import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Calendar, Settings, PlusCircle, Lightbulb, Target, Users, Shield } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export const Sidebar = () => {
  const { videos, canais, usuarios, ideias } = useApp();
  const location = useLocation();
  
  // Calcular estatísticas dinâmicas
  const videosEmProducao = videos.filter(v => !['pronto', 'agendado', 'publicado'].includes(v.status)).length;
  const videosProntos = videos.filter(v => v.status === 'pronto' && v.thumbnail_pronta).length;
  const canaisAtivos = canais.length;
  const totalIdeias = ideias.length;
  const colaboradores = usuarios.length;
  
  const menuItems = [
    {
      path: '/',
      label: 'Produção',
      icon: LayoutGrid,
      description: 'Pipeline Kanban'
    },
    {
      path: '/schedule',
      label: 'Agendamento', 
      icon: Calendar,
      description: 'Calendário & Fila'
    },
    {
      path: '/channel-ideas',
      label: 'Ideias de Canais',
      icon: Lightbulb,
      description: 'Banco de Ideias'
    },
    {
      path: '/competitor-channels',
      label: 'Concorrentes',
      icon: Target,
      description: 'Análise de Canais'
    },
    {
      path: '/team',
      label: 'Equipe',
      icon: Users,
      description: 'Gestão de Membros'
    },
    {
      path: '/super-admin',
      label: 'Super Admin',
      icon: Shield,
      description: 'Administração'
    }
  ];

  return (
    <div className="w-72 bg-background-secondary border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <PlusCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Dark Channel</h1>
            <p className="text-sm text-muted-foreground">Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item w-full text-left block ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Stats */}
      <div className="p-4 border-t border-border">
        <div className="card-secondary p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Status Geral</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vídeos em Produção</span>
              <span className="text-warning font-medium">{videosEmProducao}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Prontos para Agendar</span>
              <span className="text-success font-medium">{videosProntos}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Canais Ativos</span>
              <span className="text-primary font-medium">{canaisAtivos}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total de Ideias</span>
              <span className="text-secondary font-medium">{totalIdeias}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Colaboradores</span>
              <span className="text-foreground font-medium">{colaboradores}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};