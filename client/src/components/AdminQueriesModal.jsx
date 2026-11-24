// Admin Queries Modal — Exclusively for Sagarjit to view & manage student queries
import { useState, useEffect } from 'react';
import { api } from '../api';
import { formatDate } from '../utils';

export default function AdminQueriesModal({ open, onClose }) {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (open) {
      loadQueries();
    }
  }, [open]);

  const loadQueries = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getQueries();
      setQueries(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load student queries.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (query) => {
    const nextStatus = query.status === 'Resolved' ? 'Pending' : 'Resolved';
    const qId = query._id || query.id;
    setUpdatingId(qId);
    try {
      await api.replyQuery(qId, { status: nextStatus });
      setQueries(prev => prev.map(q => (q._id === qId || q.id === qId) ? { ...q, status: nextStatus } : q));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="glass rounded-3xl p-6 sm:p-8 w-full max-w-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              📬
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Student Queries Inbox
                <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Admin Only
                </span>
              </h2>
              <p className="text-xs text-slate-400">Queries submitted by students through the "Ask Query" modal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadQueries}
              disabled={loading}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              title="Refresh queries">
              🔄 Refresh
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all text-sm font-mono">
              ✕
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {loading && (
            <div className="py-12 text-center text-sm text-slate-400">
              Loading queries...
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
              {error}
            </div>
          )}

          {!loading && !error && queries.length === 0 && (
            <div className="py-16 text-center text-slate-500 text-sm">
              ✨ No student queries received yet. When a student submits a query, it will show up right here.
            </div>
          )}

          {!loading && queries.map((query) => {
            const qId = query._id || query.id;
            const isResolved = query.status === 'Resolved';
            const mailtoUrl = `mailto:${query.email}?subject=${encodeURIComponent('Re: ' + (query.subject || 'Code2Chill Query'))}&body=${encodeURIComponent('Hi ' + query.name + ',\n\nRegarding your query about "' + query.subject + '":\n\n')}`;

            return (
              <div
                key={qId}
                className={`p-4 rounded-2xl border transition-all ${
                  isResolved
                    ? 'bg-slate-900/40 border-slate-800 opacity-75'
                    : 'bg-[#121526]/80 border-indigo-500/20 hover:border-indigo-500/40'
                }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">{query.name}</span>
                    <a
                      href={mailtoUrl}
                      className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-mono">
                      ✉️ {query.email}
                    </a>
                    {query.rollNumber && (
                      <span className="text-[11px] text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded">
                        Roll: {query.rollNumber}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isResolved
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      }`}>
                      {query.status || 'Pending'}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(query)}
                      disabled={updatingId === qId}
                      className="text-[11px] px-2.5 py-1 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-all">
                      {updatingId === qId ? '...' : isResolved ? 'Mark Pending' : '✓ Mark Resolved'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                  <span className="font-semibold text-indigo-300">[{query.category || 'General'}]</span>
                  <span className="text-slate-300 font-medium">{query.subject}</span>
                  <span className="text-slate-500 ml-auto text-[10px]">
                    {query.createdAt ? formatDate(query.createdAt) : ''}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5 whitespace-pre-wrap">
                  {query.message}
                </p>

                <div className="mt-2.5 flex items-center justify-end">
                  <a
                    href={mailtoUrl}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1.5">
                    Reply via Email →
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
          <span>Total queries: {queries.length}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
