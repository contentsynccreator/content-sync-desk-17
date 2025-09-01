import { Routes, Route } from 'react-router-dom';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import MemberAuth from '@/pages/MemberAuth';
import MemberDashboard from '@/pages/MemberDashboard';
import CompetitorChannels from '@/pages/CompetitorChannels';
import UserProfile from '@/pages/UserProfile';
import ChannelIdeas from '@/pages/ChannelIdeas';
import Team from '@/pages/Team';
import Schedule from '@/pages/Schedule';
import SuperAdmin from '@/pages/SuperAdmin';
import NotFound from '@/pages/NotFound';

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/member-auth" element={<MemberAuth />} />
      <Route path="/member-dashboard" element={<MemberDashboard />} />
      <Route path="/competitor-channels" element={<CompetitorChannels />} />
      <Route path="/channel-ideas" element={<ChannelIdeas />} />
      <Route path="/team" element={<Team />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/super-admin" element={<SuperAdmin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;
