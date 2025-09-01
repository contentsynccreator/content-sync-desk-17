import { useState } from 'react';
import { MoreHorizontal, User, Trash2, ArrowLeft, Check } from 'lucide-react';
import { useApp, type Video, type Usuario } from '@/contexts/AppContext';

interface VideoCardActionsProps {
  video: Video;
  onThumbnailToggle: (videoId: string) => void;
}

export const VideoCardActions = ({ video, onThumbnailToggle }: VideoCardActionsProps) => {
  const { usuarios, updateVideo, deleteVideo, moveVideoToIdeas } = useApp();
  const [showActions, setShowActions] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>(video.responsavel_id || '');

  const handleAssignUser = () => {
    const usuario = usuarios.find(u => u.id === selectedUser);
    updateVideo(video.id, {
      responsavel_id: selectedUser || undefined,
      responsavel_nome: usuario?.nome || undefined,
    });
    setShowAssignModal(false);
    setShowActions(false);
  };

  const handleDeleteVideo = () => {
    if (confirm('Tem certeza que deseja excluir este vídeo?')) {
      deleteVideo(video.id);
      setShowActions(false);
    }
  };

  const handleMoveToIdeas = () => {
    if (confirm('Retornar este vídeo para o banco de ideias?')) {
      moveVideoToIdeas(video.id);
      setShowActions(false);
    }
  };

  return (
    <div className="absolute top-2 right-2 z-30">
      {/* Actions Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowActions(!showActions);
        }}
        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {/* Actions Menu */}
      {showActions && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowActions(false)}
          />
          <div className="absolute top-8 right-0 z-50 bg-card border border-border rounded-md shadow-lg py-1 min-w-[140px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAssignModal(true);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
            >
              <User className="w-3 h-3" />
              Atribuir
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMoveToIdeas();
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
            >
              <ArrowLeft className="w-3 h-3" />
              Voltar p/ Ideias
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteVideo();
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted text-destructive flex items-center gap-2"
            >
              <Trash2 className="w-3 h-3" />
              Excluir
            </button>
          </div>
        </>
      )}

      {/* Assign User Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card-primary p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Atribuir Responsável
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {video.titulo}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Responsável
                </label>
                <select 
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="input-primary w-full"
                >
                  <option value="">Nenhum responsável</option>
                  {usuarios.map(usuario => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nome} - {usuario.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={handleAssignUser} className="btn-primary flex-1">
                Confirmar
              </button>
              <button 
                onClick={() => {
                  setShowAssignModal(false);
                  setShowActions(false);
                }} 
                className="btn-ghost flex-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};