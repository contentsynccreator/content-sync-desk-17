import { useState } from 'react';
import { Plus, Check, X, Lightbulb, ArrowRight, Grid3X3, List, Trash2, Edit, Copy, Undo } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

export const IdeasBank = () => {
  const { ideias, canais, addIdeia, updateIdeia, deleteIdeia, approveIdeaToProduction } = useApp();
  const [selectedChannel, setSelectedChannel] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIdea, setNewIdea] = useState({ titulo: '', descricao: '', canal_id: canais[0]?.id || '1' });

  const handleApproveIdea = (ideaId: string) => {
    if (confirm('Aprovar esta ideia irá movê-la para o início da produção. Confirmar?')) {
      approveIdeaToProduction(ideaId);
    }
  };

  const handleRejectIdea = (ideaId: string) => {
    updateIdeia(ideaId, { status: 'rejeitada' });
  };

  const handleDeleteIdea = (ideaId: string) => {
    if (confirm('Tem certeza que deseja excluir esta ideia?')) {
      deleteIdeia(ideaId);
    }
  };

  const copyContent = (idea: any) => {
    const content = `${idea.titulo}\n\n${idea.descricao}`;
    navigator.clipboard.writeText(content);
    toast({
      title: "Conteúdo copiado!",
      description: "Título e descrição copiados para a área de transferência"
    });
  };

  const handleIdeaClick = (idea: any) => {
    copyContent(idea);
  };

  const revertIdea = async (ideaId: string) => {
    if (!confirm('Tem certeza que deseja reverter esta ideia aprovada?')) return;
    
    try {
      await updateIdeia(ideaId, { status: 'pendente' });
      toast({
        title: "Ideia revertida!",
        description: "A ideia foi revertida para o banco de ideias"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao reverter ideia",
        variant: "destructive"
      });
    }
  };

  const handleAddIdea = () => {
    if (!newIdea.titulo.trim()) return;
    
    const canal = canais.find(c => c.id === newIdea.canal_id);
    if (!canal) return;

    const ideiaData = {
      titulo: newIdea.titulo,
      descricao: newIdea.descricao,
      canal_id: newIdea.canal_id,
      canal_nome: canal.nome,
      canal_cor: canal.cor,
      data_criacao: new Date(),
      status: 'pendente' as const,
    };

    addIdeia(ideiaData);
    setNewIdea({ titulo: '', descricao: '', canal_id: canais[0]?.id || '1' });
    setShowAddForm(false);
  };

  const filteredIdeias = ideias.filter(idea => {
    const channelMatch = selectedChannel === 'todos' || idea.canal_id === selectedChannel;
    const statusMatch = selectedStatus === 'todos' || idea.status === selectedStatus;
    return channelMatch && statusMatch;
  });

  const groupedByChannel = canais.map(canal => ({
    ...canal,
    ideias: filteredIdeias.filter(idea => idea.canal_id === canal.id),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Banco de Ideias</h1>
        </div>
        
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Ideia
        </button>
      </div>

      {/* Filters */}
      <div className="card-primary p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-foreground">Filtros:</span>
            <select 
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="input-primary"
            >
              <option value="todos">Todos os canais</option>
              {canais.map(canal => (
                <option key={canal.id} value={canal.id}>{canal.nome}</option>
              ))}
            </select>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-primary"
            >
              <option value="todos">Todos os status</option>
              <option value="pendente">Pendentes</option>
              <option value="aprovada">Aprovadas</option>
              <option value="rejeitada">Rejeitadas</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}
              title="Visualizar em grade"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}
              title="Visualizar em lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card-primary p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-foreground mb-4">Nova Ideia</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Canal
                </label>
                <select 
                  value={newIdea.canal_id}
                  onChange={(e) => setNewIdea(prev => ({ ...prev, canal_id: e.target.value }))}
                  className="input-primary w-full"
                >
                  {canais.map(canal => (
                    <option key={canal.id} value={canal.id}>{canal.nome}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Título da Ideia
                </label>
                <input
                  type="text"
                  value={newIdea.titulo}
                  onChange={(e) => setNewIdea(prev => ({ ...prev, titulo: e.target.value }))}
                  className="input-primary w-full"
                  placeholder="Ex: 10 Dicas de Economia..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={newIdea.descricao}
                  onChange={(e) => setNewIdea(prev => ({ ...prev, descricao: e.target.value }))}
                  className="input-primary w-full h-20 resize-none"
                  placeholder="Descreva brevemente a ideia..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddIdea} className="btn-primary flex-1">
                Adicionar Ideia
              </button>
              <button 
                onClick={() => setShowAddForm(false)} 
                className="btn-ghost flex-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ideas Content */}
      {viewMode === 'grid' ? (
        // Grid View by Channel
        <div className="space-y-6">
          {groupedByChannel.map(canal => (
            <div key={canal.id} className="card-primary p-6">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: canal.cor }}
                ></div>
                <h2 className="text-xl font-bold text-foreground">{canal.nome}</h2>
                <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-sm">
                  {canal.ideias.length} ideias
                </span>
              </div>
              
              {canal.ideias.length === 0 ? (
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Nenhuma ideia para este canal</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {canal.ideias.map(idea => (
                    <div 
                      key={idea.id} 
                      className="card-secondary p-4 cursor-pointer hover:bg-card/80 transition-colors"
                      onClick={() => handleIdeaClick(idea)}
                      title="Clique para copiar título e descrição"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-foreground line-clamp-2">
                          {idea.titulo}
                        </h3>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteIdea(idea.id);
                            }}
                            className="text-destructive hover:text-destructive/80 p-1"
                            title="Excluir ideia"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className={`
                        px-2 py-1 rounded-full text-xs font-medium mb-2 inline-block
                        ${idea.status === 'pendente' ? 'bg-warning/20 text-warning' : ''}
                        ${idea.status === 'aprovada' ? 'bg-success/20 text-success' : ''}
                        ${idea.status === 'rejeitada' ? 'bg-destructive/20 text-destructive' : ''}
                      `}>
                        {idea.status === 'pendente' && 'Pendente'}
                        {idea.status === 'aprovada' && 'Aprovada'}
                        {idea.status === 'rejeitada' && 'Rejeitada'}
                      </div>
                      
                      {idea.descricao && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {idea.descricao}
                        </p>
                      )}
                      
                      <div className="text-xs text-muted-foreground mb-3">
                        {idea.data_criacao.toLocaleDateString('pt-BR')}
                      </div>
                      

                      {idea.status === 'pendente' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproveIdea(idea.id);
                            }}
                            className="btn-success text-xs px-3 py-1"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Aprovar
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRejectIdea(idea.id);
                            }}
                            className="btn-destructive text-xs px-3 py-1"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Rejeitar
                          </button>
                        </div>
                      )}

                      {idea.status === 'aprovada' && (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              revertIdea(idea.id);
                            }}
                            className="btn-ghost text-xs px-3 py-1"
                          >
                            <Undo className="w-3 h-3 mr-1" />
                            Reverter
                          </button>
                        </div>
                      )}
                      
                      {idea.status === 'aprovada' && (
                        <div className="flex items-center gap-2 text-success text-sm">
                          <ArrowRight className="w-4 h-4" />
                          <span>Pronta para produção</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="card-primary overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-tertiary">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Título</th>
                  <th className="text-left p-4 font-medium text-foreground">Canal</th>
                  <th className="text-left p-4 font-medium text-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-foreground">Data</th>
                  <th className="text-left p-4 font-medium text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredIdeias.map((idea, index) => (
                  <tr
                    key={idea.id}
                    className={`border-t border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                      index % 2 === 0 ? 'bg-background' : 'bg-background-secondary'
                    }`}
                    onClick={() => handleIdeaClick(idea)}
                    title="Clique para copiar título e descrição"
                  >
                    <td className="p-4">
                      <div>
                        <h4 className="font-medium text-foreground">{idea.titulo}</h4>
                        {idea.descricao && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {idea.descricao}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: idea.canal_cor }}
                        ></div>
                        <span className="text-foreground">{idea.canal_nome}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`
                        px-2 py-1 rounded-full text-xs font-medium inline-block
                        ${idea.status === 'pendente' ? 'bg-warning/20 text-warning' : ''}
                        ${idea.status === 'aprovada' ? 'bg-success/20 text-success' : ''}
                        ${idea.status === 'rejeitada' ? 'bg-destructive/20 text-destructive' : ''}
                      `}>
                        {idea.status === 'pendente' && 'Pendente'}
                        {idea.status === 'aprovada' && 'Aprovada'}
                        {idea.status === 'rejeitada' && 'Rejeitada'}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {idea.data_criacao.toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {idea.status === 'pendente' && (
                          <>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApproveIdea(idea.id);
                              }}
                              className="btn-success text-xs px-2 py-1"
                              title="Aprovar"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRejectIdea(idea.id);
                              }}
                              className="btn-destructive text-xs px-2 py-1"
                              title="Rejeitar"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        )}
                        
                        {idea.status === 'aprovada' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              revertIdea(idea.id);
                            }}
                            className="btn-ghost text-xs px-2 py-1"
                            title="Reverter"
                          >
                            <Undo className="w-3 h-3" />
                          </button>
                        )}
                        
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             handleDeleteIdea(idea.id);
                           }}
                           className="btn-ghost p-1 text-destructive"
                           title="Excluir"
                         >
                           <Trash2 className="w-3 h-3" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredIdeias.length === 0 && (
              <div className="text-center py-12">
                <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Nenhuma ideia encontrada</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};