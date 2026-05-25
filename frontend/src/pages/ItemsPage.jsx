import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, AlertCircle } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import ClaimModal from '../components/ClaimModal';
import Spinner from '../components/Spinner';

const CATEGORIES = ['All', 'Electronics', 'Personal Effects', 'Documents', 'Other'];
const TYPES = ['All', 'Lost', 'Found'];
const STATUSES = ['All', 'Active', 'Resolved'];

export default function ItemsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [claimItem, setClaimItem] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (typeFilter !== 'All') params.set('type', typeFilter);
      if (categoryFilter !== 'All') params.set('category', categoryFilter);
      if (statusFilter !== 'All') params.set('status', statusFilter);
      const { data } = await api.get(`/items?${params.toString()}`);
      setItems(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load items.');
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, categoryFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchItems, 300);
    return () => clearTimeout(timer);
  }, [fetchItems]);

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('All');
    setCategoryFilter('All');
    setStatusFilter('Active');
  };

  const hasFilters = search || typeFilter !== 'All' || categoryFilter !== 'All' || statusFilter !== 'Active';

  return (
    <div className="dashboard-main-area min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Browse Items</h1>
          <p className="text-sm text-muted-foreground">Search lost and found items reported on campus</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                placeholder="Search by title or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>

          {/* Type + Status tabs */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-border bg-muted p-1">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    typeFilter === t
                      ? t === 'Lost'
                        ? 'bg-destructive text-destructive-foreground shadow-xs'
                        : t === 'Found'
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-border bg-muted p-1">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    statusFilter === s
                      ? s === 'Resolved'
                        ? 'bg-green-600 text-white shadow-xs'
                        : 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle size={16} />
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <Filter size={24} className="text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">No items found</p>
            <p className="text-sm text-muted-foreground">
              {hasFilters ? 'Try adjusting your filters.' : 'No items have been reported yet.'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {items.length} item{items.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  onClaim={user ? setClaimItem : null}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {claimItem && (
        <ClaimModal
          item={claimItem}
          onClose={() => setClaimItem(null)}
          onSuccess={() => setClaimItem(null)}
        />
      )}
    </div>
  );
}
