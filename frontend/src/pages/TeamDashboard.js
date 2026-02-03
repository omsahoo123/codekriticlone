import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getStoredAuth, clearAuth } from '@/utils/api';
import { toast } from 'sonner';
import { LogOut, Timer, Trophy, Edit2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import QRCode from 'qrcode';

export default function TeamDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('members');
  const [profile, setProfile] = useState({
    team_name: '',
    leader_name: '',
    members: [],
    project_name: '',
    project_description: '',
    project_url: '',
    photo_url: '',
  });
  const [members, setMembers] = useState([]);
  const [timer, setTimer] = useState(null);
  const [score, setScore] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [editingMember, setEditingMember] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

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
      
      if (profileRes.data.members_details) {
        setMembers(profileRes.data.members_details);
      }
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/team/profile', {
        ...profile,
        members_details: members,
      });
      toast.success('Profile updated successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleEditMember = (member) => {
    setEditingMember({ ...member });
    setShowEditDialog(true);
  };

  const handleSaveMember = async () => {
    if (editingMember.id) {
      setMembers(members.map(m => m.id === editingMember.id ? editingMember : m));
    } else {
      setMembers([...members, { ...editingMember, id: Date.now() }]);
    }
    setShowEditDialog(false);
    setEditingMember(null);
    
    // Save to database immediately
    try {
      await api.put('/team/profile', {
        ...profile,
        members_details: editingMember.id 
          ? members.map(m => m.id === editingMember.id ? editingMember : m)
          : [...members, { ...editingMember, id: Date.now() }],
      });
      toast.success('Member saved successfully');
    } catch (error) {
      toast.error('Failed to save member');
    }
  };

  const handleDeleteMember = async (id) => {
    const updatedMembers = members.filter(m => m.id !== id);
    setMembers(updatedMembers);
    
    // Save to database immediately
    try {
      await api.put('/team/profile', {
        ...profile,
        members_details: updatedMembers,
      });
      toast.success('Member deleted successfully');
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  const handleDownloadIDCard = (member) => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(30, 30, 100, 120);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Photo', 80, 85);

    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(member.name || 'N/A', 150, 60);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Arial';
    ctx.fillText(member.role || 'Team Member', 150, 80);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px Arial';
    let yPos = 120;
    ctx.fillText(`Email: ${member.email || 'N/A'}`, 30, yPos);
    yPos += 25;
    ctx.fillText(`Phone: ${member.phone || 'N/A'}`, 30, yPos);
    yPos += 25;
    ctx.fillText(`Gender: ${member.gender || 'N/A'}`, 30, yPos);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(30, 400, 100, 100);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QR Code', 80, 450);

    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = `${member.name}_ID_Card.png`;
    link.click();
    toast.success('ID Card downloaded!');
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const generateQRCode = (member) => {
    const qrData = JSON.stringify({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
    });
    return qrData;
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // QR Code Display Component
  const QRCodeDisplay = ({ member, generateQRCode }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
      const qrData = generateQRCode(member);
      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, qrData, {
          width: 100,
          margin: 2,
          color: {
            dark: '#06b6d4',
            light: '#0f172a',
          },
        }).catch((err) => {
          console.error('QR Code generation error:', err);
        });
      }
    }, [member, generateQRCode]);

    return <canvas ref={canvasRef} className="mx-auto" />;
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
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'members', label: 'Team Members' },
            { id: 'project', label: 'Project Details' },
            { id: 'status', label: 'Status' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900/50 text-slate-300 hover:bg-slate-800/70 border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Team Members Tab */}
        {activeTab === 'members' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-cyan-400">Team Members</h2>
              <Button
                onClick={() => {
                  setEditingMember({
                    id: null,
                    name: '',
                    email: '',
                    phone: '',
                    gender: '',
                    role: 'Team Member',
                    photo_url: '',
                  });
                  setShowEditDialog(true);
                }}
                className="btn-primary"
              >
                + Add Member
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {members.map((member) => (
                <Card
                  key={member.id}
                  className="glass-card p-6 border-cyan-500/30 hover:border-cyan-500/60 transition-all"
                >
                  <div className="flex gap-4 mb-4">
                    {/* Photo */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-cyan-500/50 flex-shrink-0">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                          <span className="text-slate-400 text-xs">No Photo</span>
                        </div>
                      )}
                    </div>

                    {/* Name & Role */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-cyan-400">{member.name}</h3>
                      <p className="text-sm text-slate-400">{member.role}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-cyan-400">Email:</span>
                      <span className="text-slate-300">{member.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-400">Phone:</span>
                      <span className="text-slate-300">{member.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-400">Gender:</span>
                      <span className="text-slate-300">{member.gender || 'N/A'}</span>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center mb-4 p-3 bg-slate-900/50 rounded-lg">
                    <QRCodeDisplay member={member} generateQRCode={generateQRCode} />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditMember(member)}
                      className="btn-primary flex-1"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Details
                    </Button>
                    <Button
                      onClick={() => handleDownloadIDCard(member)}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download ID
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {members.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">No team members added yet</p>
              </div>
            )}
          </div>
        )}

        {/* Project Details Tab */}
        {activeTab === 'project' && (
          <Card className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Project Details</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Project Name */}
              <div>
                <Label className="text-slate-300 mb-2 block">Project Name</Label>
                <Input
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
                  value={profile.project_description || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, project_description: e.target.value })
                  }
                  className="input-ocean min-h-[150px]"
                  placeholder="Describe your project"
                />
              </div>

              {/* Project URL */}
              <div>
                <Label className="text-slate-300 mb-2 block">Project URL / GitHub</Label>
                <Input
                  value={profile.project_url || ''}
                  onChange={(e) => setProfile({ ...profile, project_url: e.target.value })}
                  className="input-ocean"
                  placeholder="https://github.com/..."
                />
              </div>

              <Button type="submit" className="btn-primary w-full py-3 text-lg">
                Save Project Details
              </Button>
            </form>
          </Card>
        )}

        {/* Status Tab */}
        {activeTab === 'status' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Timer */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Timer className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Hackathon Timer</h2>
              </div>

              {timer?.is_active ? (
                <div className="text-center py-8">
                  <div className="timer-display text-4xl font-bold text-cyan-400">
                    {formatTime(timeRemaining)}
                  </div>
                  <p className="text-sm text-slate-400 mt-2">Time Remaining</p>
                </div>
              ) : (
                <p className="text-center text-slate-400 py-8">Timer not started yet</p>
              )}
            </Card>

            {/* Score */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Your Score</h2>
              </div>

              {score && score.judge_count > 0 ? (
                <div className="text-center py-8">
                  <div className="text-5xl font-bold text-cyan-400">{score.total_score}</div>
                  <p className="text-sm text-slate-400 mt-2">
                    Scored by {score.judge_count} judge{score.judge_count !== 1 ? 's' : ''}
                  </p>
                </div>
              ) : (
                <p className="text-center text-slate-400 py-8">Not scored yet</p>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* Edit Member Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowEditDialog(false)} />
          <div className="glass-card border-white/10 max-w-2xl p-6 rounded-lg relative z-50">
            <div className="mb-6">
              <h2 className="text-white text-2xl font-bold">
                {editingMember?.id ? 'Edit Member' : 'Add Member'}
              </h2>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Name */}
              <div>
                <Label className="text-slate-300 mb-2 block">Full Name</Label>
                <Input
                  value={editingMember?.name || ''}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, name: e.target.value })
                  }
                  className="input-ocean"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email */}
              <div>
                <Label className="text-slate-300 mb-2 block">Email</Label>
                <Input
                  type="email"
                  value={editingMember?.email || ''}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, email: e.target.value })
                  }
                  className="input-ocean"
                  placeholder="Enter email"
                />
              </div>

              {/* Phone */}
              <div>
                <Label className="text-slate-300 mb-2 block">Phone</Label>
                <Input
                  value={editingMember?.phone || ''}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, phone: e.target.value })
                  }
                  className="input-ocean"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Gender */}
              <div>
                <Label className="text-slate-300 mb-2 block">Gender</Label>
                <select
                  value={editingMember?.gender || ''}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, gender: e.target.value })
                  }
                  className="input-ocean"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <Label className="text-slate-300 mb-2 block">Role</Label>
                <select
                  value={editingMember?.role || 'Team Member'}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, role: e.target.value })
                  }
                  className="input-ocean"
                >
                  <option value="Team Member">Team Member</option>
                  <option value="Team Lead">Team Lead</option>
                </select>
              </div>

              {/* Photo Upload - Simple File Input */}
              <div>
                <Label className="text-slate-300 mb-2 block">Member Photo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditingMember({ ...editingMember, photo_url: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="input-ocean"
                />
                {editingMember?.photo_url && (
                  <div className="mt-3 rounded-lg overflow-hidden w-24 h-24">
                    <img
                      src={editingMember.photo_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => setShowEditDialog(false)}
                variant="outline"
                className="btn-secondary flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveMember}
                className="btn-primary flex-1"
              >
                Save Member
              </Button>
              {editingMember?.id && (
                <Button
                  onClick={() => {
                    handleDeleteMember(editingMember.id);
                    setShowEditDialog(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
