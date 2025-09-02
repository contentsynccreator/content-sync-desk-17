import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Plus, ExternalLink, Star, Trash2, Edit } from 'lucide-react';

interface CompetitorChannel {
  id: string;
  nome: string;
  endereco_canal: string;
  nicho: string;
  sub_nicho?: string;
  micro_nicho?: string;
  canal_proprio_id: string;
  canal_proprio_nome: string;
  observacao?: string;
  detalhes?: string;
  favorito: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CompetitorChannels = () => {
  const { user } = useAuth();
  const { canais } = useApp();
  const [channels, setChannels] = useState<CompetitorChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChannel, setEditingChannel] = useState<CompetitorChannel | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    endereco_canal: '',
    nicho: '',
    sub_nicho: '',
    micro_nicho: '',
    canal_proprio_id: '',
    observacao: '',
    detalhes: '',
    favorito: false
  });
  const [filters, setFilters] = useState({
    nicho: '',
    sub_nicho: '',
    micro_nicho: '',
    canal_proprio_id: 'todos'
  });

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('competitor_channels')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map database fields to component interface
      const mappedData = data.map(channel => ({
        id: channel.id,
        nome: channel.nome,
        endereco_canal: channel.link,
        nicho: channel.nicho || '',
        sub_nicho: channel.content_style || '',
        micro_nicho: channel.upload_frequency || '',
        canal_proprio_id: '',
        canal_proprio_nome: '',
        observacao: channel.notes || '',
        detalhes: `Inscritos: ${channel.subscribers_count || 0} | Visualizações médias: ${channel.avg_views || 0}`,
        favorito: false,
        created_at: channel.created_at,
        updated_at: channel.updated_at,
        user_id: channel.user_id
      }));
      
      setChannels(mappedData);
    } catch (error) {
      console.error('Error loading competitor channels:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar canais concorrentes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveToDatabase = async (channelData: any) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('competitor_channels')
        .insert({
          nome: channelData.nome,
          link: channelData.endereco_canal,
          nicho: channelData.nicho,
          content_style: channelData.sub_nicho,
          upload_frequency: channelData.micro_nicho,
          notes: channelData.observacao,
          subscribers_count: 0,
          avg_views: 0,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingChannel) {
        const { error } = await supabase
          .from('competitor_channels')
          .update({
            nome: formData.nome,
            link: formData.endereco_canal,
            nicho: formData.nicho,
            content_style: formData.sub_nicho,
            upload_frequency: formData.micro_nicho,
            notes: formData.observacao
          })
          .eq('id', editingChannel.id)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Canal atualizado!",
          description: "Canal concorrente atualizado com sucesso"
        });
      } else {
        const newData = await saveToDatabase(formData);
        
        const mappedChannel = {
          id: newData.id,
          nome: newData.nome,
          endereco_canal: newData.link,
          nicho: newData.nicho || '',
          sub_nicho: newData.content_style || '',
          micro_nicho: newData.upload_frequency || '',
          canal_proprio_id: '',
          canal_proprio_nome: '',
          observacao: newData.notes || '',
          detalhes: `Inscritos: ${newData.subscribers_count || 0} | Visualizações médias: ${newData.avg_views || 0}`,
          favorito: false,
          created_at: newData.created_at,
          updated_at: newData.updated_at,
          user_id: newData.user_id
        };
        
        setChannels(prev => [...prev, mappedChannel]);

        toast({
          title: "Canal adicionado!",
          description: "Canal concorrente adicionado com sucesso"
        });
      }

      resetForm();
      loadChannels();
    } catch (error) {
      console.error('Error saving competitor channel:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar canal concorrente",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (channelId: string) => {
    if (!user || !confirm('Tem certeza que deseja excluir este canal?')) return;

    try {
      const { error } = await supabase
        .from('competitor_channels')
        .delete()
        .eq('id', channelId)
        .eq('user_id', user.id);

      if (error) throw error;

      setChannels(prev => prev.filter(channel => channel.id !== channelId));

      toast({
        title: "Canal excluído!",
        description: "Canal concorrente excluído com sucesso"
      });
    } catch (error) {
      console.error('Error deleting competitor channel:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir canal concorrente",
        variant: "destructive"
      });
    }
  };

  const toggleFavorite = async (channel: CompetitorChannel) => {
    if (!user) return;

    try {
      const updatedChannels = channels.map(ch =>
        ch.id === channel.id
          ? { ...ch, favorito: !ch.favorito, updated_at: new Date().toISOString() }
          : ch
      );
      setChannels(updatedChannels);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar favorito",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      endereco_canal: '',
      nicho: '',
      sub_nicho: '',
      micro_nicho: '',
      canal_proprio_id: '',
      observacao: '',
      detalhes: '',
      favorito: false
    });
    setEditingChannel(null);
    setShowForm(false);
  };

  const editChannel = (channel: CompetitorChannel) => {
    setFormData({
      nome: channel.nome,
      endereco_canal: channel.endereco_canal,
      nicho: channel.nicho,
      sub_nicho: channel.sub_nicho || '',
      micro_nicho: channel.micro_nicho || '',
      canal_proprio_id: channel.canal_proprio_id || '',
      observacao: channel.observacao || '',
      detalhes: channel.detalhes || '',
      favorito: channel.favorito
    });
    setEditingChannel(channel);
    setShowForm(true);
  };

  // Filter channels based on current filters
  const filteredChannels = channels.filter(channel => {
    if (filters.nicho && !channel.nicho.toLowerCase().includes(filters.nicho.toLowerCase())) {
      return false;
    }
    if (filters.sub_nicho && !channel.sub_nicho?.toLowerCase().includes(filters.sub_nicho.toLowerCase())) {
      return false;
    }
    if (filters.micro_nicho && !channel.micro_nicho?.toLowerCase().includes(filters.micro_nicho.toLowerCase())) {
      return false;
    }
    if (filters.canal_proprio_id && filters.canal_proprio_id !== 'todos' && channel.canal_proprio_id !== filters.canal_proprio_id) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Canais Concorrentes</h1>
          <p className="text-muted-foreground">
            Mantenha um banco de dados de canais para inspiração e análise
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Canal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingChannel ? 'Editar Canal' : 'Adicionar Canal Concorrente'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Canal</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome do canal"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco_canal">Link do Canal</Label>
                <Input
                  id="endereco_canal"
                  value={formData.endereco_canal}
                  onChange={(e) => setFormData({ ...formData, endereco_canal: e.target.value })}
                  placeholder="https://youtube.com/@canal"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nicho">Nicho</Label>
                <Input
                  id="nicho"
                  value={formData.nicho}
                  onChange={(e) => setFormData({ ...formData, nicho: e.target.value })}
                  placeholder="Ex: Tech, Gaming, Educação"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub_nicho">Sub-nicho</Label>
                <Input
                  id="sub_nicho"
                  value={formData.sub_nicho}
                  onChange={(e) => setFormData({ ...formData, sub_nicho: e.target.value })}
                  placeholder="Ex: Programação, FPS, Matemática"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="micro_nicho">Micro-nicho</Label>
                <Input
                  id="micro_nicho"
                  value={formData.micro_nicho}
                  onChange={(e) => setFormData({ ...formData, micro_nicho: e.target.value })}
                  placeholder="Ex: React, Call of Duty, Álgebra"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="canal_proprio_id">Canal Próprio Relacionado</Label>
                <Select
                  value={formData.canal_proprio_id}
                  onValueChange={(value) => setFormData({ ...formData, canal_proprio_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o canal relacionado" />
                  </SelectTrigger>
                  <SelectContent>
                    {canais.map(canal => (
                      <SelectItem key={canal.id} value={canal.id || 'no-id'}>
                        {canal.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacao">Observações</Label>
                <Textarea
                  id="observacao"
                  value={formData.observacao}
                  onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                  placeholder="Observações sobre o canal"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detalhes">Detalhes</Label>
                <Textarea
                  id="detalhes"
                  value={formData.detalhes}
                  onChange={(e) => setFormData({ ...formData, detalhes: e.target.value })}
                  placeholder="Detalhes adicionais, estratégias, etc."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="favorito"
                  checked={formData.favorito}
                  onChange={(e) => setFormData({ ...formData, favorito: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="favorito">Marcar como favorito</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingChannel ? 'Atualizar' : 'Adicionar'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Canal Próprio</Label>
                <Select
                  value={filters.canal_proprio_id}
                  onValueChange={(value) => setFilters({ ...filters, canal_proprio_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os canais" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os canais</SelectItem>
                    {canais.map(canal => (
                      <SelectItem key={canal.id} value={canal.id || 'no-id'}>
                        {canal.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <Label>Nicho</Label>
              <Input
                placeholder="Filtrar por nicho"
                value={filters.nicho}
                onChange={(e) => setFilters({ ...filters, nicho: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Sub-nicho</Label>
              <Input
                placeholder="Filtrar por sub-nicho"
                value={filters.sub_nicho}
                onChange={(e) => setFilters({ ...filters, sub_nicho: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Micro-nicho</Label>
              <Input
                placeholder="Filtrar por micro-nicho"
                value={filters.micro_nicho}
                onChange={(e) => setFilters({ ...filters, micro_nicho: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setFilters({ nicho: '', sub_nicho: '', micro_nicho: '', canal_proprio_id: 'todos' })}
            >
              Limpar Filtros
            </Button>
            <div className="text-sm text-muted-foreground flex items-center">
              Mostrando {filteredChannels.length} de {channels.length} canais
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChannels.map((channel) => (
          <Card key={channel.id} className="h-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2 flex-1">
                  {channel.nome}
                  {channel.favorito && (
                    <Star className="w-4 h-4 ml-2 text-yellow-500 fill-current inline" />
                  )}
                </CardTitle>
                <div className="flex gap-1 ml-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleFavorite(channel)}
                  >
                    <Star 
                      className={`w-4 h-4 ${channel.favorito ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} 
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editChannel(channel)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(channel.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{channel.nicho}</Badge>
                <Badge variant="outline">Para: {channel.canal_proprio_nome}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(channel.endereco_canal, '_blank')}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visitar Canal
              </Button>
              {/* Nicho Hierarchy */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Canal Relacionado:</span>
                  <span className="text-muted-foreground">{channel.canal_proprio_nome}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Nicho:</span>
                  <span className="text-muted-foreground">{channel.nicho}</span>
                </div>
                {channel.sub_nicho && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Sub-nicho:</span>
                    <span className="text-muted-foreground">{channel.sub_nicho}</span>
                  </div>
                )}
                {channel.micro_nicho && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Micro-nicho:</span>
                    <span className="text-muted-foreground">{channel.micro_nicho}</span>
                  </div>
                )}
              </div>
              
              {channel.observacao && (
                <div>
                  <p className="text-sm font-medium mb-1">Observações:</p>
                  <p className="text-sm text-muted-foreground">{channel.observacao}</p>
                </div>
              )}
              
              {channel.detalhes && (
                <div>
                  <p className="text-sm font-medium mb-1">Detalhes:</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">{channel.detalhes}</p>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                Adicionado em: {new Date(channel.created_at).toLocaleDateString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChannels.length === 0 && channels.length > 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhum canal encontrado com os filtros atuais.
            </p>
            <Button variant="outline" onClick={() => setFilters({ nicho: '', sub_nicho: '', micro_nicho: '', canal_proprio_id: 'todos' })}>
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>
      )}

      {channels.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhum canal concorrente cadastrado ainda.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Canal
            </Button>
          </CardContent>
        </Card>
      )}
      </div>
    </AppLayout>
  );
};

export default CompetitorChannels;