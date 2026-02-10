import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { qaApi } from '../api/qa';
import { ChatMessage } from '../components/qa/ChatMessage';
import { ChatInput } from '../components/qa/ChatInput';
import { ChatSidebar } from '../components/qa/ChatSidebar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useSidebar } from '../contexts/SidebarContext';
import type { QASession, QAMessage, Note } from '../types';
import { MessageRole } from '../types';
import { toast } from '../utils/toast';

export const QAChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const { setSidebarContent } = useSidebar();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessions, setSessions] = useState<QASession[]>([]);
  const [currentSession, setCurrentSession] = useState<QASession | null>(null);
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [messageSources, setMessageSources] = useState<Record<string, Array<{ note_id: string; note_title: string }>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const loadSessions = useCallback(async (silent = false) => {
    if (!silent) setIsLoadingSessions(true);
    try {
      const response = await qaApi.listSessions({ limit: 50 });
      const sortedSessions = [...response.items].sort((a, b) => {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
      setSessions(sortedSessions);
    } catch (error: any) {
      if (!silent) toast.error('Failed to load sessions');
    } finally {
      if (!silent) setIsLoadingSessions(false);
    }
  }, []);

  const handleDelete = useCallback(async (sessionId: string) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return;
    try {
      await qaApi.deleteSession(sessionId);
      toast.success('Chat deleted');
      if (sessionId === id) {
        navigate('/qa/new', { replace: true });
      }
      loadSessions(true);
    } catch (error: any) {
      toast.error('Failed to delete chat');
    }
  }, [id, loadSessions, navigate]);

  const handleCreateNew = useCallback(() => {
    navigate('/qa/new');
  }, [navigate]);

  useEffect(() => {
    isMounted.current = true;
    loadSessions();
    return () => {
      isMounted.current = false;
      setSidebarContent(null);
    };
  }, [loadSessions, setSidebarContent]);

  useEffect(() => {
    setSidebarContent(
      <ChatSidebar
        sessions={sessions}
        onDelete={handleDelete}
        onCreateNew={handleCreateNew}
      />
    );
    return () => setSidebarContent(null);
  }, [sessions, handleDelete, handleCreateNew, setSidebarContent]);

  const loadSession = useCallback(async (sessionId: string, silent = false) => {
    if (!sessionId) return;
    if (!silent) setIsLoading(true);
    try {
      const sessionData = await qaApi.getSession(sessionId);
      setCurrentSession(sessionData);

      const sortedMessages = (sessionData.messages || []).sort((a: QAMessage, b: QAMessage) => {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
      setMessages(sortedMessages);

      const sources: Record<string, Array<{ note_id: string; note_title: string }>> = {};
      if (sortedMessages.length > 0 && sessionData.note_ids?.length > 0) {
        try {
          const { notesApi } = await import('../api/notes');
          const notePromises = sessionData.note_ids.map((noteId: string) =>
            notesApi.getNote(noteId).catch(() => null)
          );
          const notes = await Promise.all(notePromises);
          const validNotes = notes.filter((note): note is Note => note !== null);
          const noteTitles = validNotes.map((note) => ({
            note_id: note.id,
            note_title: note.title,
          }));
          sortedMessages.forEach((msg: QAMessage) => {
            if (msg.role === 'assistant') sources[msg.id] = noteTitles;
          });
        } catch (error) {
          const noteTitles = sessionData.note_ids.map((noteId: string) => ({
            note_id: noteId,
            note_title: 'Note',
          }));
          sortedMessages.forEach((msg: QAMessage) => {
            if (msg.role === 'assistant') sources[msg.id] = noteTitles;
          });
        }
      }
      setMessageSources(sources);
    } catch (error: any) {
      toast.error('Failed to load session');
      navigate('/qa/new');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!isLoadingSessions) {
      if (id) {
        if (currentSession?.id !== id || messages.length === 0) {
          loadSession(id);
        }
      } else if (sessions.length > 0) {
        navigate(`/qa/${sessions[0].id}`, { replace: true });
      } else {
        navigate('/qa/new', { replace: true });
      }
    }
  }, [id, sessions, isLoadingSessions, loadSession, navigate, currentSession?.id, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    if (!id || !currentSession || isSending) return;
    setIsSending(true);

    const now = new Date().toISOString();
    const tempUserMsgId = `temp-user-${Date.now()}`;
    const tempAiMsgId = `temp-ai-${Date.now()}`;

    const userMessage: QAMessage = {
      id: tempUserMsgId,
      session_id: id,
      role: MessageRole.USER,
      content: content,
      created_at: now,
    };

    const thinkingMessage: QAMessage = {
      id: tempAiMsgId,
      session_id: id,
      role: MessageRole.ASSISTANT,
      content: '',
      created_at: now,
    };

    setMessages(prev => [...prev, userMessage, thinkingMessage]);
    setIsTyping(true);

    try {
      const response = await qaApi.sendMessage(id, { content });
      const fullResponse = response.ai_response || '';

      let currentDisplay = '';
      const charsPerStep = 5;

      for (let i = 0; i <= fullResponse.length; i += charsPerStep) {
        if (!isMounted.current) break;
        currentDisplay = fullResponse.slice(0, i);
        setMessages(prev => {
          const newMsgs = [...prev];
          const aiMsg = newMsgs.find(m => m.id === tempAiMsgId);
          if (aiMsg) aiMsg.content = currentDisplay;
          return newMsgs;
        });
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      setMessages(prev => {
        const newMsgs = [...prev];
        const aiMsgIdx = newMsgs.findIndex(m => m.id === tempAiMsgId);
        if (aiMsgIdx !== -1) {
          newMsgs[aiMsgIdx] = {
            ...newMsgs[aiMsgIdx],
            id: response.message_id || tempAiMsgId,
            content: fullResponse
          };
        }
        return newMsgs;
      });

      loadSessions(true);
    } catch (error: any) {
      setMessages(prev => prev.filter(m => m.id !== tempUserMsgId && m.id !== tempAiMsgId));
      toast.error(error.response?.data?.detail || 'Failed to send message');
    } finally {
      setIsSending(false);
      setIsTyping(false);
    }
  };

  if (isLoadingSessions && !sessions.length) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-100px)] -m-6 bg-white overflow-hidden rounded-3xl border border-gray-100 shadow-sm relative">
      <div className="flex-1 flex flex-col min-w-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="lg" />
          </div>
        ) : !currentSession ? (
          <div className="flex items-center justify-center h-full text-center p-8">
            <div>
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LoadingSpinner size="sm" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Initializing Chat</h2>
              <p className="text-gray-500 mb-6">Setting up your AI environment...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-gray-100 px-8 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-gray-900 truncate">
                  {currentSession.title || 'New Chat'}
                </h1>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {currentSession.note_ids.length} Contextual Sources
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50/30 scroll-smooth">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full px-8">
                  <div className="text-center max-w-sm">
                    <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl">👋</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to assist!</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Ask me anything about your selected notes. I'll analyze them to provide accurate answers.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto py-8 px-6 space-y-8">
                  {messages.map((message, index) => {
                    const sourceNotes = message.role === 'assistant' ? messageSources[message.id] : undefined;
                    return (
                      <ChatMessage
                        key={`${message.id}-${index}`}
                        message={message}
                        sourceNotes={sourceNotes}
                      />
                    );
                  })}
                  <div ref={messagesEndRef} className="h-4" />
                </div>
              )}
            </div>

            <div className="bg-white border-t border-gray-100 p-6 backdrop-blur-xl bg-white/90">
              <div className="max-w-3xl mx-auto">
                <ChatInput onSend={handleSendMessage} isLoading={isSending} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
