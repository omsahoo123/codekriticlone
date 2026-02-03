import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@/App.css';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/AdminDashboard';
import JudgeDashboard from '@/pages/JudgeDashboard';
import TeamDashboard from '@/pages/TeamDashboard';
import PublicLeaderboard from '@/pages/PublicLeaderboard';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/judge" element={<JudgeDashboard />} />
          <Route path="/team" element={<TeamDashboard />} />
          <Route path="/leaderboard" element={<PublicLeaderboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;