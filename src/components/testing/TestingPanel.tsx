import React, { useState } from 'react';
import { Bug, Database, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const TestingPanel = () => {
  const { canais, addCanal, videos, ideias, scheduledVideos, refreshData } = useApp();
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<Array<{ test: string; result: 'success' | 'error'; message: string }>>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runTest = async (testName: string, testFn: () => Promise<void>) => {
    try {
      await testFn();
      setTestResults(prev => [...prev, { test: testName, result: 'success', message: 'Teste passou com sucesso' }]);
    } catch (error: any) {
      setTestResults(prev => [...prev, { test: testName, result: 'error', message: error.message }]);
    }
  };

  const runAllTests = async () => {
    if (!user) return;
    
    setIsRunningTests(true);
    setTestResults([]);

    // Teste 1: Conexão com Supabase
    await runTest('Conexão Supabase', async () => {
      const { data, error } = await supabase.from('canais').select('count', { count: 'exact', head: true });
      if (error) throw error;
    });

    // Teste 2: Criação de Canal
    await runTest('Criação de Canal', async () => {
      const testCanal = {
        nome: `Teste Canal ${Date.now()}`,
        link: 'https://youtube.com/test',
        lingua: 'Português',
        nicho: 'Teste',
        sub_nicho: 'Teste Sub',
        micro_nicho: 'Teste Micro',
        freq_postagem: '1x por semana',
        cor: '#FF6B6B',
        dias_postagem: ['segunda'],
        horarios_postagem: ['18:00'],
        alarme_tipo: 'dias' as const,
        alarme_urgente_dias: 2,
        alarme_alerta_dias: 5,
        alarme_minimo_videos: 3
      };
      
      await addCanal(testCanal);
    });

    // Teste 3: Carregamento de dados
    await runTest('Carregamento de Dados', async () => {
      await refreshData();
      if (canais.length === 0 && videos.length === 0 && ideias.length === 0) {
        throw new Error('Nenhum dado foi carregado');
      }
    });

    // Teste 4: Sistema de alarmes
    await runTest('Sistema de Alarmes', async () => {
      const canaisComAlarme = canais.filter(c => c.alarme_tipo);
      if (canaisComAlarme.length === 0) {
        throw new Error('Nenhum canal com alarme configurado encontrado');
      }
    });

    setIsRunningTests(false);
  };

  const createSampleData = async () => {
    if (!user) return;

    const sampleCanais = [
      {
        nome: 'Canal de Tecnologia',
        link: 'https://youtube.com/@tech',
        lingua: 'Português',
        nicho: 'Tecnologia',
        sub_nicho: 'Programação',
        micro_nicho: 'JavaScript',
        freq_postagem: '3x por semana',
        cor: '#4ECDC4',
        dias_postagem: ['segunda', 'quarta', 'sexta'],
        horarios_postagem: ['18:00', '20:00'],
        alarme_tipo: 'dias' as const,
        alarme_urgente_dias: 1,
        alarme_alerta_dias: 3,
        alarme_minimo_videos: 5
      },
      {
        nome: 'Canal de Finanças',
        link: 'https://youtube.com/@financas',
        lingua: 'Português',
        nicho: 'Finanças',
        sub_nicho: 'Investimentos',
        micro_nicho: 'Ações',
        freq_postagem: '2x por semana',
        cor: '#45B7D1',
        dias_postagem: ['terça', 'quinta'],
        horarios_postagem: ['19:00'],
        alarme_tipo: 'quantidade' as const,
        alarme_urgente_dias: 2,
        alarme_alerta_dias: 5,
        alarme_minimo_videos: 3
      }
    ];

    try {
      for (const canal of sampleCanais) {
        await addCanal(canal);
      }
      setTestResults(prev => [...prev, { 
        test: 'Dados de Exemplo', 
        result: 'success', 
        message: `${sampleCanais.length} canais de exemplo criados` 
      }]);
    } catch (error: any) {
      setTestResults(prev => [...prev, { 
        test: 'Dados de Exemplo', 
        result: 'error', 
        message: error.message 
      }]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-primary p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bug className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Painel de Testes</h2>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={runAllTests}
              disabled={isRunningTests}
              className="btn-primary"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isRunningTests ? 'Executando Testes...' : 'Executar Testes'}
            </button>

            <button
              onClick={createSampleData}
              className="btn-secondary"
            >
              <Database className="w-4 h-4 mr-2" />
              Criar Dados de Exemplo
            </button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Resultados dos Testes:</h3>
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    result.result === 'success' 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.result === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-medium">{result.test}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};