import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { fetchConversations, fetchMessages, sendMessage } from '../api';
import { getErrorMessage } from '../../../shared/api/client';
import type { ConversationPreview, Message } from '../types';
import { useAuth } from '../../../context/AuthContext';
import { ConversationRow } from '../components/ConversationRow';
import { MessageBubble } from '../components/MessageBubble';
import { MessageComposer } from '../components/MessageComposer';
import { Avatar } from '../../../components/ui/Avatar';

export function MessagesPage() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === conversationId);

  useEffect(() => {
    fetchConversations()
      .then(setConversations)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoadingList(false));
  }, []);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setLoadingThread(true);
    fetchMessages(conversationId)
      .then((data) => setMessages(data.messages))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoadingThread(false));
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string) => {
    if (!conversationId) return;
    const message = await sendMessage(conversationId, content);
    setMessages((prev) => [...prev, message]);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: message, lastMessageAt: message.createdAt }
          : c
      )
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-53px)] flex-col md:min-h-screen md:flex-row">
      <aside
        className={`flex w-full flex-col border-b border-x-border md:w-[350px] md:border-b-0 md:border-r ${
          conversationId ? 'hidden md:flex' : 'flex'
        }`}
      >
        <header className="sticky top-0 z-10 border-b border-x-border bg-x-black/80 px-4 py-3 backdrop-blur-xl">
          <h1 className="text-x-title">Messages</h1>
        </header>

        {loadingList && (
          <div className="flex justify-center py-12">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-x-blue border-t-transparent" />
          </div>
        )}

        {!loadingList && conversations.length === 0 && (
          <div className="px-6 py-16 text-center">
            <Mail className="mx-auto h-12 w-12 text-x-gray" />
            <p className="mt-4 text-x-title">Aucun message</p>
            <p className="mt-2 text-[15px] text-x-gray">
              Envoyez un message depuis le profil d&apos;un utilisateur.
            </p>
          </div>
        )}

        {conversations.map((c) => (
          <ConversationRow key={c.id} conversation={c} active={c.id === conversationId} />
        ))}
      </aside>

      <section
        className={`flex min-h-0 flex-1 flex-col ${!conversationId ? 'hidden md:flex' : 'flex'}`}
      >
        {!conversationId ? (
          <div className="hidden flex-1 flex-col items-center justify-center px-8 md:flex">
            <div className="rounded-full border border-x-border p-6">
              <Mail className="h-10 w-10" />
            </div>
            <h2 className="mt-4 text-[31px] font-extrabold">Sélectionnez un message</h2>
            <p className="mt-2 text-center text-[15px] text-x-gray">
              Choisissez une conversation ou démarrez-en une nouvelle.
            </p>
          </div>
        ) : (
          <>
            <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-x-border bg-x-black/80 px-4 py-3 backdrop-blur-xl">
              <Link to="/messages" className="text-x-blue md:hidden">
                ←
              </Link>
              {activeConversation && (
                <>
                  <Avatar user={activeConversation.participant} size="sm" />
                  <div>
                    <p className="font-bold leading-5">{activeConversation.participant.displayName}</p>
                    <p className="text-[13px] text-x-gray">@{activeConversation.participant.username}</p>
                  </div>
                </>
              )}
            </header>

            {error && <p className="px-4 py-3 text-x-pink">{error}</p>}

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {loadingThread ? (
                <div className="flex justify-center py-12">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-x-blue border-t-transparent" />
                </div>
              ) : (
                messages.map((m) => (
                  <MessageBubble key={m.id} message={m} isOwn={m.senderId === user?.id} />
                ))
              )}
              <div ref={bottomRef} />
            </div>

            <MessageComposer onSend={handleSend} disabled={loadingThread} />
          </>
        )}
      </section>
    </div>
  );
}
