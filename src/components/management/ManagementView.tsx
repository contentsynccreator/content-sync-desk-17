import { useState } from 'react';
import { Settings } from 'lucide-react';
import { CanaisSection } from './CanaisSection';
import { EquipeSection } from './EquipeSection';

export const ManagementView = () => {
  const [activeTab, setActiveTab] = useState('canais');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Gerenciamento</h1>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('canais')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'canais'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
            }`}
          >
            Canais
          </button>
          <button
            onClick={() => setActiveTab('equipe')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'equipe'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
            }`}
          >
            Equipe
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'canais' && <CanaisSection />}
      {activeTab === 'equipe' && <EquipeSection />}
    </div>
  );
};