import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';
import api from '../api/client';
import Spinner from '../components/Spinner';

const STATUS_CONFIG = {
  Pending: {
    icon: <Clock size={13} />,
    cls: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  },
  Approved: {
    icon: <CheckCircle2 size={13} />,
    cls: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  },
  Rejected: {
    icon: <XCircle size={13} />,
    cls: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    api.get('/claims')
      .then(({ data }) => setClaims(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load claims.'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (claimId, status) => {
    setUpdating(claimId + status);
    try {
      const { data } = await api.put(`/claims/${claimId}`, { status });
      setClaims((prev) =>
        prev.map((c) => (c._id === claimId ? { ...c, status: data.data.status } : c))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update claim.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="dashboard-main-area min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <ShieldCheck size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Claims Management</h1>
            <p className="text-sm text-muted-foreground">Review and respond to ownership claims</p>
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
        ) : claims.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <ShieldCheck size={24} className="text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">No claims yet</p>
            <p className="text-sm text-muted-foreground">Claims will appear here when users submit them.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {claims.map((claim) => {
              const cfg = STATUS_CONFIG[claim.status] || STATUS_CONFIG.Pending;
              return (
                <div
                  key={claim._id}
                  className="rounded-xl border border-card-border bg-card shadow-xs p-5 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground truncate">
                          {claim.item?.title ?? 'Unknown item'}
                        </span>
                        {claim.item?.type && (
                          <span
                            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                              claim.item.type === 'Lost'
                                ? 'bg-destructive/10 text-destructive border-destructive/20'
                                : 'bg-primary/10 text-primary border-primary/20'
                            }`}
                          >
                            {claim.item.type}
                          </span>
                        )}
                        {claim.item?.category && (
                          <span className="rounded-full border border-border bg-muted text-muted-foreground px-2 py-0.5 text-xs">
                            {claim.item.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Claimed by{' '}
                        <span className="font-medium text-foreground">{claim.user?.name}</span>{' '}
                        &lt;{claim.user?.email}&gt;
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(claim.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.cls}`}
                    >
                      {cfg.icon}
                      {claim.status}
                    </span>
                  </div>

                  <div className="rounded-lg border border-border bg-background/60 px-3 py-2.5">
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Ownership proof:
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">{claim.description}</p>
                  </div>

                  {claim.status === 'Pending' && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => updateStatus(claim._id, 'Approved')}
                        disabled={!!updating}
                        className="hover-elevate flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-green-300 bg-green-50 text-green-700 text-xs font-semibold py-2 transition-colors disabled:opacity-60 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
                      >
                        {updating === claim._id + 'Approved' ? (
                          <Spinner size="sm" />
                        ) : (
                          <CheckCircle2 size={13} />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(claim._id, 'Rejected')}
                        disabled={!!updating}
                        className="hover-elevate flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs font-semibold py-2 transition-colors disabled:opacity-60"
                      >
                        {updating === claim._id + 'Rejected' ? (
                          <Spinner size="sm" />
                        ) : (
                          <XCircle size={13} />
                        )}
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
