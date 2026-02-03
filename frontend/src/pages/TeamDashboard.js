import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getStoredAuth, clearAuth } from '@/utils/api';
import { toast } from 'sonner';
import { LogOut, Timer, User, Users, FileText, Image, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

export default function TeamDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    team_name: '',
    leader_name: '',
    members: [],
    project_name: '',
    project_description: '',
    project_url: '',
    photo_url: '',
  });
  const [memberInput, setMemberInput] = useState('');
  const [timer, setTimer] = useState(null);
  const [score, setScore] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const { role } = getStoredAuth();
    if (role !== 'team') {
      navigate('/');
      return;
    }
    loadData();
  }, [navigate]);

  useEffect(() => {
    if (timer?.is_active && timer.time_remaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const loadData = async () => {
    try {
      const [profileRes, timerRes, scoreRes] = await Promise.all([
        api.get('/team/profile'),
        api.get('/team/timer'),
        api.get('/team/score'),
      ]);

      setProfile(profileRes.data);
      setTimer(timerRes.data);
      setTimeRemaining(timerRes.data.time_remaining || 0);
      setScore(scoreRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/team/profile', profile);
      toast.success('Profile updated successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAddMember = () => {
    if (memberInput.trim()) {
      setProfile({
        ...profile,
        members: [...(profile.members || []), memberInput.trim()],
      });
      setMemberInput('');
    }
  };

  const handleRemoveMember = (index) => {
    const newMembers = [...(profile.members || [])];
    newMembers.splice(index, 1);
    setProfile({ ...profile, members: newMembers });
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="ocean-bg min-h-screen">
      {/* Header */}
      <div className="glass-card border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white glow-text">Team Dashboard</h1>
            <p className="text-sm text-slate-400">{profile.team_name}</p>
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
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Timer & Score */}
          <div className="space-y-6">
            {/* Timer */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Timer className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Hackathon Timer</h2>
              </div>

              {timer?.is_active ? (
                <div className="text-center py-4">
                  <div className="timer-display text-3xl" data-testid="timer-display">
                    {formatTime(timeRemaining)}
                  </div>
                  <p className="text-sm text-slate-400 mt-2">Time Remaining</p>
                </div>
              ) : (
                <p className="text-center text-slate-400 py-4">Timer not started yet</p>
              )}
            </Card>

            {/* Score */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Your Score</h2>
              </div>

              {score && score.judge_count > 0 ? (
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-cyan-400 mono" data-testid="team-score">
                    {score.total_score}
                  </div>
                  <p className="text-sm text-slate-400 mt-2">
                    Scored by {score.judge_count} judge{score.judge_count !== 1 ? 's' : ''}
                  </p>
                </div>
              ) : (
                <p className="text-center text-slate-400 py-4">Not scored yet</p>
              )}
            </Card>
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2">
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Team Profile</h2>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Leader Name */}
                <div>
                  <Label className="text-slate-300 flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    Leader Name
                  </Label>
                  <Input
                    data-testid="leader-name-input"
                    value={profile.leader_name || ''}
                    onChange={(e) => setProfile({ ...profile, leader_name: e.target.value })}
                    className="input-ocean"
                    placeholder="Enter leader name"
                  />
                </div>

                {/* Members */}
                <div>
                  <Label className="text-slate-300 flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4" />
                    Team Members
                  </Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      data-testid="member-input"
                      value={memberInput}
                      onChange={(e) => setMemberInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
                      className="input-ocean flex-1"
                      placeholder="Add member name"
                    />
                    <Button
                      type="button"
                      data-testid="add-member-btn"
                      onClick={handleAddMember}
                      className="btn-primary"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(profile.members || []).map((member, index) => (
                      <div
                        key={index}
                        data-testid={`member-${index}`}
                        className="glass-card px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                      >
                        <span className="text-white">{member}</span>
                        <button
                          type="button"
                          data-testid={`remove-member-${index}-btn`}
                          onClick={() => handleRemoveMember(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Name */}
                <div>
                  <Label className="text-slate-300 flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4" />
                    Project Name
                  </Label>
                  <Input
                    data-testid="project-name-input"
                    value={profile.project_name || ''}
                    onChange={(e) => setProfile({ ...profile, project_name: e.target.value })}
                    className="input-ocean"
                    placeholder="Enter project name"
                  />
                </div>

                {/* Project Description */}
                <div>
                  <Label className="text-slate-300 mb-2 block">Project Description</Label>
                  <Textarea
                    data-testid="project-description-input"
                    value={profile.project_description || ''}
                    onChange={(e) =>
                      setProfile({ ...profile, project_description: e.target.value })
                    }
                    className="input-ocean min-h-[120px]"
                    placeholder="Describe your project"
                  />
                </div>

                {/* Project URL */}
                <div>
                  <Label className="text-slate-300 mb-2 block">Project URL / GitHub</Label>
                  <Input
                    data-testid="project-url-input"
                    value={profile.project_url || ''}
                    onChange={(e) => setProfile({ ...profile, project_url: e.target.value })}
                    className="input-ocean"
                    placeholder="https://github.com/..."
                  />
                </div>

                {/* Photo URL */}
                <div>
                  <Label className="text-slate-300 flex items-center gap-2 mb-2">
                    <Image className="w-4 h-4" />
                    Team Photo URL
                  </Label>
                  <Input
                    data-testid="photo-url-input"
                    value={profile.photo_url || ''}
                    onChange={(e) => setProfile({ ...profile, photo_url: e.target.value })}
                    className="input-ocean"
                    placeholder="https://..."
                  />
                  {profile.photo_url && (
                    <div className="mt-3 rounded-xl overflow-hidden">
                      <img
                        src={profile.photo_url}
                        alt="Team"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  data-testid="save-profile-btn"
                  className="btn-primary w-full py-3 text-lg"
                >
                  Save Profile
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}