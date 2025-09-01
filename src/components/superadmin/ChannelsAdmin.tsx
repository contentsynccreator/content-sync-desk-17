import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Filter, PlusCircle } from 'lucide-react';

interface CanalRow {
  id: string;
  nome: string;
  user_id?: string;
  link?: string;
  lingua?: string;
  nicho?: string;
  sub_nicho?: string;
  micro_nicho?: string;
  created_at?: string;
}

const FIRST_PAGE_SIZE = 10;
const NEXT_PAGE_SIZE = 20;

export function ChannelsAdmin() {
  const [channels, setChannels] = useState<CanalRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [hasLoadedFirst, setHasLoadedFirst] = useState(false);

  const [nicho, setNicho] = useState('');
  const [sub, setSub] = useState('');
  const [micro, setMicro] = useState('');

  const offsetRef = useRef(0);

  const pageSize = useMemo(() => (hasLoadedFirst ? NEXT_PAGE_SIZE : FIRST_PAGE_SIZE), [hasLoadedFirst]);

  const fetchPage = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
        offsetRef.current = 0;
      } else {
        setLoadingMore(true);
      }

      let query = supabase
        .from('canais')
        .select('*')
        .order('created_at', { ascending: false });

      if (nicho.trim()) query = query.ilike('nicho', `%${nicho.trim()}%`);
      if (sub.trim()) query = query.ilike('sub_nicho', `%${sub.trim()}%`);
      if (micro.trim()) query = query.ilike('micro_nicho', `%${micro.trim()}%`);

      const from = offsetRef.current;
      const to = offsetRef.current + (reset ? FIRST_PAGE_SIZE : pageSize) - 1;

      const { data, error } = await query.range(from, to);

      if (error) throw error;

      const rows = (data || []) as CanalRow[];

      if (reset) {
        setChannels(rows);
        setHasLoadedFirst(true);
      } else {
        setChannels(prev => [...prev, ...rows]);
      }

      // If we received less than requested, there is no more data
      const requested = reset ? FIRST_PAGE_SIZE : pageSize;
      setHasMore(rows.length === requested);

      offsetRef.current += rows.length;
    } catch (e: any) {
      console.error('Erro ao carregar canais:', e?.message || e);
      setError(e?.message || 'Erro ao carregar canais');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const applyFilters = () => fetchPage(true);
  const clearFilters = () => {
    setNicho('');
    setSub('');
    setMicro('');
    // reset list
    fetchPage(true);
  };

  useEffect(() => {
    document.title = 'Super Admin • Canais';
    // initial load
    fetchPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-primary" />
          <CardTitle>Últimos canais registrados</CardTitle>
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Input
              value={nicho}
              onChange={(e) => setNicho(e.target.value)}
              placeholder="Filtrar por nicho"
              className="w-48"
            />
            <Input
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              placeholder="Sub-nicho"
              className="w-40"
            />
            <Input
              value={micro}
              onChange={(e) => setMicro(e.target.value)}
              placeholder="Micro-nicho"
              className="w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={clearFilters}>Limpar</Button>
            <Button onClick={applyFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-destructive text-sm mb-4">{error}</div>
        )}
        {loading && channels.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Carregando canais...
          </div>
        ) : (
          <div className="space-y-2">
            {channels.slice(0, FIRST_PAGE_SIZE).length > 0 && !hasLoadedFirst && (
              <div className="text-xs text-muted-foreground">Exibindo os {FIRST_PAGE_SIZE} mais recentes</div>
            )}
            <ul className="divide-y divide-border rounded-lg border">
              {channels.map((c) => (
                <li key={c.id} className="p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-medium truncate text-foreground">{c.nome}</div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs">
                      {c.nicho && <Badge variant="outline">{c.nicho}</Badge>}
                      {c.sub_nicho && <Badge variant="outline">{c.sub_nicho}</Badge>}
                      {c.micro_nicho && <Badge variant="outline">{c.micro_nicho}</Badge>}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    {c.created_at ? new Date(c.created_at).toLocaleString() : ''}
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-4 flex justify-center">
              {hasMore ? (
                <Button variant="secondary" onClick={() => fetchPage(false)} disabled={loadingMore}>
                  {loadingMore && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Carregar mais {hasLoadedFirst ? NEXT_PAGE_SIZE : FIRST_PAGE_SIZE}
                </Button>
              ) : (
                <div className="text-xs text-muted-foreground">Todos os resultados carregados</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
