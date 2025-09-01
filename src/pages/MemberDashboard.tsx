import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { Video } from '@/contexts/AppContext';
import { LogOut, User, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const MemberDashboardLayout = ({ children, user, memberInfo, onLogout }: {
  children: React.ReactNode;
  user: any;
  memberInfo: any;
  onLogout: () => void;
}) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background-secondary border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Painel do Membro</h1>
              <p className="text-sm text-muted-foreground">
                {memberInfo?.nome} - {memberInfo?.role}
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={onLogout}
            className="text-red-500 hover:text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
};

const MemberDashboard = () => {
  const { user, signOut } = useAuth();
  const { videos, usuarios, updateVideo } = useApp();
  const [memberInfo, setMemberInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Find member info based on email
      const member = usuarios.find(u => u.email === user.email);
      setMemberInfo(member);
      setLoading(false);
    }
  }, [user, usuarios]);

  // Filter videos assigned to this member
  const memberVideos = videos.filter(video => video.responsavel_id === memberInfo?.id);

  const handleVideoUpdate = async (videoId: string, updates: Partial<Video>) => {
    try {
      await updateVideo(videoId, updates);
      toast({
        title: "Vídeo atualizado!",
        description: "O status do vídeo foi atualizado com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar vídeo",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando seu painel...</p>
        </div>
      </div>
    );
  }

  if (!memberInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Acesso não autorizado</h2>
          <p className="text-muted-foreground mb-4">
            Você não está cadastrado como membro da equipe.
          </p>
          <Button onClick={signOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Fazer Logout
          </Button>
        </div>
      </div>
    );
  }

  const videosInProgress = memberVideos.filter(v => !['pronto'].includes(v.status));
  const videosCompleted = memberVideos.filter(v => v.status === 'pronto');

  return (
    <MemberDashboardLayout 
      user={user} 
      memberInfo={memberInfo} 
      onLogout={signOut}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-primary p-6 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-2">
            Bem-vindo(a), {memberInfo.nome}!
          </h2>
          <p className="opacity-90">
            Gerencie seus vídeos atribuídos e acompanhe seu progresso.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vídeos Totais</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{memberVideos.length}</div>
              <p className="text-xs text-muted-foreground">
                Atribuídos para você
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{videosInProgress.length}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando conclusão
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{videosCompleted.length}</div>
              <p className="text-xs text-muted-foreground">
                Finalizados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board - Only videos assigned to this member */}
        <Card>
          <CardHeader>
            <CardTitle>Seus Vídeos</CardTitle>
            <p className="text-muted-foreground">
              Vídeos atribuídos para {memberInfo.role}
            </p>
          </CardHeader>
          <CardContent>
            {memberVideos.length > 0 ? (
              <KanbanBoard 
                videos={memberVideos}
                onVideoUpdate={handleVideoUpdate}
                memberMode={true}
              />
            ) : (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum vídeo atribuído</h3>
                <p className="text-muted-foreground">
                  Você ainda não tem vídeos atribuídos para trabalhar.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MemberDashboardLayout>
  );
};

export default MemberDashboard;