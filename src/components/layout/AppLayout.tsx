import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { 
  LayoutGrid, 
  Calendar, 
  Settings, 
  Lightbulb, 
  Target, 
  Users, 
  User,
  LogOut,
  Search,
  Filter,
  Plus,
  PlusCircle,
  Menu,
  X,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    id: 'ideas',
    label: 'Banco de Ideias',
    icon: Lightbulb,
    path: '/',
    description: 'Gestão de Ideias'
  },
  {
    id: 'kanban',
    label: 'Produção',
    icon: LayoutGrid,
    path: '/',
    description: 'Pipeline Kanban'
  },
  {
    id: 'schedule',
    label: 'Agendamento',
    icon: Calendar,
    path: '/',
    description: 'Calendário & Fila'
  },
  {
    id: 'management',
    label: 'Gerenciamento',
    icon: Settings,
    path: '/',
    description: 'Canais'
  },
  {
    id: 'channel-ideas',
    label: 'Ideias de Canais',
    icon: Target,
    path: '/channel-ideas',
    description: 'Novos Projetos'
  },
  {
    id: 'competitors',
    label: 'Concorrentes',
    icon: Users,
    path: '/competitor-channels',
    description: 'Análise de Mercado'
  },
  {
    id: 'team',
    label: 'Equipe',
    icon: Users,
    path: '/team',
    description: 'Gestão da Equipe'
  },
  {
    id: 'profile',
    label: 'Perfil',
    icon: User,
    path: '/profile',
    description: 'Configurações Pessoais'
  }
];

const AppSidebar = ({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) => {
  const { signOut, user } = useAuth();
  const { videos, canais, usuarios, ideias } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Calcular estatísticas dinâmicas
  const videosEmProducao = videos.filter(v => !['pronto', 'agendado', 'publicado'].includes(v.status)).length;
  const videosProntos = videos.filter(v => v.status === 'pronto' && v.thumbnail_pronta).length;
  const canaisAtivos = canais.length;
  const totalIdeias = ideias.length;
  const colaboradores = usuarios.length;

  const isActive = (item: typeof navigationItems[0]) => {
    if (item.path === '/') {
      // For home page items, check both pathname and state view
      return location.pathname === '/' && location.state?.view === item.id;
    }
    return location.pathname === item.path;
  };

  const handleNavigation = (item: typeof navigationItems[0]) => {
    if (item.path === '/') {
      navigate('/', { state: { view: item.id } });
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className={cn(
      "bg-background-secondary border-r border-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-72"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <PlusCircle className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-foreground">Dark Channel</h1>
              <p className="text-sm text-muted-foreground">Manager</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                  active 
                    ? "bg-primary/10 text-primary border-r-2 border-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-60">{item.description}</div>
                  </div>
                )}
              </button>
            );
          })}

          {/* Super Admin Button - Only show for super admin users */}
          {user?.user_metadata?.role === 'super_admin' && (
            <button
              onClick={() => navigate('/super-admin')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                location.pathname === '/super-admin'
                  ? "bg-primary/10 text-primary border-r-2 border-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Crown className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <div>
                  <div className="font-medium">Super Admin</div>
                  <div className="text-xs opacity-60">Painel Administrativo</div>
                </div>
              )}
            </button>
          )}
        </nav>

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={signOut}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
              "text-red-500 hover:text-red-600 hover:bg-accent"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <div>
                <div className="font-medium">Sair</div>
                <div className="text-xs opacity-60">Logout</div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      {!collapsed && (
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
      )}
    </div>
  );
};

const AppHeader = ({ onToggleSidebar, sidebarCollapsed }: { onToggleSidebar: () => void; sidebarCollapsed: boolean }) => {
  const location = useLocation();
  
  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Banco de Ideias';
      case '/channel-ideas':
        return 'Ideias de Novos Canais';
      case '/competitor-channels':
        return 'Canais Concorrentes';
      case '/team':
        return 'Gestão da Equipe';
      case '/profile':
        return 'Meu Perfil';
      case '/super-admin':
        return 'Super Admin Dashboard';
      default:
        return 'Dark Channel Manager';
    }
  };

  const getDescription = () => {
    switch (location.pathname) {
      case '/':
        return 'Gerencie e aprove ideias para seus canais';
      case '/channel-ideas':
        return 'Gerencie ideias para futuros projetos de canais';
      case '/competitor-channels':
        return 'Mantenha um banco de dados de canais para inspiração e análise';
      case '/team':
        return 'Gerencie os membros da sua equipe de produção';
      case '/profile':
        return 'Gerencie suas informações pessoais';
      case '/super-admin':
        return 'Controle administrativo total da plataforma';
      default:
        return 'Sistema de gestão para canais faceless';
    }
  };

  return (
    <header className="bg-background-secondary border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{getTitle()}</h1>
            <p className="text-muted-foreground mt-1">{getDescription()}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              className="input-primary pl-10 w-64"
            />
          </div>

          {/* Filter */}
          <button className="btn-ghost">
            <Filter className="w-4 h-4" />
          </button>

          {/* Add Button */}
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </button>
        </div>
      </div>
    </header>
  );
};

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <main className="flex-1 flex flex-col">
        <AppHeader onToggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
        <div className="flex-1 p-6 overflow-auto">
          <div className="fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};