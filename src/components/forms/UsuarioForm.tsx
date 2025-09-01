import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Usuario } from '@/contexts/AppContext';

interface UsuarioFormProps {
  usuario?: Usuario;
  onSubmit: (usuario: Omit<Usuario, 'id'>) => void;
  onCancel: () => void;
}

const roles = ['Roteirista', 'Editor', 'Narrador', 'Gerente', 'Thumbnail Designer', 'Social Media'];

export const UsuarioForm: React.FC<UsuarioFormProps> = ({ usuario, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    role: usuario?.role || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim() || !formData.email.trim()) return;
    
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card-primary p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {usuario ? 'Editar Membro' : 'Convidar Membro'}
          </h2>
          <button onClick={onCancel} className="btn-ghost p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="input-primary w-full"
              placeholder="Ex: Ana Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="input-primary w-full"
              placeholder="ana@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Função
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="input-primary w-full"
              placeholder="Ex: Editor de Vídeo, Roteirista, Designer"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Digite a função específica deste membro na equipe
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {usuario ? 'Atualizar' : 'Convidar'}
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