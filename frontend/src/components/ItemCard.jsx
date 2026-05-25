import { MapPin, Calendar, User, Tag, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { useState } from 'react';

const CATEGORY_COLORS = {
  Electronics: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'Personal Effects': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Documents: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Other: 'bg-muted text-muted-foreground',
};

export default function ItemCard({ item, onClaim, onEdit, onDelete, onResolve }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [resolving, setResolving] = useState(false);

  const isOwner = user && item.user && (item.user._id === user.id || item.user === user.id);
  const canManage = isOwner || isAdmin;
  const isResolved = item.status === 'Resolved';

  const formattedDate = new Date(item.date || item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleResolve = async (e) => {
    e.stopPropagation();
    if (!confirm('Mark this item as Resolved? This means it has been returned to its owner.')) return;
    setResolving(true);
    try {
      await api.put(`/items/${item._id}`, { status: 'Resolved' });
      onResolve?.(item._id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve item.');
    } finally {
      setResolving(false);
    }
  };

  return (
    <div
      className={`hover-elevate group relative flex flex-col rounded-xl border shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer ${
        isResolved
          ? 'border-muted bg-muted/40 opacity-80'
          : 'border-card-border bg-card'
      }`}
      onClick={() => navigate(`/items/${item._id}`)}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${isResolved ? 'bg-muted-foreground/30' : item.type === 'Lost' ? 'bg-destructive' : 'bg-primary'}`} />

      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border ${
              isResolved
                ? 'bg-muted text-muted-foreground border-border'
                : item.type === 'Lost'
                ? 'bg-destructive/10 text-destructive border-destructive/20'
                : 'bg-primary/10 text-primary border-primary/20'
            }`}
          >
            {item.type}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border border-transparent ${
              CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other
            }`}
          >
            <Tag size={10} />
            {item.category}
          </span>
          {isResolved && (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
              <CheckCircle2 size={10} />
              Resolved
            </span>
          )}
        </div>

        {/* Title & description */}
        <div>
          <h3 className="font-semibold text-foreground leading-snug line-clamp-1">{item.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Meta */}
        <div className="mt-auto space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar size={12} className="shrink-0" />
            <span>{formattedDate}</span>
          </div>
          {item.user?.name && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User size={12} className="shrink-0" />
              <span className="truncate">{item.user.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions footer */}
      <div
        className="flex flex-wrap gap-2 px-4 py-3 border-t border-card-border bg-muted/30"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => navigate(`/items/${item._id}`)}
          className="hover-elevate flex items-center gap-1 flex-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium py-1.5 border border-secondary-border transition-colors justify-center"
        >
          <MessageSquare size={12} />
          View & Comment
        </button>

        {!isResolved && user && !isOwner && item.type === 'Found' && onClaim && (
          <button
            onClick={() => onClaim(item)}
            className="hover-elevate flex-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium py-1.5 border border-primary-border transition-colors"
          >
            Claim
          </button>
        )}

        {canManage && !isResolved && (
          <>
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="hover-elevate flex-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium py-1.5 border border-secondary-border transition-colors"
              >
                Edit
              </button>
            )}
            {onResolve && (
              <button
                onClick={handleResolve}
                disabled={resolving}
                className="hover-elevate flex-1 rounded-lg text-green-700 border border-green-300 bg-green-50 text-xs font-medium py-1.5 transition-colors disabled:opacity-60 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
              >
                {resolving ? '…' : 'Resolve'}
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item._id)}
                className="hover-elevate flex-1 rounded-lg text-destructive border border-destructive/30 bg-destructive/5 text-xs font-medium py-1.5 transition-colors"
              >
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
