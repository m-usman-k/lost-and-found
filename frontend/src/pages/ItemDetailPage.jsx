import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, User, Tag, ArrowLeft, CheckCircle2,
  MessageSquare, Send, Trash2, AlertCircle, Clock,
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ClaimModal from '../components/ClaimModal';
import Spinner from '../components/Spinner';

const CATEGORY_COLORS = {
  Electronics: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'Personal Effects': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Documents: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Other: 'bg-muted text-muted-foreground',
};

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingItem, setLoadingItem] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [showClaim, setShowClaim] = useState(false);
  const [resolving, setResolving] = useState(false);
  const commentsEndRef = useRef(null);

  useEffect(() => {
    setLoadingItem(true);
    api.get(`/items/${id}`)
      .then(({ data }) => setItem(data.data))
      .catch(() => setError('Item not found or has been removed.'))
      .finally(() => setLoadingItem(false));

    api.get(`/items/${id}/comments`)
      .then(({ data }) => setComments(data.data))
      .catch(() => {})
      .finally(() => setLoadingComments(false));
  }, [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    setCommentError('');
    try {
      const { data } = await api.post(`/items/${id}/comments`, { text: commentText });
      setComments((prev) => [...prev, data.data]);
      setCommentText('');
      setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment.');
    }
  };

  const handleResolve = async () => {
    if (!confirm('Mark this item as Resolved?')) return;
    setResolving(true);
    try {
      const { data } = await api.put(`/items/${id}`, { status: 'Resolved' });
      setItem(data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve item.');
    } finally {
      setResolving(false);
    }
  };

  if (loadingItem) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="dashboard-main-area min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <AlertCircle size={40} className="mx-auto text-muted-foreground" />
          <p className="text-foreground font-medium">{error || 'Item not found'}</p>
          <button onClick={() => navigate('/')} className="text-sm text-primary hover:underline">
            ← Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && (item.user?._id === user.id || item.user?._id?.toString() === user.id);
  const canManage = isOwner || isAdmin;
  const isResolved = item.status === 'Resolved';
  const canClaim = user && !isOwner && item.type === 'Found' && !isResolved;

  return (
    <div className="dashboard-main-area min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 space-y-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        {/* Item card */}
        <div className="rounded-2xl border border-card-border bg-card shadow-sm overflow-hidden">
          <div className={`h-1.5 w-full ${isResolved ? 'bg-green-500' : item.type === 'Lost' ? 'bg-destructive' : 'bg-primary'}`} />

          <div className="p-6 space-y-5">
            {/* Badges + actions row */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                  isResolved
                    ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                    : item.type === 'Lost'
                    ? 'bg-destructive/10 text-destructive border-destructive/20'
                    : 'bg-primary/10 text-primary border-primary/20'
                }`}>
                  {isResolved ? <CheckCircle2 size={11} /> : null}
                  {isResolved ? 'Resolved' : item.type}
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border border-transparent ${CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other}`}>
                  <Tag size={11} />
                  {item.category}
                </span>
                {!isResolved && (
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-accent text-accent-foreground">
                    <Clock size={11} />
                    Active
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                {canClaim && (
                  <button
                    onClick={() => setShowClaim(true)}
                    className="hover-elevate px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium border border-primary-border transition-colors"
                  >
                    Submit Claim
                  </button>
                )}
                {canManage && !isResolved && (
                  <>
                    <button
                      onClick={() => navigate(`/edit/${item._id}`)}
                      className="hover-elevate px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium border border-secondary-border transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleResolve}
                      disabled={resolving}
                      className="hover-elevate px-3 py-1.5 rounded-lg text-green-700 border border-green-300 bg-green-50 text-sm font-medium transition-colors disabled:opacity-60 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
                    >
                      {resolving ? <Spinner size="sm" /> : 'Mark Resolved'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground">{item.title}</h1>

            {/* Description */}
            <p className="text-foreground leading-relaxed">{item.description}</p>

            {/* Meta grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2.5">
                <MapPin size={14} className="text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-foreground">{item.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2.5">
                <Calendar size={14} className="text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(item.date || item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2.5">
                <User size={14} className="text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Reported by</p>
                  <p className="text-sm font-medium text-foreground">{item.user?.name || 'Unknown'}</p>
                </div>
              </div>
            </div>

            {!user && item.type === 'Found' && !isResolved && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
                <a href="/login" className="font-medium hover:underline">Login</a> to submit a claim or leave a comment.
              </div>
            )}
          </div>
        </div>

        {/* Comments section */}
        <div className="rounded-2xl border border-card-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-card-border">
            <MessageSquare size={16} className="text-primary" />
            <h2 className="font-semibold text-foreground">
              Comments
              {comments.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">({comments.length})</span>
              )}
            </h2>
          </div>

          <div className="divide-y divide-border">
            {loadingComments ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                <MessageSquare size={28} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No comments yet. Be the first to ask!</p>
              </div>
            ) : (
              comments.map((comment) => {
                const isCommentOwner = user && (comment.user?._id === user.id || comment.user?._id?.toString() === user.id);
                return (
                  <div key={comment._id} className="flex gap-3 px-6 py-4">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-semibold">
                      {comment.user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-medium text-foreground">{comment.user?.name || 'Unknown'}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{comment.text}</p>
                    </div>
                    {(isCommentOwner || isAdmin) && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="shrink-0 p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                );
              })
            )}
            <div ref={commentsEndRef} />
          </div>

          {/* Comment input */}
          {user ? (
            <form onSubmit={handleSubmitComment} className="px-6 py-4 border-t border-card-border space-y-2">
              {commentError && (
                <div className="flex items-center gap-2 text-xs text-destructive">
                  <AlertCircle size={12} />
                  {commentError}
                </div>
              )}
              <div className="flex gap-2">
                <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Ask a question or leave info…"
                    maxLength={500}
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !commentText.trim()}
                    className="hover-elevate px-3 py-2 rounded-lg bg-primary text-primary-foreground border border-primary-border transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    {submitting ? <Spinner size="sm" /> : <Send size={14} />}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="px-6 py-4 border-t border-card-border text-sm text-muted-foreground text-center">
              <a href="/login" className="text-primary font-medium hover:underline">Login</a> to leave a comment.
            </div>
          )}
        </div>
      </div>

      {showClaim && (
        <ClaimModal
          item={item}
          onClose={() => setShowClaim(false)}
          onSuccess={() => setShowClaim(false)}
        />
      )}
    </div>
  );
}
