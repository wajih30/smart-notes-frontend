import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { qaApi } from '../api/qa';
import { ChatMessage } from '../components/qa/ChatMessage';
import { ChatInput } from '../components/qa/ChatInput';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { MessageRole } from '../types';
import type { QAMessage, QAMessageResponse } from '../types';
import { toast } from '../utils/toast';

export const QASessionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [messageSources, setMessageSources] = useState<Record<string, Array<{ note_id: string; note_title: string }>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (id) {
      loadSession();
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSession = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const sessionData = await qaApi.getSession(id);
      setSession(sessionData);
      setMessages(sessionData.messages || []);
    } catch (error: any) {
      toast.error('Failed to load session');
      navigate('/qa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!id) return;
    setIsSending(true);
    try {
      const response: QAMessageResponse = await qaApi.sendMessage(id, { content });

      // Add user message
      const userMessage: QAMessage = {
        id: response.message_id,
        session_id: id,
        role: MessageRole.USER,
        content: response.user_message,
        created_at: response.created_at,
      };

      // Add AI message
      const aiMessageId = Math.random().toString(36).slice(2, 11);
      const aiMessage: QAMessage = {
        id: aiMessageId,
        session_id: id,
        role: MessageRole.ASSISTANT,
        content: response.ai_response,
        created_at: response.created_at,
      };

      // Store source notes for this AI message
      if (response.source_notes && response.source_notes.length > 0) {
        setMessageSources((prev) => ({
          ...prev,
          [aiMessageId]: response.source_notes,
        }));
      }

      setMessages([...messages, userMessage, aiMessage]);
    } catch (error: any) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }
    try {
      await qaApi.deleteSession(id);
      toast.success('Session deleted');
      navigate('/qa');
    } catch (error: any) {
      toast.error('Failed to delete session');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link to="/qa">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">
            {session.title || 'Q&A Session'}
          </h1>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-lg border border-gray-200 p-6">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              // Get source notes for AI messages (if available)
              const sourceNotes =
                message.role === MessageRole.ASSISTANT ? messageSources[message.id] : undefined;

              return (
                <ChatMessage
                  key={`${message.id}-${index}`}
                  message={message}
                  sourceNotes={sourceNotes}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <ChatInput onSend={handleSendMessage} isLoading={isSending} />
    </div>
  );
};
