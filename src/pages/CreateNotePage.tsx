import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { notesApi } from '../api/notes';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { TagInput } from '../components/notes/TagInput';
import { FileUpload } from '../components/notes/FileUpload';
import { toast } from '../utils/toast';

export const CreateNotePage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});
  const [createdNoteId, setCreatedNoteId] = useState<string | null>(null);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!content.trim() && !selectedFile) {
      newErrors.content = 'Content or file is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    console.log('Starting note creation...');
    setIsLoading(true);
    try {
      let response;
      if (selectedFile) {
        console.log('Uploading file...');
        response = await notesApi.uploadFile(title, selectedFile, tags);
      } else {
        console.log('Creating text note...');
        response = await notesApi.createNote({
          title,
          content,
          tags,
        });
      }

      console.log('Note created, response:', response);

      // Safe-guard: ensure suggested_tags is an array
      const safeSuggestions = Array.isArray(response.suggested_tags)
        ? response.suggested_tags
        : [];

      if (safeSuggestions.length > 0) {
        console.log('Handling suggested tags:', safeSuggestions);
        setSuggestedTags(safeSuggestions);
        setCreatedNoteId(response.note.id);
        toast.info('Note created! AI suggested some tags below.');
      } else {
        console.log('No suggestions, redirecting...');
        toast.success('Note created successfully!');
        navigate(`/notes/${response.note.id}`);
      }
    } catch (error: any) {
      console.error('Create note error:', error);
      toast.error('Failed to create note');
    } finally {
      console.log('Finished, setting isLoading false');
      setIsLoading(false);
    }
  };

  const handleAddSuggestedTag = async (tag: string) => {
    const newTags = [...tags, tag];
    setTags(newTags);
    setSuggestedTags(suggestedTags.filter((t) => t !== tag));

    // If note was already created, update it via API
    if (createdNoteId) {
      try {
        await notesApi.updateNote(createdNoteId, { tags: newTags });
        toast.success(`Tag "${tag}" added`);
      } catch (error: any) {
        toast.error('Failed to save tag');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/notes">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Note</h1>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <Input
          label="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setErrors({ ...errors, title: undefined });
          }}
          error={errors.title}
          required
          placeholder="Enter note title..."
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setErrors({ ...errors, content: undefined });
            }}
            rows={12}
            className="input-field"
            placeholder="Enter note content..."
            disabled={!!selectedFile}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or Upload File
          </label>
          <FileUpload
            onFileSelect={(file) => {
              setSelectedFile(file);
              setContent('');
            }}
            selectedFile={selectedFile}
            onRemove={() => {
              setSelectedFile(null);
            }}
          />
        </div>

        <TagInput
          tags={tags}
          onChange={setTags}
          suggestions={suggestedTags}
          onAddSuggestion={handleAddSuggestedTag}
        />

        <div className="flex justify-end gap-3">
          <Link to="/notes">
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </Link>
          {createdNoteId ? (
            <Link to={`/notes/${createdNoteId}`}>
              <Button type="button">
                View Note
              </Button>
            </Link>
          ) : (
            <Button type="submit" isLoading={isLoading}>
              <Save size={16} className="mr-2" />
              Create Note
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
