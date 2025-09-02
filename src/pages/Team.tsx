import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, UserPlus, Mail, Shield, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
  id: string;
  nome: string;
  email: string;
  funcao: string;
  status: 'ativo' | 'inativo' | 'pendente';
  data_convite: string;
  ultimo_acesso?: string;
  senha_temporaria?: string;
}

const Team = () => {
  const { user } = useAuth();
  const { usuarios, videos, addUsuario, updateUsuario, deleteUsuario } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    funcao: '',
    senha: ''
  });

  const teamMembers: TeamMember[] = usuarios.map(usuario => ({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    funcao: usuario.role,
    status: 'ativo' as const,
    data_convite: new Date().toISOString(),
    ultimo_acesso: new Date().toISOString(),
    senha_temporaria: generateTempPassword()
  }));

  function generateTempPassword(): string {
    return Math.random().toString(36).slice(-8);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingMember) {
        await updateUsuario(editingMember.id, {
          nome: formData.nome,
          email: formData.email,
          role: formData.funcao
        });
        
        toast({
          title: "Membro atualizado!",
          description: "As informações do membro foram atualizadas com sucesso"
        });
      } else {
        // Criar membro via edge function
        const { data, error } = await supabase.functions.invoke('create-team-member', {
          body: {
            email: formData.email,
            password: formData.senha,
            nome: formData.nome,
            role: formData.funcao
          }
        });

        if (error) {
          console.error('Edge function error:', error);
          throw new Error(error.message || 'Erro na função de criação');
        }

        if (data?.error) {
          console.error('Edge function returned error:', data.error);
          throw new Error(data.error);
        }

        toast({
          title: "Membro criado com sucesso!",
          description: `${formData.nome} foi criado. Login: ${formData.email}, Senha: ${formData.senha}`
        });
      }

      resetForm();
    } catch (error: any) {
      console.error('Error managing team member:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao gerenciar membro da equipe",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (memberId: string) => {
    if (!confirm('Tem certeza que deseja remover este membro da equipe?')) return;

    try {
      await deleteUsuario(memberId);
      toast({
        title: "Membro removido!",
        description: "O membro foi removido da equipe com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover membro da equipe",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      funcao: '',
      senha: ''
    });
    setEditingMember(null);
    setShowForm(false);
  };

  const editMember = (member: TeamMember) => {
    setFormData({
      nome: member.nome,
      email: member.email,
      funcao: member.funcao,
      senha: ''
    });
    setEditingMember(member);
    setShowForm(true);
  };

  const togglePasswordVisibility = (memberId: string) => {
    setShowPassword(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  const getVideosAssignedTo = (memberId: string) => {
    return videos.filter(video => video.responsavel_id === memberId).length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500/10 text-green-500';
      case 'inativo': return 'bg-red-500/10 text-red-500';
      case 'pendente': return 'bg-yellow-500/10 text-yellow-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestão da Equipe</h1>
            <p className="text-muted-foreground">
              Gerencie os membros da sua equipe de produção
            </p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Convidar Membro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingMember ? 'Editar Membro' : 'Convidar Novo Membro'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome do membro"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funcao">Função</Label>
                  <Input
                    id="funcao"
                    value={formData.funcao}
                    onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                    placeholder="Ex: Editor de Vídeo, Roteirista, Designer"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Digite a função específica deste membro na equipe
                  </p>
                </div>

                {!editingMember && (
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha</Label>
                    <Input
                      id="senha"
                      type="password"
                      value={formData.senha}
                      onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                      placeholder="Digite a senha do membro"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Esta será a senha que o membro usará para fazer login
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingMember ? 'Atualizar' : 'Convidar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membros Ativos</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {teamMembers.filter(m => m.status === 'ativo').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Convites Pendentes</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {teamMembers.filter(m => m.status === 'pendente').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vídeos Atribuídos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {videos.filter(v => v.responsavel_id).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Membros da Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{member.nome}</h4>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {member.funcao}
                        </Badge>
                        <Badge className={`${getStatusColor(member.status)} text-xs`}>
                          {member.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {getVideosAssignedTo(member.id)} vídeos atribuídos
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {member.senha_temporaria && (
                      <div className="flex items-center gap-2 mr-4">
                        <span className="text-xs text-muted-foreground">Senha:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {showPassword[member.id] ? member.senha_temporaria : '••••••••'}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(member.id)}
                        >
                          {showPassword[member.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editMember(member)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {teamMembers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum membro na equipe</h3>
                <p className="text-muted-foreground mb-4">
                  Comece convidando membros para sua equipe de produção
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Convidar Primeiro Membro
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Team;