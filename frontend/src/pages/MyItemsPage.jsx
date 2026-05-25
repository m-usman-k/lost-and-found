import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Package, AlertCircle } from 'lucide-react';
import api from '../api/client';
import ItemCard from '../components/ItemCard';
import Spinner from '../components/Spinner';

export default function MyItemsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItems = () => {
    setLoading(true);
    api.get('/items/me')
      .then(({ data }) => setItems(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load your items.'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchItems, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    try {
      await api.delete(`/items/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item.');
    }
  };

  const handleResolve = (id) => {
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, status: 'Resolved' } : i))
    );
  };

  const active = items.filter((i) => i.status !== 'Resolved');
  const resolved = items.filter((i) => i.status === 'Resolved');

  return (
    <div className="dashboard-main-area min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">My Items</h1>
            <p className="text-sm text-muted-foreground">Items you have reported</p>
          </div>
          <button
            onClick={() => navigate('/report')}
            className="hover-elevate flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium border border-primary-border transition-colors"
          >
            <PlusCircle size={15} />
            Report Item
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle size={16} />
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Package size={28} className="text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">No items yet</p>
              <p className="text-sm text-muted-foreground">Report a lost or found item to get started.</p>
            </div>
            <button
              onClick={() => navigate('/report')}
              className="hover-elevate flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium border border-primary-border transition-colors"
            >
              <PlusCircle size={15} />
              Report Item
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {active.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Active ({active.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {active.map((item) => (
                    <ItemCard
                      key={item._id}
                      item={item}
                      onEdit={(i) => navigate(`/edit/${i._id}`)}
                      onDelete={handleDelete}
                      onResolve={handleResolve}
                    />
                  ))}
                </div>
              </div>
            )}

            {resolved.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Resolved ({resolved.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {resolved.map((item) => (
                    <ItemCard key={item._id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
