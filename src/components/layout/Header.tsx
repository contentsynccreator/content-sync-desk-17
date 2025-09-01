
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Menu, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleSuperAdminClick = () => {
    navigate('/super-admin');
  };

  return (
    <header className="bg-background border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-foreground">ContentFlow</h1>
          <span className="text-sm text-muted-foreground">
            Sistema de Gestão de Conteúdo
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Super Admin Button - Temporariamente visível para todos */}
        <button
          onClick={handleSuperAdminClick}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          title="Super Admin Dashboard"
        >
          <Crown className="w-4 h-4" />
          <span className="hidden sm:inline">Super Admin</span>
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Olá,</span>
          <span className="font-medium text-foreground">
            {user?.user_metadata?.nome || user?.email}
          </span>
        </div>
        
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
};
