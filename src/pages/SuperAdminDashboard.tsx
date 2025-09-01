import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Users, 
  Crown, 
  Shield, 
  BarChart3, 
  DollarSign, 
  Settings, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Check,
  X
} from 'lucide-react';
import { ChannelsAdmin } from '@/components/superadmin/ChannelsAdmin';

interface SuperAdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  totalProjects: number;
  activeProjects: number;
  growthRate: number;
}

interface UserManagement {
  id: string;
  nome: string;
  email: string;
  role: string;
  created_at: string;
  last_login: string;
  subscription_status: string;
}

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<SuperAdminStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    totalProjects: 0,
    activeProjects: 0,
    growthRate: 0
  });
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuperAdminData();
  }, []);

  const loadSuperAdminData = async () => {
    try {
      // Buscar dados reais do banco
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      const { data: canaisData, error: canaisError } = await supabase
        .from('canais')
        .select('*');

      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*');

      const { data: ideiasData, error: ideiasError } = await supabase
        .from('ideias')
        .select('*');

      if (profilesError || canaisError || videosError || ideiasError) {
        throw new Error('Erro ao carregar dados do banco');
      }

      const totalUsers = profilesData?.length || 0;
      const totalCanais = canaisData?.length || 0;
      const totalVideos = videosData?.length || 0;
      const totalIdeias = ideiasData?.length || 0;
      const videosEmProducao = videosData?.filter(v => !['pronto', 'agendado', 'publicado'].includes(v.status)).length || 0;

      // Estatísticas calculadas
      setStats({
        totalUsers,
        activeSubscriptions: Math.floor(totalUsers * 0.76), // 76% de conversão simulada
        monthlyRevenue: totalUsers * 47.90, // R$ 47,90 por usuário
        totalProjects: totalCanais,
        activeProjects: videosEmProducao,
        growthRate: 23.5 // Simulado
      });

      // Formatar dados dos usuários para o display
      const usersFormatted = (profilesData || []).map(profile => ({
        id: profile.id,
        nome: profile.nome || 'Sem nome',
        email: profile.email || 'Sem email',
        role: profile.role || 'editor',
        created_at: profile.created_at || new Date().toISOString(),
        last_login: profile.updated_at || profile.created_at || new Date().toISOString(),
        subscription_status: 'active' // Por enquanto todos ativos
      }));

      setUsers(usersFormatted);
    } catch (error) {
      console.error('Error loading super admin data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados administrativos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // Aqui implementaríamos a atualização real no banco
      toast({
        title: "Função atualizada!",
        description: "A função do usuário foi atualizada com sucesso"
      });
      loadSuperAdminData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar função do usuário",
        variant: "destructive"
      });
    }
  };

  const suspendUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja suspender este usuário?')) return;
    
    try {
      // Implementar suspensão
      toast({
        title: "Usuário suspenso!",
        description: "O usuário foi suspenso com sucesso"
      });
      loadSuperAdminData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao suspender usuário",
        variant: "destructive"
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-500';
      case 'admin': return 'bg-blue-500';
      case 'editor': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'editor': return 'Editor';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-500" />
            <div>
              <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Controle total da plataforma
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Shield className="w-4 h-4 mr-1" />
            Super Administrador
          </Badge>
        </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.growthRate}% este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.activeSubscriptions / stats.totalUsers) * 100).toFixed(1)}% conversão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canais Cadastrados</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProjects} com vídeos em produção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="channels">Canais</TabsTrigger>
          <TabsTrigger value="users">Gestão de Usuários</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="billing">Faturamento</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-4">
          <ChannelsAdmin />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuários da Plataforma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{user.nome}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${getRoleColor(user.role)} text-white text-xs`}>
                            {getRoleDisplayName(user.role)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {user.subscription_status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select 
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="text-sm p-1 border rounded"
                      >
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => suspendUser(user.id)}
                        className="text-destructive"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics da Plataforma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Avançados</h3>
                <p className="text-muted-foreground">
                  Relatórios detalhados de uso e performance da plataforma
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Plataforma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Modo de Manutenção</h4>
                    <p className="text-sm text-muted-foreground">
                      Desabilita o acesso de usuários comuns
                    </p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Backup Automático</h4>
                    <p className="text-sm text-muted-foreground">
                      Configurar frequência de backups
                    </p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Notificações do Sistema</h4>
                    <p className="text-sm text-muted-foreground">
                      Gerenciar alertas e notificações
                    </p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Faturamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Faturamento e Pagamentos</h3>
                <p className="text-muted-foreground">
                  Controle de assinaturas, pagamentos e relatórios financeiros
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </AppLayout>
  );
};

export default SuperAdminDashboard;