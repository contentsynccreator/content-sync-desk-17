import { Plus } from 'lucide-react';
import { VideoCard } from './VideoCard';
import type { Video } from '@/contexts/AppContext';

interface KanbanColumnProps {
  title: string;
  status: Video['status'];
  videos: Video[];
  onDrop: (status: Video['status']) => void;
  onDragStart: (video: Video) => void;
  onDragEnd: () => void;
  onThumbnailToggle: (videoId: string) => void;
  onVideoClick: (video: Video) => void;
  isDragOver: boolean;
  memberMode?: boolean;
}

const getStatusIcon = (status: Video['status']) => {
  const icons = {
    ideias: '💡',
    roteiro: '📝',
    audio: '🎙️',
    edicao: '✂️',
    pronto: '✅',
  };
  
  return icons[status];
};

export const KanbanColumn = ({ 
  title, 
  status, 
  videos, 
  onDrop, 
  onDragStart, 
  onDragEnd, 
  onThumbnailToggle,
  onVideoClick,
  isDragOver,
  memberMode = false
}: KanbanColumnProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(status);
  };

  return (
    <div
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getStatusIcon(status)}</span>
          <h2 className="font-semibold text-foreground">{title}</h2>
          <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
            {videos.length}
          </span>
        </div>
        
        <button className="btn-ghost p-1">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Video Cards */}
      <div className="space-y-3 flex-1">
        {videos.map((video) => (
          <div key={video.id} onClick={() => onVideoClick(video)}>
            <VideoCard
              video={video}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onThumbnailToggle={onThumbnailToggle}
            />
          </div>
        ))}
        
        {videos.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm">Nenhum vídeo nesta etapa</p>
          </div>
        )}
      </div>
      
      {/* Add New Button - Hide in member mode */}
      {!memberMode && (
        <button className="w-full btn-ghost border-2 border-dashed border-border hover:border-primary mt-4 py-3">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Vídeo
        </button>
      )}
    </div>
  );
};
