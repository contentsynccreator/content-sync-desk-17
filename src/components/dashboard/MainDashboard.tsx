import React, { useState } from 'react';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { IdeasBank } from '@/components/ideas/IdeasBank';
import { ScheduleView } from '@/components/schedule/ScheduleView';
import { ManagementView } from '@/components/management/ManagementView';
import { AppDiagnostic } from '@/components/debug/AppDiagnostic';
import { useLocation } from 'react-router-dom';

export const MainDashboard = () => {
  const location = useLocation();
  const initialView = location.state?.view || 'ideas';
  const [activeView, setActiveView] = useState(initialView);

  // Render the appropriate component based on active view
  const renderContent = () => {
    switch (activeView) {
      case 'ideas':
        return <IdeasBank />;
      case 'kanban':
        return <KanbanBoard />;
      case 'schedule':
        return <ScheduleView />;
      case 'management':
        return <ManagementView />;
      case 'diagnostic':
        return <AppDiagnostic />;
      default:
        return <IdeasBank />;
    }
  };

  // Listen for navigation changes via location state
  React.useEffect(() => {
    if (location.state?.view) {
      setActiveView(location.state.view);
    }
  }, [location.state]);

  return renderContent();
};