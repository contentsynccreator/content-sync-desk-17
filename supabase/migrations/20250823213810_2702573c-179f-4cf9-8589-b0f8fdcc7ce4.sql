-- Enable RLS
alter table if exists auth.users enable row level security;

-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  nome text not null,
  email text not null,
  role text not null default 'Roteirista',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
on public.profiles for select 
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update 
using (auth.uid() = id);

create policy "Users can insert their own profile"
on public.profiles for insert 
with check (auth.uid() = id);

-- Create canais table
create table public.canais (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  link text not null,
  lingua text not null,
  nicho text not null,
  sub_nicho text not null,
  micro_nicho text not null,
  freq_postagem text not null,
  cor text not null,
  logo_url text,
  dias_postagem text[] not null default '{}',
  horarios_postagem text[] not null default '{}',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS for canais
alter table public.canais enable row level security;

-- Canais policies
create policy "Users can view their own canais"
on public.canais for select 
using (auth.uid() = user_id);

create policy "Users can insert their own canais"
on public.canais for insert 
with check (auth.uid() = user_id);

create policy "Users can update their own canais"
on public.canais for update 
using (auth.uid() = user_id);

create policy "Users can delete their own canais"
on public.canais for delete 
using (auth.uid() = user_id);

-- Create videos table
create table public.videos (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  status text not null check (status in ('ideias', 'roteiro', 'audio', 'edicao', 'pronto')),
  canal_id uuid not null references public.canais(id) on delete cascade,
  responsavel_id uuid references auth.users(id) on delete set null,
  data_criacao timestamp with time zone not null default now(),
  data_agendada timestamp with time zone,
  hora_agendada text,
  thumbnail_pronta boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS for videos
alter table public.videos enable row level security;

-- Videos policies
create policy "Users can view their own videos"
on public.videos for select 
using (auth.uid() = user_id);

create policy "Users can insert their own videos"
on public.videos for insert 
with check (auth.uid() = user_id);

create policy "Users can update their own videos"
on public.videos for update 
using (auth.uid() = user_id);

create policy "Users can delete their own videos"
on public.videos for delete 
using (auth.uid() = user_id);

-- Create ideias table
create table public.ideias (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  descricao text,
  canal_id uuid not null references public.canais(id) on delete cascade,
  status text not null check (status in ('pendente', 'aprovada', 'rejeitada')) default 'pendente',
  data_criacao timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS for ideias
alter table public.ideias enable row level security;

-- Ideias policies
create policy "Users can view their own ideias"
on public.ideias for select 
using (auth.uid() = user_id);

create policy "Users can insert their own ideias"
on public.ideias for insert 
with check (auth.uid() = user_id);

create policy "Users can update their own ideias"
on public.ideias for update 
using (auth.uid() = user_id);

create policy "Users can delete their own ideias"
on public.ideias for delete 
using (auth.uid() = user_id);

-- Create scheduled_videos table
create table public.scheduled_videos (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  canal_id uuid not null references public.canais(id) on delete cascade,
  data_agendada timestamp with time zone not null,
  hora_agendada text not null,
  link_youtube text,
  status text not null check (status in ('agendado', 'publicado')) default 'agendado',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS for scheduled_videos
alter table public.scheduled_videos enable row level security;

-- Scheduled videos policies
create policy "Users can view their own scheduled videos"
on public.scheduled_videos for select 
using (auth.uid() = user_id);

create policy "Users can insert their own scheduled videos"
on public.scheduled_videos for insert 
with check (auth.uid() = user_id);

create policy "Users can update their own scheduled videos"
on public.scheduled_videos for update 
using (auth.uid() = user_id);

create policy "Users can delete their own scheduled videos"
on public.scheduled_videos for delete 
using (auth.uid() = user_id);

-- Create trigger function for updating timestamps
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_canais_updated_at
  before update on public.canais
  for each row execute function public.update_updated_at_column();

create trigger update_videos_updated_at
  before update on public.videos
  for each row execute function public.update_updated_at_column();

create trigger update_ideias_updated_at
  before update on public.ideias
  for each row execute function public.update_updated_at_column();

create trigger update_scheduled_videos_updated_at
  before update on public.scheduled_videos
  for each row execute function public.update_updated_at_column();

-- Create function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    'Roteirista'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();