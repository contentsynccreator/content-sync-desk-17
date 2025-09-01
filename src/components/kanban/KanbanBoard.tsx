import { useState } from 'react';
import { VideoCard } from './VideoCard';
import { KanbanColumn } from './KanbanColumn';
import { VideoActionModal } from './VideoActionModal';
import { useApp, Video } from '@/contexts/AppContext';
import { Filter } from 'lucide-react';

interface KanbanBoardProps {
  videos?: Video[];
  onVideoUpdate?: (videoId: string, updates: Partial<Video>) => void;
  memberMode?: boolean;
}

const columns = [
  { id: 'ideias', title: 'Início de Produção', status: 'ideias' as const },
  { id: 'roteiro', title: 'Roteiro', status: 'roteiro' as const },
  { id: 'audio', title: 'Áudio', status: 'audio' as const },
  { id: 'edicao', title: 'Edição', status: 'edicao' as const },
  { id: 'pronto', title: 'Pronto para Agendar', status: 'pronto' as const },
];

export const KanbanBoard = ({ 
  videos: propVideos, 
  onVideoUpdate: propOnVideoUpdate, 
  memberMode = false 
}: KanbanBoardProps = {}) => {
  const { videos: contextVideos, canais, usuarios, updateVideo } = useApp();
  
  // Use props if provided (for member mode), otherwise use context
  const videos = propVideos || contextVideos;
  const onVideoUpdate = propOnVideoUpdate || updateVideo;
  const [draggedVideo, setDraggedVideo] = useState<Video | null>(null);
  const [selectedCanal, setSelectedCanal] = useState<string>('todos');
  const [selectedResponsavel, setSelectedResponsavel] = useState<string>('todos');
  const [selectedNicho, setSelectedNicho] = useState<string>('todos');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleDragStart = (video: Video) => {
    setDraggedVideo(video);
  };

  const handleDragEnd = () => {
    setDraggedVideo(null);
  };

  const handleDrop = (newStatus: Video['status']) => {
    if (draggedVideo) {
      onVideoUpdate(draggedVideo.id, { status: newStatus });
    }
  };

  const handleThumbnailToggle = (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (video) {
      onVideoUpdate(videoId, { thumbnail_pronta: !video.thumbnail_pronta });
    }
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const filteredVideos = videos.filter(video => {
    const canalMatch = selectedCanal === 'todos' || video.canal_id === selectedCanal;
    const responsavelMatch = selectedResponsavel === 'todos' || video.responsavel_id === selectedResponsavel;
    
    const canal = canais.find(c => c.id === video.canal_id);
    const nichoMatch = selectedNicho === 'todos' || canal?.nicho === selectedNicho;
    
    return canalMatch && responsavelMatch && nichoMatch;
  });

  const getVideosByStatus = (status: Video['status']) => {
    return filteredVideos.filter(video => video.status === status);
  };

  // Get unique nichos from canais
  const uniqueNichos = Array.from(new Set(canais.map(canal => canal.nicho)));

  return (
    <div className="h-full">
      {/* Filters - Hide in member mode */}
      {!memberMode && (
        <div className="mb-6 card-primary p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filtros:</span>
            </div>
            
            <select 
              value={selectedCanal}
              onChange={(e) => setSelectedCanal(e.target.value)}
              className="input-primary"
            >
              <option value="todos">Todos os canais</option>
              {canais.map(canal => (
                <option key={canal.id} value={canal.id}>{canal.nome}</option>
              ))}
            </select>
            
            <select 
              value={selectedResponsavel}
              onChange={(e) => setSelectedResponsavel(e.target.value)}
              className="input-primary"
            >
              <option value="todos">Todos os responsáveis</option>
              {usuarios.map(usuario => (
                <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
              ))}
            </select>
            
            <select 
              value={selectedNicho}
              onChange={(e) => setSelectedNicho(e.target.value)}
              className="input-primary"
            >
              <option value="todos">Todos os nichos</option>
              {uniqueNichos.map(nicho => (
                <option key={nicho} value={nicho}>{nicho}</option>
              ))}
            </select>
            
            <div className="text-sm text-muted-foreground ml-auto">
              {filteredVideos.length} vídeo(s) encontrado(s)
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 h-full">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            status={column.status}
            videos={getVideosByStatus(column.status)}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onThumbnailToggle={handleThumbnailToggle}
            onVideoClick={handleVideoClick}
            isDragOver={false}
            memberMode={memberMode}
          />
        ))}
      </div>

      {/* Video Action Modal */}
      {showVideoModal && selectedVideo && (
        <VideoActionModal
          video={selectedVideo}
          canais={canais}
          usuarios={usuarios}
          onUpdateVideo={onVideoUpdate}
          onClose={() => {
            setShowVideoModal(false);
            setSelectedVideo(null);
          }}
        />
      )}
    </div>
  );
};