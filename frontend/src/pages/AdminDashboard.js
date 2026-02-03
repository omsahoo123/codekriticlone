import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getStoredAuth, clearAuth } from '@/utils/api';
import { toast } from 'sonner';
import {
  Users,
  Gavel,
  Trophy,
  Timer,
  LogOut,
  Plus,
  Trash2,
  Play,
  Pause,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { TimerPicker } from '@/components/TimerPicker';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [judges, setJudges] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [teams, setTeams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [timer, setTimer] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Forms
  const [newJudge, setNewJudge] = useState({ judge_id: '', name: '', password: '' });
  const [newCriteria, setNewCriteria] = useState({ name: '', max_score: 10 });
  const [teamPassword, setTeamPassword] = useState('');
  const [timerEnd, setTimerEnd] = useState('');
  const [showTimerPicker, setShowTimerPicker] = useState(false);

  useEffect(() => {
    const { role } = getStoredAuth();
    if (role !== 'admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [judgesRes, criteriaRes, teamsRes, leaderboardRes, timerRes] =
        await Promise.all([
          api.get('/admin/judges'),
          api.get('/admin/criteria'),
          api.get('/admin/teams'),
          api.get('/admin/leaderboard'),
          api.get('/admin/timer'),
        ]);

      setJudges(judgesRes.data);
      setCriteria(criteriaRes.data);
      setTeams(teamsRes.data);
      setLeaderboard(leaderboardRes.data);
      setTimer(timerRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleCreateJudge = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/judges', newJudge);
      toast.success('Judge created successfully');
      setNewJudge({ judge_id: '', name: '', password: '' });
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create judge');
    }
  };

  const handleCreateCriteria = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/criteria', newCriteria);
      toast.success('Criteria created successfully');
      setNewCriteria({ name: '', max_score: 10 });
      loadData();
    } catch (error) {
      toast.error('Failed to create criteria');
    }
  };

  const handleDeleteCriteria = async (id) => {
    try {
      await api.delete(`/admin/criteria/${id}`);
      toast.success('Criteria deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete criteria');
    }
  };

  const handleSetTeamPassword = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/set-team-password', { password: teamPassword });
      toast.success('Team password set successfully');
      setTeamPassword('');
    } catch (error) {
      toast.error('Failed to set team password');
    }
  };

  const handleStartTimer = async () => {
    if (!timerEnd) {
      toast.error('Please select end time');
      return;
    }
    try {
      await api.post('/admin/timer', {
        end_time: timerEnd,
        is_active: true,
      });
      toast.success('Timer started');
      setShowTimerPicker(false);
      loadData();
    } catch (error) {
      toast.error('Failed to start timer');
    }
  };

  const handleTimerConfirm = (dateTime) => {
    setTimerEnd(dateTime);
    handleStartTimerWithDateTime(dateTime);
  };

  const handleStartTimerWithDateTime = async (dateTime) => {
    try {
      await api.post('/admin/timer', {
        end_time: dateTime,
        is_active: true,
      });
      toast.success('Timer started successfully!');
      setShowTimerPicker(false);
      loadData();
    } catch (error) {
      toast.error('Failed to start timer');
    }
  };

  const handleStopTimer = async () => {
    try {
      await api.post('/admin/timer', {
        end_time: timer?.end_time || new Date().toISOString(),
        is_active: false,
      });
      toast.success('Timer stopped');
      loadData();
    } catch (error) {
      toast.error('Failed to stop timer');
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <div className="ocean-bg min-h-screen">
      {/* Header */}
      <div className="glass-card border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white glow-text">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">Manage your hackathon</p>
          </div>
          <Button
            onClick={handleLogout}
            data-testid="logout-btn"
            variant="outline"
            className="btn-secondary"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: Trophy },
            { id: 'judges', label: 'Judges', icon: Gavel },
            { id: 'criteria', label: 'Criteria', icon: Users },
            { id: 'timer', label: 'Timer', icon: Timer },
          ].map((tab) => (
            <button
              key={tab.id}
              data-testid={`tab-${tab.id}-btn`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900/50 text-slate-300 hover:bg-slate-800/70 border border-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Total Teams</p>
                    <p className="text-2xl font-bold text-white">{teams.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Gavel className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Total Judges</p>
                    <p className="text-2xl font-bold text-white">{judges.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Criteria</p>
                    <p className="text-2xl font-bold text-white">{criteria.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Leaderboard */}
            <Card className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Leaderboard</h2>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.team_name}
                    data-testid={`leaderboard-entry-${entry.team_name}`}
                    className="leaderboard-row glass-card p-4 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rank-badge ${
                          entry.rank === 1
                            ? 'rank-1'
                            : entry.rank === 2
                            ? 'rank-2'
                            : entry.rank === 3
                            ? 'rank-3'
                            : 'rank-other'
                        }`}
                      >
                        {entry.rank}
                      </div>
                      <div>
                        <p className="font-bold text-white">{entry.team_name}</p>
                        <p className="text-sm text-slate-400">
                          {entry.judge_count} judge{entry.judge_count !== 1 ? 's' : ''} scored
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-cyan-400 mono">
                        {entry.total_score}
                      </p>
                      <p className="text-xs text-slate-500">points</p>
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-center text-slate-400 py-8">No scores yet</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Judges Tab */}
        {activeTab === 'judges' && (
          <div className="space-y-6">
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Judges</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="btn-primary" data-testid="create-judge-btn">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Judge
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-white">Create New Judge</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateJudge} className="space-y-4">
                      <div>
                        <Label className="text-slate-300">Judge ID</Label>
                        <Input
                          data-testid="judge-id-input"
                          value={newJudge.judge_id}
                          onChange={(e) =>
                            setNewJudge({ ...newJudge, judge_id: e.target.value })
                          }
                          className="input-ocean"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Name</Label>
                        <Input
                          data-testid="judge-name-input"
                          value={newJudge.name}
                          onChange={(e) => setNewJudge({ ...newJudge, name: e.target.value })}
                          className="input-ocean"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Password</Label>
                        <Input
                          data-testid="judge-password-input"
                          type="password"
                          value={newJudge.password}
                          onChange={(e) =>
                            setNewJudge({ ...newJudge, password: e.target.value })
                          }
                          className="input-ocean"
                          required
                        />
                      </div>
                      <Button type="submit" className="btn-primary w-full" data-testid="submit-judge-btn">
                        Create Judge
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {judges.map((judge) => (
                  <div
                    key={judge.judge_id}
                    data-testid={`judge-${judge.judge_id}`}
                    className="glass-card p-4 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <Gavel className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{judge.name}</p>
                        <p className="text-sm text-slate-400">ID: {judge.judge_id}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {judges.length === 0 && (
                  <p className="text-center text-slate-400 py-8">No judges added yet</p>
                )}
              </div>
            </Card>

            {/* Team Password */}
            <Card className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Set Team Password</h2>
              <form onSubmit={handleSetTeamPassword} className="flex gap-3">
                <Input
                  data-testid="team-password-input"
                  type="text"
                  value={teamPassword}
                  onChange={(e) => setTeamPassword(e.target.value)}
                  placeholder="Enter common password for all teams"
                  className="input-ocean flex-1"
                  required
                />
                <Button type="submit" className="btn-primary" data-testid="set-team-password-btn">
                  Set Password
                </Button>
              </form>
              <p className="text-sm text-slate-400 mt-2">
                Teams will use this password with their team name to login
              </p>
            </Card>
          </div>
        )}

        {/* Criteria Tab */}
        {activeTab === 'criteria' && (
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Judging Criteria</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="btn-primary" data-testid="create-criteria-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Criteria
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Criteria</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateCriteria} className="space-y-4">
                    <div>
                      <Label className="text-slate-300">Criteria Name</Label>
                      <Input
                        data-testid="criteria-name-input"
                        value={newCriteria.name}
                        onChange={(e) => setNewCriteria({ ...newCriteria, name: e.target.value })}
                        placeholder="e.g., Innovation, Implementation"
                        className="input-ocean"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Max Score</Label>
                      <Input
                        data-testid="criteria-maxscore-input"
                        type="number"
                        value={newCriteria.max_score}
                        onChange={(e) =>
                          setNewCriteria({ ...newCriteria, max_score: parseInt(e.target.value) })
                        }
                        className="input-ocean"
                        min="1"
                        required
                      />
                    </div>
                    <Button type="submit" className="btn-primary w-full" data-testid="submit-criteria-btn">
                      Create Criteria
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {criteria.map((c) => (
                <div
                  key={c.id}
                  data-testid={`criteria-${c.id}`}
                  className="glass-card p-4 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white">{c.name}</p>
                    <p className="text-sm text-slate-400">Max Score: {c.max_score}</p>
                  </div>
                  <Button
                    onClick={() => handleDeleteCriteria(c.id)}
                    data-testid={`delete-criteria-${c.id}-btn`}
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {criteria.length === 0 && (
                <p className="text-center text-slate-400 py-8">No criteria added yet</p>
              )}
            </div>
          </Card>
        )}

        {/* Timer Tab */}
        {activeTab === 'timer' && (
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6">Hackathon Timer</h2>

            <div className="space-y-6">
              {timer?.is_active && (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-2">Time Remaining</p>
                  <div className="timer-display">
                    {Math.floor((timer.time_remaining || 0) / 3600)}h{' '}
                    {Math.floor(((timer.time_remaining || 0) % 3600) / 60)}m{' '}
                    {(timer.time_remaining || 0) % 60}s
                  </div>
                  <p className="text-sm text-slate-400 mt-4">
                    Ends at: {new Date(timer.end_time).toLocaleString()}
                  </p>
                  <Button
                    onClick={handleStopTimer}
                    data-testid="stop-timer-btn"
                    className="btn-secondary mt-4"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Timer
                  </Button>
                </div>
              )}

              {!timer?.is_active && (
                <div className="space-y-4">
                  {!showTimerPicker ? (
                    <Button
                      onClick={() => setShowTimerPicker(true)}
                      data-testid="open-timer-picker-btn"
                      className="btn-primary w-full"
                    >
                      <Timer className="w-4 h-4 mr-2" />
                      Set Hackathon End Time
                    </Button>
                  ) : (
                    <div className="bg-slate-800/50 rounded-lg p-6">
                      <TimerPicker
                        onConfirm={handleTimerConfirm}
                        onCancel={() => setShowTimerPicker(false)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}