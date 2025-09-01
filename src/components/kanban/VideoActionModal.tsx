import React, { useState } from 'react';
import { Video, Canal, Usuario } from '@/contexts/AppContext';
import { X, FolderOpen, Edit3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface VideoActionModalProps {
  video: Video;
  canais: Canal[];
  usuarios: Usuario[];
  onUpdateVideo: (id: string, updates: Partial<Video>) => void;
  onClose: () => void;
}

export const VideoActionModal: React.FC<VideoActionModalProps> = ({
  video,
  canais,
  usuarios,
  onUpdateVideo,
  onClose
}) => {
  const [googleDriveLink, setGoogleDriveLink] = useState(video.google_drive_link || '');
  const [observacoes, setObservacoes] = useState('');

  const handleSaveDriveLink = () => {
    onUpdateVideo(video.id, { google_drive_link: googleDriveLink });
    toast({
      title: "Link salvo!",
      description: "Link do Google Drive atualizado com sucesso"
    });
  };

  const handleCopyContent = () => {
    const content = `${video.titulo}\n\nCanal: ${video.canal_nome}\nStatus: ${video.status}\nResponsável: ${video.responsavel_nome || 'Não definido'}\nThumbnail: ${video.thumbnail_pronta ? 'Pronta' : 'Pendente'}`;
    navigator.clipboard.writeText(content);
    toast({
      title: "Copiado!",
      description: "Informações do vídeo copiadas para a área de transferência"
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card-primary p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Ações do Vídeo</h2>
          <button onClick={onClose} className="btn-ghost p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Video Info */}
          <div className="p-4 bg-background-tertiary rounded-lg">
            <h3 className="font-medium text-foreground mb-2 line-clamp-2">{video.titulo}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>{video.canal_nome}</span>
              <span>•</span>
              <span>{video.status}</span>
            </div>
          </div>

          {/* Google Drive Link */}
          <div>
            <Label htmlFor="drive_link" className="block text-sm font-medium text-foreground mb-2">
              <FolderOpen className="w-4 h-4 inline mr-2" />
              Pasta do Google Drive
            </Label>
            <div className="space-y-2">
              <Input
                id="drive_link"
                type="url"
                value={googleDriveLink}
                onChange={(e) => setGoogleDriveLink(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveDriveLink}
                  disabled={!googleDriveLink.trim()}
                  className="flex-1"
                >
                  Salvar Link
                </Button>
                {video.google_drive_link && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(video.google_drive_link, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="observacoes" className="block text-sm font-medium text-foreground mb-2">
              <Edit3 className="w-4 h-4 inline mr-2" />
              Observações
            </Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Adicione observações sobre este vídeo..."
              className="h-20"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleCopyContent} variant="outline" className="flex-1">
              Copiar Informações
            </Button>
            <Button onClick={onClose} className="flex-1">
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};