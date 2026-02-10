import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Pin, Archive, Trash2, Download, Sparkles } from 'lucide-react';
import { notesApi } from '../api/notes';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { TagInput } from '../components/notes/TagInput';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { Note } from '../types';
import { toast } from '../utils/toast';

export const NoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[],
  });
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const noteData = await notesApi.getNote(id);
      setNote(noteData);
      setFormData({
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags.map((t) => t.name),
      });
    } catch (error: any) {
      toast.error('Failed to load note');
      navigate('/notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      const updatedNote = await notesApi.updateNote(id, {
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
      });
      setNote(updatedNote);
      setIsEditing(false);
      toast.success('Note updated successfully');
    } catch (error: any) {
      toast.error('Failed to update note');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePin = async () => {
    if (!id) return;
    try {
      const updatedNote = await notesApi.togglePin(id);
      setNote(updatedNote);
      toast.success('Note updated');
    } catch (error: any) {
      toast.error('Failed to update note');
    }
  };

  const handleArchive = async () => {
    if (!id) return;
    try {
      const updatedNote = await notesApi.toggleArchive(id);
      setNote(updatedNote);
      toast.success('Note updated');
    } catch (error: any) {
      toast.error('Failed to update note');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }
    try {
      await notesApi.deleteNote(id);
      toast.success('Note deleted');
      navigate('/notes');
    } catch (error: any) {
      toast.error('Failed to delete note');
    }
  };

  const handleDownload = async () => {
    if (!id || !note) return;
    try {
      const blob = await notesApi.downloadFile(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = note.original_filename || 'note';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('File downloaded');
    } catch (error: any) {
      toast.error('Failed to download file');
    }
  };

  const handleSummarize = async () => {
    if (!id) return;
    try {
      const result = await notesApi.summarizeNote(id);
      setNote({ ...note!, summary: result.summary });
      toast.success('Summary generated successfully');
    } catch (error: any) {
      toast.error('Failed to generate summary');
    }
  };

  const handleSuggestTags = async () => {
    if (!id) return;
    try {
      // If editing, use the current form content for suggestions
      const content = isEditing ? formData.content : undefined;
      const result = await notesApi.suggestTags(id, content);
      setSuggestedTags(result.suggestions);
      toast.success('Tag suggestions loaded');
    } catch (error: any) {
      toast.error('Failed to get tag suggestions');
    }
  };

  const handleAddSuggestedTag = async (tag: string) => {
    if (!id || !note) return;

    if (isEditing) {
      // In edit mode, update the form state instead of making an API call
      if (!formData.tags.includes(tag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tag],
        });
        setSuggestedTags(suggestedTags.filter((t) => t !== tag));
        toast.success(`Tag "${tag}" added to draft`);
      }
      return;
    }

    try {
      const newTags = [...note.tags.map(t => t.name), tag];
      const updatedNote = await notesApi.updateNote(id, { tags: newTags });
      setNote(updatedNote);
      // Sync formData tags as well so if user enters edit mode, they are up to date
      setFormData(prev => ({ ...prev, tags: newTags }));
      setSuggestedTags(suggestedTags.filter(t => t !== tag));
      toast.success(`Tag "${tag}" added`);
    } catch (error: any) {
      toast.error('Failed to add tag');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link to="/notes">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePin}
            title={note.is_pinned ? 'Unpin' : 'Pin'}
          >
            <Pin size={16} className={note.is_pinned ? 'fill-current' : ''} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleArchive}>
            <Archive size={16} />
          </Button>
          {note.source_type === 'file' && (
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download size={16} />
            </Button>
          )}
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="card space-y-6">
        {isEditing ? (
          <>
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={20}
                className="input-field"
              />
            </div>
            <TagInput
              tags={formData.tags}
              onChange={(tags) => setFormData({ ...formData, tags })}
              suggestions={suggestedTags}
              onAddSuggestion={handleAddSuggestedTag}
            />
            <div className="flex justify-between items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSuggestTags}
                type="button"
              >
                <Sparkles size={16} className="mr-2" />
                Suggest Tags
              </Button>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} isLoading={isSaving}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{note.title}</h1>
              <Button onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            </div>

            {note.summary && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
                <p className="text-blue-800">{note.summary}</p>
              </div>
            )}

            <div className="flex gap-2 mb-4">
              {!note.summary && (
                <Button variant="outline" size="sm" onClick={handleSummarize}>
                  <Sparkles size={16} className="mr-2" />
                  Generate Summary
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleSuggestTags}>
                Suggest Tags
              </Button>
            </div>

            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-700">
                {note.content}
              </pre>
            </div>

            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                {note.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {suggestedTags.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 mb-2 font-medium">AI Suggested Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleAddSuggestedTag(tag)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
