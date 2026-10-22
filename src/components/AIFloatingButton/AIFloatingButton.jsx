
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  Bot,
  Check,
  ChevronDown,
  MessageCircle,
  Minus,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import "./AIFloatingButton.css";

const QUICK_PROMPTS = [
  { icon: Activity, label: "Recovery exercises", message: "Suggest some general recovery exercises." },
  { icon: ShieldCheck, label: "Pain management", message: "How can I manage muscle discomfort safely?" },
  { icon: Sparkles, label: "Healthy habits", message: "Suggest healthy habits for better mobility." },
];

const createWelcomeMessage = () => ({
  id: `welcome-${Date.now()}`,
  role: "assistant",
  content:
    "Hi! I'm Rehabics AI, your wellness companion. 👋\n\nI can help you explore general recovery information, mobility tips, and healthy movement habits.\n\nWhat would you like help with today?",
});

export default function AIFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([createWelcomeMessage()]);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized, isSending]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      const timer = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (text = input) => {
    const messageText = text.trim();

    if (!messageText || isSending) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      // Connect your Rehabics backend API here.
      // This demo deliberately does not pretend to generate real AI answers.
      await new Promise((resolve) => setTimeout(resolve, 500));

      setMessages((previous) => [
        ...previous,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            "I'm currently in demo mode, so I can't generate a personalized AI response yet. Connect your Rehabics backend API to enable real conversations.\n\nFor medical concerns or persistent pain, please consult a qualified healthcare professional.",
        },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "I couldn't process that message. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const resetChat = () => {
    if (isSending) return;
    setMessages([createWelcomeMessage()]);
    setInput("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="rv6-ai">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.section
            key="rehabics-ai-panel"
            className="rv6-ai-panel"
            role="dialog"
            aria-modal="false"
            aria-label="Rehabics AI assistant"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <header className="rv6-ai-header">
              <div className="rv6-ai-brand">
                <div className="rv6-ai-avatar">
                  <Bot size={23} />
                  <span className="rv6-ai-avatar-sparkle">
                    <Sparkles size={11} />
                  </span>
                </div>

                <div className="rv6-ai-brand-copy">
                  <h2>Rehabics AI</h2>
                  <div className="rv6-ai-status">
                    <span className="rv6-ai-status-dot" />
                    Wellness assistant
                  </div>
                </div>
              </div>

              <div className="rv6-ai-header-actions">
                <button
                  type="button"
                  className="rv6-ai-icon-button"
                  onClick={resetChat}
                  aria-label="Start a new chat"
                  title="New chat"
                  disabled={isSending}
                >
                  <RefreshCw size={17} />
                </button>

                <button
                  type="button"
                  className="rv6-ai-icon-button"
                  onClick={() => setIsMinimized(true)}
                  aria-label="Minimize chat"
                  title="Minimize"
                >
                  <Minus size={19} />
                </button>

                <button
                  type="button"
                  className="rv6-ai-icon-button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  title="Close"
                >
                  <X size={19} />
                </button>
              </div>
            </header>

            <div className="rv6-ai-welcome-strip">
              <ShieldCheck size={16} />
              <span>Here to support your wellness journey</span>
            </div>

            <div className="rv6-ai-messages" aria-live="polite">
              {messages.map((message) => (
                <div
                  className={`rv6-ai-message-row ${
                    message.role === "user" ? "is-user" : "is-assistant"
                  }`}
                  key={message.id}
                >
                  {message.role === "assistant" && (
                    <div className="rv6-ai-message-avatar">
                      <Sparkles size={14} />
                    </div>
                  )}

                  <div className="rv6-ai-bubble">
                    {message.content}
                  </div>
                </div>
              ))}

              {messages.length === 1 && (
                <div className="rv6-ai-quick-prompts">
                  <p>Try asking about</p>

                  {QUICK_PROMPTS.map((prompt) => {
                    const PromptIcon = prompt.icon;

                    return (
                      <button
                        type="button"
                        className="rv6-ai-prompt"
                        key={prompt.label}
                        onClick={() => sendMessage(prompt.message)}
                        disabled={isSending}
                      >
                        <PromptIcon size={16} />
                        <span>{prompt.label}</span>
                        <span className="rv6-ai-prompt-arrow">↗</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {isSending && (
                <div className="rv6-ai-message-row is-assistant">
                  <div className="rv6-ai-message-avatar">
                    <Sparkles size={14} />
                  </div>
                  <div
                    className="rv6-ai-typing"
                    aria-label="Assistant is typing"
                  >
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form className="rv6-ai-composer" onSubmit={handleSubmit}>
              <div className="rv6-ai-input-wrap">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey &&
                      !event.nativeEvent.isComposing
                    ) {
                      event.preventDefault();
                      handleSubmit(event);
                    }
                  }}
                  placeholder="Ask me anything..."
                  aria-label="Write your message"
                  rows={1}
                  maxLength={2000}
                  disabled={isSending}
                />

                <button
                  type="submit"
                  className="rv6-ai-send"
                  disabled={!input.trim() || isSending}
                  aria-label="Send message"
                >
                  <Send size={17} />
                </button>
              </div>

              <div className="rv6-ai-composer-footer">
                <span>
                  <ShieldCheck size={12} />
                  Your wellbeing matters
                </span>
                <span>Shift + Enter for a new line</span>
              </div>
            </form>

            <footer className="rv6-ai-disclaimer">
              General information only — not a substitute for professional
              medical advice.
            </footer>
          </motion.section>
        )}
      </AnimatePresence>

      {isOpen && isMinimized && (
        <motion.button
          type="button"
          className="rv6-ai-minimized"
          onClick={() => setIsMinimized(false)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          aria-label="Restore Rehabics AI chat"
        >
          <Bot size={19} />
          <span>Rehabics AI</span>
          <Plus size={17} />
        </motion.button>
      )}

      <motion.button
        type="button"
        className={`rv6-ai-launcher ${isOpen ? "is-active" : ""}`}
        onClick={() => {
          if (isOpen && !isMinimized) {
            setIsOpen(false);
          } else {
            setIsOpen(true);
            setIsMinimized(false);
          }
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen && !isMinimized ? "Close AI chat" : "Open AI chat"}
        aria-expanded={isOpen && !isMinimized}
      >
        <span className="rv6-ai-launcher-glow" />

        <AnimatePresence mode="wait" initial={false}>
          {isOpen && !isMinimized ? (
            <motion.span
              key="close"
              initial={{ rotate: -60, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 60, opacity: 0 }}
            >
              <X size={25} />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -30, opacity: 0 }}
            >
              <MessageCircle size={26} />
            </motion.span>
          )}
        </AnimatePresence>

        {!isOpen && <span className="rv6-ai-launcher-dot" />}
      </motion.button>

      {!isOpen && (
        <div className="rv6-ai-launcher-label" aria-hidden="true">
          <Sparkles size={13} />
          <span>Ask Rehabics AI</span>
        </div>
      )}
    </div>
  );
}
