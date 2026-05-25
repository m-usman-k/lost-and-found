import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import api from '../api/client';
import Spinner from './Spinner';

export default function ClaimModal({ item, onClose, onSuccess }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please describe how you can prove ownership.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/claims', { itemId: item._id, description });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit claim.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-popover-border bg-popover shadow-2xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Submit a Claim</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Claiming: <span className="font-medium text-foreground">{item.title}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover-elevate rounded-lg p-1.5 text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="claim-desc">
              Proof of Ownership
            </label>
            <textarea
              id="claim-desc"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe identifying features, serial numbers, or circumstances that prove this item belongs to you..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">{description.length}/1000</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="hover-elevate flex-1 rounded-lg border border-border bg-secondary text-secondary-foreground text-sm font-medium py-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="hover-elevate flex-1 rounded-lg bg-primary text-primary-foreground text-sm font-medium py-2 border border-primary-border transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Spinner size="sm" />}
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
