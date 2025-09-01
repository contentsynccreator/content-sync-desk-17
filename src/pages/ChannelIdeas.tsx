import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Lightbulb, Star, Users, Calendar } from 'lucide-react';

interface ChannelIdea {
  id: string;
  nome: string;
  descricao: string;
  nicho: string;
  sub_nicho?: string;
  micro_nicho?: string;
  publico_alvo: string;
  conceito: string;
  estimativa_audience: string;
  canais_semelhantes?: string;
  links_semelhantes?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'ideia' | 'planejamento' | 'desenvolvimento' | 'pausado' | 'cancelado';
  created_at: string;
  updated_at: string;
  created_by: string;
}

import { AppLayout } from '@/components/layout/AppLayout';

const ChannelIdeas = () => {
  const { user } = useAuth();
  const [channelIdeas, setChannelIdeas] = useState<ChannelIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIdea, setEditingIdea] = useState<ChannelIdea | null>(null);
  const [formData, setFormData] = useState<{
    nome: string;
    descricao: string;
    nicho: string;
    sub_nicho: string;
    micro_nicho: string;
    publico_alvo: string;
    conceito: string;
    estimativa_audience: string;
    canais_semelhantes: string;
    links_semelhantes: string;
    prioridade: 'baixa' | 'media' | 'alta';
    status: 'ideia' | 'planejamento' | 'desenvolvimento' | 'pausado' | 'cancelado';
  }>({
    nome: '',
    descricao: '',
    nicho: '',
    sub_nicho: '',
    micro_nicho: '',
    publico_alvo: '',
    conceito: '',
    estimativa_audience: '',
    canais_semelhantes: '',
    links_semelhantes: '',
    prioridade: 'media',
    status: 'ideia'
  });

  useEffect(() => {
    loadChannelIdeas();
  }, []);

  const loadChannelIdeas = async () => {
    try {
      // Por agora vamos usar localStorage até a tabela ser criada
      const stored = localStorage.getItem('channelIdeas');
      const data = stored ? JSON.parse(stored) : [];
      setChannelIdeas(data);
    } catch (error) {
      console.error('Error loading channel ideas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar ideias de canais",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const stored = localStorage.getItem('channelIdeas');
      const data = stored ? JSON.parse(stored) : [];
      
      if (editingIdea) {
        const index = data.findIndex((item: any) => item.id === editingIdea.id);
        if (index !== -1) {
          data[index] = {
            ...editingIdea,
            ...formData,
            updated_at: new Date().toISOString()
          };
        }
        toast({
          title: "Ideia atualizada!",
          description: "A ideia de canal foi atualizada com sucesso"
        });
      } else {
        const newIdea = {
          id: Date.now().toString(),
          ...formData,
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        data.push(newIdea);
        toast({
          title: "Ideia criada!",
          description: "Nova ideia de canal criada com sucesso"
        });
      }

      localStorage.setItem('channelIdeas', JSON.stringify(data));
      resetForm();
      loadChannelIdeas();
    } catch (error) {
      console.error('Error saving channel idea:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar ideia de canal",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (idea: ChannelIdea) => {
    setEditingIdea(idea);
    setFormData({
      nome: idea.nome,
      descricao: idea.descricao,
      nicho: idea.nicho,
      sub_nicho: (idea as any).sub_nicho || '',
      micro_nicho: (idea as any).micro_nicho || '',
      publico_alvo: idea.publico_alvo,
      conceito: idea.conceito,
      estimativa_audience: idea.estimativa_audience,
      canais_semelhantes: (idea as any).canais_semelhantes || '',
      links_semelhantes: (idea as any).links_semelhantes || '',
      prioridade: idea.prioridade,
      status: idea.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta ideia de canal?')) return;

    try {
      const stored = localStorage.getItem('channelIdeas');
      const data = stored ? JSON.parse(stored) : [];
      const filtered = data.filter((item: any) => item.id !== id);
      localStorage.setItem('channelIdeas', JSON.stringify(filtered));
      
      toast({
        title: "Ideia excluída!",
        description: "A ideia de canal foi excluída com sucesso"
      });
      
      loadChannelIdeas();
    } catch (error) {
      console.error('Error deleting channel idea:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir ideia de canal",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      nicho: '',
      sub_nicho: '',
      micro_nicho: '',
      publico_alvo: '',
      conceito: '',
      estimativa_audience: '',
      canais_semelhantes: '',
      links_semelhantes: '',
      prioridade: 'media',
      status: 'ideia'
    });
    setEditingIdea(null);
    setShowForm(false);
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-500';
      case 'media': return 'bg-yellow-500';
      case 'baixa': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ideia': return 'bg-blue-500';
      case 'planejamento': return 'bg-purple-500';
      case 'desenvolvimento': return 'bg-orange-500';
      case 'pausado': return 'bg-gray-500';
      case 'cancelado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando ideias de canais...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ideias de Novos Canais</h1>
          <p className="text-muted-foreground">
            Gerencie ideias para futuros projetos de canais
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Ideia de Canal
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingIdea ? 'Editar Ideia de Canal' : 'Nova Ideia de Canal'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="nome">Nome do Canal</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Ex: Dicas de Tecnologia"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="nicho">Nicho</Label>
                    <Input
                      id="nicho"
                      value={formData.nicho}
                      onChange={(e) => setFormData({ ...formData, nicho: e.target.value })}
                      placeholder="Ex: Tecnologia, Culinária..."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sub_nicho">Sub-nicho</Label>
                    <Input
                      id="sub_nicho"
                      value={formData.sub_nicho}
                      onChange={(e) => setFormData({ ...formData, sub_nicho: e.target.value })}
                      placeholder="Ex: Programação, Receitas..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="micro_nicho">Micro-nicho</Label>
                    <Input
                      id="micro_nicho"
                      value={formData.micro_nicho}
                      onChange={(e) => setFormData({ ...formData, micro_nicho: e.target.value })}
                      placeholder="Ex: JavaScript, Sobremesas..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="publico_alvo">Público Alvo</Label>
                    <Input
                      id="publico_alvo"
                      value={formData.publico_alvo}
                      onChange={(e) => setFormData({ ...formData, publico_alvo: e.target.value })}
                      placeholder="Ex: Jovens 18-35 anos"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="estimativa_audience">Estimativa de Audiência</Label>
                    <Input
                      id="estimativa_audience"
                      value={formData.estimativa_audience}
                      onChange={(e) => setFormData({ ...formData, estimativa_audience: e.target.value })}
                      placeholder="Ex: 10K-50K visualizações"
                    />
                  </div>

                  <div>
                    <Label htmlFor="prioridade">Prioridade</Label>
                    <select
                      id="prioridade"
                      value={formData.prioridade}
                      onChange={(e) => setFormData({ ...formData, prioridade: e.target.value as 'baixa' | 'media' | 'alta' })}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ideia' | 'planejamento' | 'desenvolvimento' | 'pausado' | 'cancelado' })}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="ideia">Ideia</option>
                      <option value="planejamento">Planejamento</option>
                      <option value="desenvolvimento">Desenvolvimento</option>
                      <option value="pausado">Pausado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="conceito">Conceito do Canal</Label>
                    <Textarea
                      id="conceito"
                      value={formData.conceito}
                      onChange={(e) => setFormData({ ...formData, conceito: e.target.value })}
                      placeholder="Descreva o conceito principal do canal..."
                      className="h-20"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="canais_semelhantes">Canais Semelhantes</Label>
                    <Textarea
                      id="canais_semelhantes"
                      value={formData.canais_semelhantes}
                      onChange={(e) => setFormData({ ...formData, canais_semelhantes: e.target.value })}
                      placeholder="Liste nomes de canais semelhantes..."
                      className="h-16"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="links_semelhantes">Links de Canais Semelhantes</Label>
                    <Textarea
                      id="links_semelhantes"
                      value={formData.links_semelhantes}
                      onChange={(e) => setFormData({ ...formData, links_semelhantes: e.target.value })}
                      placeholder="Cole links de canais para referência..."
                      className="h-16"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="descricao">Descrição Detalhada</Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      placeholder="Descrição detalhada da ideia, estratégias, etc..."
                      className="h-32"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingIdea ? 'Atualizar' : 'Criar'} Ideia
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channelIdeas.map((idea) => (
          <Card key={idea.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg line-clamp-1">{idea.nome}</CardTitle>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(idea)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(idea.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Badge className={`${getPriorityColor(idea.prioridade)} text-white`}>
                  {idea.prioridade}
                </Badge>
                <Badge className={`${getStatusColor(idea.status)} text-white`}>
                  {idea.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
              <div>
                <p className="text-sm font-medium mb-1">Nicho:</p>
                <p className="text-sm text-muted-foreground">{idea.nicho}</p>
                {(idea as any).sub_nicho && (
                  <p className="text-xs text-muted-foreground">Sub: {(idea as any).sub_nicho}</p>
                )}
                {(idea as any).micro_nicho && (
                  <p className="text-xs text-muted-foreground">Micro: {(idea as any).micro_nicho}</p>
                )}
              </div>

              {(idea as any).canais_semelhantes && (
                <div>
                  <p className="text-sm font-medium mb-1">Canais Semelhantes:</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{(idea as any).canais_semelhantes}</p>
                </div>
              )}
                
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Público:</span>
                  <span className="text-muted-foreground line-clamp-1">{idea.publico_alvo}</span>
                </div>

                {idea.estimativa_audience && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Estimativa:</span>
                    <span className="text-muted-foreground">{idea.estimativa_audience}</span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Conceito:</p>
                <p className="text-sm text-muted-foreground line-clamp-3">{idea.conceito}</p>
              </div>

              {idea.descricao && (
                <div>
                  <p className="text-sm font-medium mb-1">Descrição:</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{idea.descricao}</p>
                </div>
              )}

              <div className="text-xs text-muted-foreground pt-2 border-t">
                Criado em {new Date(idea.created_at).toLocaleDateString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {channelIdeas.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma ideia de canal</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando sua primeira ideia de canal para futuros projetos
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Ideia
            </Button>
          </CardContent>
        </Card>
      )}
      </div>
    </AppLayout>
  );
};

export default ChannelIdeas;