import { useState, useEffect } from 'react';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Users,
  FileText,
  AlertCircle,
  BarChart2,
} from 'lucide-react';
import api from '../api/client';
import Spinner from '../components/Spinner';

function StatCard({ icon, label, value, sub, accent = false }) {
  return (
    <div
      className={`rounded-xl border shadow-xs p-5 space-y-3 ${
        accent
          ? 'border-primary/20 bg-primary/5'
          : 'border-card-border bg-card'
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <div
          className={`h-8 w-8 rounded-lg flex items-center justify-center ${
            accent ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
          }`}
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-foreground">{value ?? '—'}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/stats')
      .then(({ data }) => setStats(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load statistics.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-main-area min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <BarChart2 size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard Statistics</h1>
            <p className="text-sm text-muted-foreground">System-wide overview</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle size={16} />
            {error}
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Items section */}
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Items
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  icon={<Package size={16} />}
                  label="Total Items"
                  value={stats.totalItems}
                  accent
                />
                <StatCard
                  icon={<Search size={16} />}
                  label="Lost Items"
                  value={stats.lostItems}
                  sub={`${stats.totalItems ? Math.round((stats.lostItems / stats.totalItems) * 100) : 0}% of total`}
                />
                <StatCard
                  icon={<CheckCircle2 size={16} />}
                  label="Found Items"
                  value={stats.foundItems}
                  sub={`${stats.totalItems ? Math.round((stats.foundItems / stats.totalItems) * 100) : 0}% of total`}
                />
              </div>
            </div>

            {/* Claims section */}
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Claims
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  icon={<FileText size={16} />}
                  label="Total Claims"
                  value={stats.totalClaims}
                  accent
                />
                <StatCard
                  icon={<Clock size={16} />}
                  label="Pending"
                  value={stats.pendingClaims}
                  sub="Awaiting review"
                />
                <StatCard
                  icon={<CheckCircle2 size={16} />}
                  label="Approved"
                  value={stats.approvedClaims}
                  sub={`${stats.totalClaims ? Math.round((stats.approvedClaims / stats.totalClaims) * 100) : 0}% approval rate`}
                />
              </div>
            </div>

            {/* Users section */}
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Users
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <StatCard
                  icon={<Users size={16} />}
                  label="Registered Users"
                  value={stats.totalUsers}
                  accent
                />
                <div className="rounded-xl border border-card-border bg-card shadow-xs p-5 space-y-3">
                  <p className="text-sm text-muted-foreground font-medium">Resolution Rate</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.foundItems > 0
                      ? `${Math.round((stats.approvedClaims / stats.foundItems) * 100)}%`
                      : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Approved claims vs found items
                  </p>
                  {/* Progress bar */}
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${stats.foundItems > 0 ? Math.min(100, Math.round((stats.approvedClaims / stats.foundItems) * 100)) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
