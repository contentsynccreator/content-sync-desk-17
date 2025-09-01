import { useState } from 'react';
import { Plus, Edit, Trash2, User, Shield, Crown } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { UsuarioForm } from '@/components/forms/UsuarioForm';
import { Usuario } from '@/contexts/AppContext';

export const EquipeSection = () => {
  const { usuarios, addUsuario, updateUsuario, deleteUsuario } = useApp();
  const [showUsuarioForm, setShowUsuarioForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);

  const handleAddUsuario = () => {
    setEditingUsuario(null);
    setShowUsuarioForm(true);
  };

  const handleEditUsuario = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setShowUsuarioForm(true);
  };

  const handleDeleteUsuario = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este membro da equipe?')) {
      await deleteUsuario(id);
    }
  };

  const handleUsuarioSubmit = async (usuarioData: Omit<Usuario, 'id'>) => {
    try {
      if (editingUsuario) {
        await updateUsuario(editingUsuario.id, usuarioData);
      } else {
        await addUsuario(usuarioData);
      }
      setShowUsuarioForm(false);
      setEditingUsuario(null);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleUsuarioCancel = () => {
    setShowUsuarioForm(false);
    setEditingUsuario(null);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-green-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Administrador';
      default:
        return 'Editor';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Equipe</h2>
        <button onClick={handleAddUsuario} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Membro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="card-primary p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  {getRoleIcon(usuario.role)}
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{usuario.nome}</h3>
                  <p className="text-sm text-muted-foreground">{usuario.email}</p>
                </div>
              </div>
              
              <div className="flex gap-1">
                <button 
                  onClick={() => handleEditUsuario(usuario)} 
                  className="btn-ghost p-1"
                  title="Editar usuário"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => handleDeleteUsuario(usuario.id)} 
                  className="btn-ghost p-1 text-destructive"
                  title="Remover usuário"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getRoleColor(usuario.role)}`}>
              {getRoleIcon(usuario.role)}
              <span className="ml-1">{getRoleLabel(usuario.role)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {usuarios.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum membro na equipe</h3>
          <p className="text-muted-foreground mb-4">
            Adicione membros para colaborar na produção de conteúdo
          </p>
          <button onClick={handleAddUsuario} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeiro Membro
          </button>
        </div>
      )}

      {/* Forms */}
      {showUsuarioForm && (
        <UsuarioForm
          usuario={editingUsuario || undefined}
          onSubmit={handleUsuarioSubmit}
          onCancel={handleUsuarioCancel}
        />
      )}
    </div>
  );
};