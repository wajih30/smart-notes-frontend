import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { qaApi } from '../api/qa';
import { SessionCard } from '../components/qa/SessionCard';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { QASession } from '../types';
import { toast } from '../utils/toast';

export const QASessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<QASession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);

  useEffect(() => {
    loadSessions();
  }, [page]);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const response = await qaApi.listSessions({
        skip: (page - 1) * pageSize,
        limit: pageSize,
      });
      setSessions(response.items);
      setTotal(response.total);
    } catch (error: any) {
      toast.error('Failed to load Q&A sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }
    try {
      await qaApi.deleteSession(id);
      toast.success('Session deleted');
      loadSessions();
    } catch (error: any) {
      toast.error('Failed to delete session');
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Q&A Sessions</h1>
        <Link to="/qa/new">
          <Button>
            <Plus size={20} className="mr-2" />
            New Session
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No Q&A sessions found</p>
          <Link to="/qa/new">
            <Button>Create Your First Session</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
