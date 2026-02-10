import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { qaApi } from '../api/qa';
import { NoteSelector } from '../components/qa/NoteSelector';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { toast } from '../utils/toast';

export const CreateQASessionPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ notes?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (selectedNoteIds.length === 0) {
      newErrors.notes = 'Please select at least 1 note';
    } else if (selectedNoteIds.length > 5) {
      newErrors.notes = 'Maximum 5 notes allowed';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const session = await qaApi.createSession({
        note_ids: selectedNoteIds,
        title: title || undefined,
      });
      toast.success('Chat session created');
      navigate(`/qa/${session.id}`);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to create session';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/qa">
          <Button variant="outline" size="sm" type="button">
            <ArrowLeft size={16} className="mr-2" />
            Back to Chats
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Chat</h1>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <Input
          label="Session Title (Optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Meeting Discussion, Project Q&A"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Notes (1-5) - Click notes to select, then click "Start Chat" when ready
          </label>
          <NoteSelector
            selectedNoteIds={selectedNoteIds}
            onSelectionChange={setSelectedNoteIds}
            maxSelection={5}
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
          )}
          {selectedNoteIds.length > 0 && (
            <p className="mt-2 text-sm text-green-600">
              ✓ {selectedNoteIds.length} note{selectedNoteIds.length !== 1 ? 's' : ''} selected. Click "Start Chat" to begin.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Link to="/qa">
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" isLoading={isLoading}>
            Start Chat
          </Button>
        </div>
      </form>
    </div>
  );
};
