import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getStoredAuth, clearAuth } from '@/utils/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { toast } from 'sonner';
import { Users, LogOut, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';

export default function JudgeDashboard() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('teams');
  const [scoringTeam, setScoringTeam] = useState(null);
  const [scores, setScores] = useState({});
  const { identifier } = getStoredAuth();

  const loadData = useCallback(async () => {
    try {
      const [teamsRes, criteriaRes, leaderboardRes] = await Promise.all([
        api.get('/judge/teams'),
        api.get('/judge/criteria'),
        api.get('/judge/leaderboard'),
      ]);

      setTeams(teamsRes.data);
      setCriteria(criteriaRes.data);
      setLeaderboard(leaderboardRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    }
  }, []);

  useEffect(() => {
    const { role } = getStoredAuth();
    if (role !== 'judge') {
      navigate('/');
      return;
    }
    loadData();
  }, [navigate, loadData]);

  const handleWebSocketMessage = useCallback((message) => {
    if (message.type === 'score_update' || message.type === 'leaderboard_update') {
      loadData();
    }
  }, [loadData]);

  // Use WebSocket for real-time updates
  useWebSocket(identifier, 'judge', handleWebSocketMessage);

  const handleOpenScoring = (team) => {
    setScoringTeam(team);
    const initialScores = {};
    criteria.forEach((c) => {
      initialScores[c.name] = 0;
    });
    setScores(initialScores);
  };

  const handleSubmitScore = async () => {
    try {
      await api.post('/judge/score', {
        team_name: scoringTeam.team_name,
        scores,
      });
      toast.success('Score submitted successfully');
      setScoringTeam(null);
      loadData();
    } catch (error) {
      toast.error('Failed to submit score');
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
            <h1 className="text-2xl font-black text-white glow-text">Judge Dashboard</h1>
            <p className="text-sm text-slate-400">Evaluate teams</p>
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
        <div className="flex gap-2 mb-8">
          {[
            { id: 'teams', label: 'Teams', icon: Users },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          ].map((tab) => (
            <button
              key={tab.id}
              data-testid={`tab-${tab.id}-btn`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
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

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card
                key={team.team_name}
                data-testid={`team-card-${team.team_name}`}
                className="glass-card p-6 hover:border-cyan-500/30 transition-all duration-300"
              >
                {team.photo_url && (
                  <div className="mb-4 rounded-xl overflow-hidden">
                    <img
                      src={team.photo_url}
                      alt={team.team_name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{team.team_name}</h3>
                {team.leader_name && (
                  <p className="text-sm text-slate-400 mb-1">Leader: {team.leader_name}</p>
                )}
                {team.project_name && (
                  <p className="text-sm text-cyan-400 font-semibold mb-2">
                    {team.project_name}
                  </p>
                )}
                {team.project_description && (
                  <p className="text-sm text-slate-300 mb-4">{team.project_description}</p>
                )}
                {team.members && team.members.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-1">Members:</p>
                    <p className="text-sm text-slate-300">{team.members.join(', ')}</p>
                  </div>
                )}
                <Button
                  onClick={() => handleOpenScoring(team)}
                  data-testid={`score-team-${team.team_name}-btn`}
                  className="btn-primary w-full mt-2"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Score Team
                </Button>
              </Card>
            ))}
            {teams.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-400">No teams registered yet</p>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
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
                    <p className="text-2xl font-bold text-cyan-400 mono">{entry.total_score}</p>
                    <p className="text-xs text-slate-500">points</p>
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <p className="text-center text-slate-400 py-8">No scores yet</p>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Scoring Dialog */}
      {scoringTeam && (
        <Dialog open={!!scoringTeam} onOpenChange={() => setScoringTeam(null)}>
          <DialogContent className="glass-card border-white/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white text-2xl">
                Score: {scoringTeam.team_name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {criteria.map((c) => (
                <div key={c.id} data-testid={`score-criteria-${c.name}`}>
                  <Label className="text-slate-300 mb-2 block">
                    {c.name} (Max: {c.max_score})
                  </Label>
                  <Input
                    type="number"
                    data-testid={`score-input-${c.name}`}
                    value={scores[c.name] || 0}
                    onChange={(e) =>
                      setScores({ ...scores, [c.name]: parseInt(e.target.value) || 0 })
                    }
                    min="0"
                    max={c.max_score}
                    className="input-ocean"
                  />
                </div>
              ))}

              {criteria.length === 0 && (
                <p className="text-center text-slate-400 py-8">
                  No criteria set by admin. Please contact admin.
                </p>
              )}
            </div>

            {criteria.length > 0 && (
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => setScoringTeam(null)}
                  variant="outline"
                  className="btn-secondary flex-1"
                  data-testid="cancel-score-btn"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitScore}
                  className="btn-primary flex-1"
                  data-testid="submit-score-btn"
                >
                  Submit Score
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}