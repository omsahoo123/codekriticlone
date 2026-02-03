import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, saveAuth } from '@/utils/api';
import { toast } from 'sonner';
import { Users, Gavel, Trophy } from 'lucide-react';

export default function Login() {
  const [role, setRole] = useState('team');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        role,
        identifier,
        password,
      });

      const { token, role: userRole, identifier: userId } = response.data;
      saveAuth(token, userRole, userId);
      toast.success('Login successful!');

      if (userRole === 'admin') navigate('/admin');
      else if (userRole === 'judge') navigate('/judge');
      else if (userRole === 'team') navigate('/team');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ocean-bg min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-7xl font-black text-white glow-text" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
              CODEKRITI4.O
            </h1>
            <p className="text-xl text-slate-300">
              Dive into the depths of innovation
            </p>
          </div>

          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6 hover:border-cyan-500/30 transition-colors duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">For Teams</h3>
                  <p className="text-sm text-slate-400">Track your progress and compete</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:border-cyan-500/30 transition-colors duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">For Judges</h3>
                  <p className="text-sm text-slate-400">Evaluate and score teams</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:border-cyan-500/30 transition-colors duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">For Admins</h3>
                  <p className="text-sm text-slate-400">Manage the entire hackathon</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="glass-card rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Select Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['team', 'judge', 'admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    data-testid={`role-${r}-btn`}
                    onClick={() => setRole(r)}
                    className={`py-3 px-4 rounded-xl font-semibold capitalize transition-all duration-300 ${
                      role === r
                        ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-900/50 text-slate-300 hover:bg-slate-800/70 border border-white/10'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Identifier */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                {role === 'admin'
                  ? 'Username'
                  : role === 'judge'
                  ? 'Judge ID'
                  : 'Team Name'}
              </label>
              <input
                type="text"
                data-testid="identifier-input"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="input-ocean w-full"
                placeholder={`Enter your ${role === 'admin' ? 'username' : role === 'judge' ? 'judge ID' : 'team name'}`}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                data-testid="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-ocean w-full"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              data-testid="login-submit-btn"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/leaderboard')}
              data-testid="view-leaderboard-link"
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              View Public Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}