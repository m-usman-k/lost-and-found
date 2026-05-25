import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, FileText, AlertCircle, MapPin, Tag } from 'lucide-react';
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

export default function MyClaimsPage() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/claims/me')
      .then(({ data }) => setClaims(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load your claims.'))
      .finally(() => setLoading(false));
  }, []);

  const grouped = {
    Pending: claims.filter((c) => c.status === 'Pending'),
    Approved: claims.filter((c) => c.status === 'Approved'),
    Rejected: claims.filter((c) => c.status === 'Rejected'),
  };

  return (
    <div className="dashboard-main-area min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">My Claims</h1>
          <p className="text-sm text-muted-foreground">Track the status of your ownership claims</p>
        </div>

        {/* Summary strip */}
        {!loading && !error && claims.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(grouped).map(([status, list]) => {
              const cfg = STATUS_CONFIG[status];
              return (
                <div key={status} className="rounded-xl border border-card-border bg-card shadow-xs p-4 text-center space-y-1">
                  <p className="text-2xl font-bold text-foreground">{list.length}</p>
                  <div className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${cfg.cls}`}>
                    {cfg.icon}
                    {status}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle size={16} />
            {error}
          </div>
        ) : claims.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <FileText size={24} className="text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">No claims yet</p>
            <p className="text-sm text-muted-foreground">
              Browse found items and submit a claim if something belongs to you.
            </p>
            <button
              onClick={() => navigate('/')}
              className="hover-elevate px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium border border-primary-border transition-colors"
            >
              Browse Items
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {claims.map((claim) => {
              const cfg = STATUS_CONFIG[claim.status] || STATUS_CONFIG.Pending;
              return (
                <div
                  key={claim._id}
                  className="rounded-xl border border-card-border bg-card shadow-xs p-5 space-y-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => claim.item && navigate(`/items/${claim.item._id}`)}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="space-y-1.5 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {claim.item?.title ?? 'Item no longer available'}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {claim.item?.type && (
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
                            claim.item.type === 'Lost'
                              ? 'bg-destructive/10 text-destructive border-destructive/20'
                              : 'bg-primary/10 text-primary border-primary/20'
                          }`}>
                            {claim.item.type}
                          </span>
                        )}
                        {claim.item?.category && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted text-muted-foreground px-2 py-0.5 text-xs">
                            <Tag size={10} />
                            {claim.item.category}
                          </span>
                        )}
                        {claim.item?.location && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin size={10} />
                            {claim.item.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`shrink-0 flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.cls}`}>
                      {cfg.icon}
                      {claim.status}
                    </span>
                  </div>

                  <div className="rounded-lg border border-border bg-background/60 px-3 py-2.5">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Your proof:</p>
                    <p className="text-sm text-foreground leading-relaxed line-clamp-3">{claim.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Submitted {new Date(claim.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    {claim.status === 'Approved' && (
                      <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                        Contact the finder to collect your item
                      </p>
                    )}
                    {claim.status === 'Rejected' && (
                      <p className="text-xs text-destructive font-medium">
                        Your claim was not approved
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
