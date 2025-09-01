import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Video, Canal, Usuario } from '@/contexts/AppContext';

interface VideoFormProps {
  video?: Video;
  canais: Canal[];
  usuarios: Usuario[];
  onSubmit: (video: Omit<Video, 'id'>) => void;
  onCancel: () => void;
}

export const VideoForm: React.FC<VideoFormProps> = ({ 
  video, 
  canais, 
  usuarios, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    titulo: video?.titulo || '',
    status: video?.status || 'ideias' as const,
    canal_id: video?.canal_id || canais[0]?.id || '',
    responsavel_id: video?.responsavel_id || '',
    thumbnail_pronta: video?.thumbnail_pronta || false,
    google_drive_link: video?.google_drive_link || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.canal_id) return;
    
    const canal = canais.find(c => c.id === formData.canal_id);
    const responsavel = usuarios.find(u => u.id === formData.responsavel_id);
    
    onSubmit({
      titulo: formData.titulo,
      status: formData.status,
      canal_id: formData.canal_id,
      canal_nome: canal?.nome || '',
      responsavel_id: formData.responsavel_id || undefined,
      responsavel_nome: responsavel?.nome || undefined,
      data_criacao: new Date(),
      thumbnail_pronta: formData.thumbnail_pronta,
      google_drive_link: formData.google_drive_link || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card-primary p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {video ? 'Editar Vídeo' : 'Novo Vídeo'}
          </h2>
          <button onClick={onCancel} className="btn-ghost p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Título do Vídeo *
            </label>
            <input
              type="text"
              required
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              className="input-primary w-full"
              placeholder="Ex: 10 Dicas de Economia Doméstica"
            />
          </div>

          {/* Canal */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Canal *
            </label>
            <select
              required
              value={formData.canal_id}
              onChange={(e) => setFormData(prev => ({ ...prev, canal_id: e.target.value }))}
              className="input-primary w-full"
            >
              <option value="">Selecione um canal</option>
              {canais.map(canal => (
                <option key={canal.id} value={canal.id}>{canal.nome}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Video['status'] }))}
              className="input-primary w-full"
            >
              <option value="ideias">Início de Produção</option>
              <option value="roteiro">Roteiro</option>
              <option value="audio">Áudio</option>
              <option value="edicao">Edição</option>
              <option value="pronto">Pronto para Agendar</option>
            </select>
          </div>

          {/* Responsável */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Responsável
            </label>
            <select
              value={formData.responsavel_id}
              onChange={(e) => setFormData(prev => ({ ...prev, responsavel_id: e.target.value }))}
              className="input-primary w-full"
            >
              <option value="">Nenhum responsável</option>
              {usuarios.map(usuario => (
                <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
              ))}
            </select>
          </div>

          {/* Google Drive Link */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Pasta do Google Drive
            </label>
            <input
              type="url"
              value={formData.google_drive_link}
              onChange={(e) => setFormData(prev => ({ ...prev, google_drive_link: e.target.value }))}
              className="input-primary w-full"
              placeholder="https://drive.google.com/drive/folders/..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Link da pasta onde ficarão os arquivos do vídeo
            </p>
          </div>

          {/* Thumbnail */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="thumbnail_pronta"
              checked={formData.thumbnail_pronta}
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_pronta: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="thumbnail_pronta" className="text-sm font-medium text-foreground">
              Thumbnail pronta
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {video ? 'Atualizar Vídeo' : 'Criar Vídeo'}
            </button>
            <button type="button" onClick={onCancel} className="btn-ghost flex-1">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};