import { useState } from 'react';
import { AlertCircle, CheckCircle2, User } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const { data } = await api.put('/auth/updatedetails', form);
      updateUser({ ...user, name: data.data.name, email: data.data.email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const roleColor =
    user?.role === 'admin'
      ? 'bg-primary/10 text-primary border-primary/20'
      : 'bg-muted text-muted-foreground border-border';

  return (
    <div className="dashboard-main-area min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-lg px-4 sm:px-6 py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your account details</p>
        </div>

        {/* Avatar & role card */}
        <div className="rounded-2xl border border-card-border bg-card shadow-xs p-5 flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl font-bold select-none">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{user?.name}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${roleColor}`}
          >
            {user?.role}
          </span>
        </div>

        {/* Edit form */}
        <div className="rounded-2xl border border-card-border bg-card shadow-xs p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Update Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
                <CheckCircle2 size={14} className="shrink-0" />
                Profile updated successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="hover-elevate w-full rounded-lg bg-primary text-primary-foreground text-sm font-semibold py-2.5 border border-primary-border transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Spinner size="sm" />}
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
