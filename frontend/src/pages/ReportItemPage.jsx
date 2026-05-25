import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, PlusCircle } from 'lucide-react';
import api from '../api/client';
import Spinner from '../components/Spinner';

const CATEGORIES = ['Electronics', 'Personal Effects', 'Documents', 'Other'];

export default function ReportItemPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    type: 'Lost',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/items', form);
      setSuccess(true);
      setTimeout(() => navigate('/my-items'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create item.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="dashboard-main-area min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <CheckCircle2 size={28} className="text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Item Reported!</h2>
          <p className="text-sm text-muted-foreground">Redirecting to your items…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-main-area min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-xl px-4 sm:px-6 py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Report an Item</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details for the lost or found item.
          </p>
        </div>

        <div className="rounded-2xl border border-card-border bg-card shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type toggle */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Item Type</label>
              <div className="flex gap-2">
                {['Lost', 'Found'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                    className={`hover-elevate flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      form.type === t
                        ? t === 'Lost'
                          ? 'bg-destructive text-destructive-foreground border-destructive/80'
                          : 'bg-primary text-primary-foreground border-primary-border'
                        : 'bg-background text-foreground border-border'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="title">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={100}
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Blue Samsung phone"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="description">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                maxLength={500}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the item in detail — color, brand, condition, any unique features…"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {form.description.length}/500
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground" htmlFor="location">
                  Location <span className="text-destructive">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Library 2nd floor"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
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
                onClick={() => navigate(-1)}
                className="hover-elevate flex-1 rounded-lg border border-border bg-secondary text-secondary-foreground text-sm font-medium py-2.5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="hover-elevate flex-1 rounded-lg bg-primary text-primary-foreground text-sm font-semibold py-2.5 border border-primary-border transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <Spinner size="sm" /> : <PlusCircle size={15} />}
                Report Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
