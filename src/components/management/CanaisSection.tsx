import { useState } from 'react';
import { Plus, Edit, Trash2, Upload, Globe, BarChart3, Clock, Calendar } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { CanalForm } from '@/components/forms/CanalForm';
import { Canal } from '@/contexts/AppContext';

export const CanaisSection = () => {
  const { canais, addCanal, updateCanal, deleteCanal } = useApp();
  const [showCanalForm, setShowCanalForm] = useState(false);
  const [editingCanal, setEditingCanal] = useState<Canal | null>(null);

  const handleAddCanal = () => {
    setEditingCanal(null);
    setShowCanalForm(true);
  };

  const handleEditCanal = (canal: Canal) => {
    setEditingCanal(canal);
    setShowCanalForm(true);
  };

  const handleDeleteCanal = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este canal? Todos os vídeos e ideias relacionados serão perdidos.')) {
      await deleteCanal(id);
    }
  };

  const handleCanalSubmit = async (canalData: Omit<Canal, 'id'>) => {
    try {
      if (editingCanal) {
        await updateCanal(editingCanal.id, canalData);
      } else {
        await addCanal(canalData);
      }
      setShowCanalForm(false);
      setEditingCanal(null);
    } catch (error) {
      console.error('Erro ao salvar canal:', error);
    }
  };

  const handleCanalCancel = () => {
    setShowCanalForm(false);
    setEditingCanal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Canais</h2>
        <button onClick={handleAddCanal} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Canal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {canais.map((canal) => (
          <div key={canal.id} className="card-primary p-6">
            {/* Canal Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {canal.logo_url ? (
                    <img 
                      src={canal.logo_url} 
                      alt={`Logo ${canal.nome}`}
                      className="w-12 h-12 rounded-lg object-cover border-2 border-border"
                    />
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: canal.cor }}
                    >
                      <span className="text-white font-bold text-lg">
                        {canal.nome.charAt(0)}
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    id={`logo-upload-${canal.id}`}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const imageUrl = event.target?.result as string;
                          updateCanal(canal.id, { logo_url: imageUrl });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label 
                    htmlFor={`logo-upload-${canal.id}`}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors"
                    title="Alterar logo do canal"
                  >
                    <Upload className="w-3 h-3 text-white" />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{canal.nome}</h3>
                  {canal.link && (
                    <a
                      href={canal.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {canal.link}
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditCanal(canal)} 
                  className="btn-ghost p-2"
                  title="Editar canal"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteCanal(canal.id)} 
                  className="btn-ghost p-2 text-destructive"
                  title="Excluir canal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Canal Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div 
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: canal.cor }}
                ></div>
                <span className="text-muted-foreground">Cor do canal</span>
              </div>

              {canal.lingua && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Língua:</span>
                  <span className="text-foreground">{canal.lingua}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Frequência:</span>
                <span className="text-foreground">{canal.freq_postagem}</span>
              </div>

              {canal.dias_postagem && canal.dias_postagem.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Dias:</span>
                  <div className="flex gap-1">
                    {canal.dias_postagem.map((dia) => (
                      <span key={dia} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                        {dia}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {canal.horarios_postagem && canal.horarios_postagem.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Horários:</span>
                  <div className="flex gap-1">
                    {canal.horarios_postagem.map((horario) => (
                      <span key={horario} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                        {horario}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Nicho Hierarchy */}
            {(canal.nicho || canal.sub_nicho || canal.micro_nicho) && (
              <div className="mt-4 p-3 bg-background-tertiary rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-2">Categorização</h4>
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  {canal.nicho && (
                    <>
                      <span className="bg-primary/20 text-primary px-2 py-1 rounded">
                        {canal.nicho}
                      </span>
                      {(canal.sub_nicho || canal.micro_nicho) && <span className="text-muted-foreground">→</span>}
                    </>
                  )}
                  {canal.sub_nicho && (
                    <>
                      <span className="bg-secondary/20 text-secondary px-2 py-1 rounded">
                        {canal.sub_nicho}
                      </span>
                      {canal.micro_nicho && <span className="text-muted-foreground">→</span>}
                    </>
                  )}
                  {canal.micro_nicho && (
                    <span className="bg-success/20 text-success px-2 py-1 rounded">
                      {canal.micro_nicho}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Alarm Settings */}
            {canal.alarme_tipo && (
              <div className="mt-4 p-3 bg-accent rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-2">Configurações de Alerta</h4>
                <div className="text-xs text-muted-foreground">
                  {canal.alarme_tipo === 'dias' ? (
                    <>
                      Urgente: {canal.alarme_urgente_dias || 2} dias • 
                      Alerta: {canal.alarme_alerta_dias || 5} dias
                    </>
                  ) : (
                    <>
                      Mínimo de {canal.alarme_minimo_videos || 3} vídeos agendados
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {canais.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum canal cadastrado</h3>
          <p className="text-muted-foreground mb-4">
            Crie seu primeiro canal para começar a gerenciar conteúdo
          </p>
          <button onClick={handleAddCanal} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Canal
          </button>
        </div>
      )}

      {/* Forms */}
      {showCanalForm && (
        <CanalForm
          canal={editingCanal || undefined}
          onSubmit={handleCanalSubmit}
          onCancel={handleCanalCancel}
        />
      )}
    </div>
  );
};