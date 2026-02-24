import { AppProvider, useApp } from './context/AppContext';
import Landing from './pages/Landing';
import ParentDashboard from './pages/ParentDashboard';
import KidDashboard from './pages/KidDashboard';

function AppRouter() {
  const { state } = useApp();

  if (state.currentView === 'parent') return <ParentDashboard />;
  if (state.currentView === 'kid')    return <KidDashboard />;
  return <Landing />;
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
