import React, { useEffect, useRef, useState } from "react";
import { Send, MessageSquare, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import aiService from "../../services/aiservice";
import Spinner from "../common/Spinner";
import MarkdownRenderer from "../common/MarkdownRender";

const ChatInterface = () => {
  const { id: documentId } = useParams();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);

  /* ---------------- Auto scroll ---------------- */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [history, loading]);

  /* ---------------- Fetch chat history ---------------- */
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true);
        const res = await aiService.getChatHistory(documentId);
        setHistory(res.data || []);
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [documentId]);

  /* ---------------- Send message ---------------- */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await aiService.chat(documentId, userMsg.content);

      const assistantMsg = {
        role: "assistant",
        content: res.data.answer,
        timestamp: new Date(),
        relevantChunks: res.data.relevantChunks || [],
      };

      setHistory((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Message bubble ---------------- */
  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";

    return (
      <div
        key={index}
        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
            ${
              isUser
                ? "bg-emerald-500 text-white rounded-br-md"
                : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
            }`}
        >
          {isUser ? (
            msg.content
          ) : (
            <MarkdownRenderer content={msg.content} />
          )}
        </div>
      </div>
    );
  };

  /* ---------------- Initial loading ---------------- */
  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
          <MessageSquare className="w-7 h-7 text-emerald-600" />
        </div>
        <Spinner />
        <p className="text-sm text-slate-500 mt-3">
          Loading chat history...
        </p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl overflow-hidden">
      {/* Messages */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gradient-to-br from-slate-50/50 to-white">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="font-medium text-slate-700 mb-1">
              Start a conversation
            </h3>
            <p className="text-sm">
              Ask anything about this document.
            </p>
          </div>
        ) : (
          history.map(renderMessage)
        )}

        {loading && (
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Sparkles className="w-4 h-4 animate-pulse text-emerald-500" />
            AI is thinking…
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-5 border-t border-slate-200 bg-white">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question about this document..."
            disabled={loading}
            className="flex-1 h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center hover:opacity-90 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
