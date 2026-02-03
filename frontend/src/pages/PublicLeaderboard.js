import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/utils/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Trophy, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PublicLeaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);

  const loadLeaderboard = useCallback(async () => {
    try {
      const response = await api.get('/public/leaderboard');
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Failed to load leaderboard');
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const handleWebSocketMessage = useCallback((message) => {
    if (message.type === 'score_update' || message.type === 'leaderboard_update') {
      loadLeaderboard();
    }
  }, [loadLeaderboard]);

  // Use WebSocket for real-time updates (public user)
  useWebSocket('public', 'public', handleWebSocketMessage);

  return (
    <div className="ocean-bg min-h-screen">
      {/* Header */}
      <div className="glass-card border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white glow-text">Public Leaderboard</h1>
            <p className="text-sm text-slate-400">Live rankings</p>
          </div>
          <Button
            onClick={() => navigate('/')}
            data-testid="back-to-login-btn"
            variant="outline"
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <Card className="glass-card p-8">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">Rankings</h2>
          </div>

          <div className="space-y-4">
            {leaderboard.map((entry) => (
              <div
                key={entry.team_name}
                data-testid={`leaderboard-entry-${entry.team_name}`}
                className="leaderboard-row glass-card p-6 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
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
                    <p className="text-xl font-bold text-white">{entry.team_name}</p>
                    <p className="text-sm text-slate-400">
                      {entry.judge_count} judge{entry.judge_count !== 1 ? 's' : ''} scored
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-cyan-400 mono">{entry.total_score}</p>
                  <p className="text-xs text-slate-500">points</p>
                </div>
              </div>
            ))}
            {leaderboard.length === 0 && (
              <div className="text-center py-16">
                <Trophy className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No teams scored yet</p>
                <p className="text-slate-500 text-sm mt-2">
                  Check back later for live rankings
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}