"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
}

export function Chat() {
  const [showJumpButton, setShowJumpButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
    setMessages,
  } = useChat({
    api: "/api/chat",
    initialMessages: [],
  });

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mediai-chat-history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    }
  }, [setMessages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("mediai-chat-history", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isUserAtBottom) {
      scrollToBottom();
    }
  }, [messages, isUserAtBottom]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Track scroll position to show/hide jump button
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const atBottom = distanceFromBottom < 100;

    setIsUserAtBottom(atBottom);
    setShowJumpButton(!atBottom);
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as any);
      }
    }
  };

  const handleStop = () => {
    stop();
  };

  const handleRegenerate = () => {
    reload();
  };

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const clearHistory = () => {
    localStorage.removeItem("mediai-chat-history");
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] md:h-[600px] bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            MediAI Assistant
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Your health assessment companion
          </p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
            aria-label="Clear chat history"
          >
            Clear History
          </Button>
        )}
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary-600 dark:text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-2">
              Welcome to MediAI
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
              Describe your symptoms and I'll help you understand possible conditions and recommend the right specialist.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary-600 text-white rounded-br-sm"
                    : "bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded-bl-sm"
                }`}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {message.content}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    message.role === "user"
                      ? "text-primary-200"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {formatTime(message.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-100 dark:bg-neutral-700 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex space-x-2">
                <div
                  className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                  aria-hidden="true"
                />
                <div
                  className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                  aria-hidden="true"
                />
                <div
                  className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                  aria-hidden="true"
                />
              </div>
              <span className="sr-only">MediAI is typing</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Jump to Latest Button */}
      {showJumpButton && (
        <Button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-8 rounded-full shadow-lg"
          size="sm"
          aria-label="Jump to latest message"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
          Latest
        </Button>
      )}

      {/* Input Area */}
      <div className="border-t border-neutral-200 dark:border-neutral-700 p-4 bg-neutral-50 dark:bg-neutral-900">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Describe your symptoms..."
              className="w-full px-4 py-3 pr-12 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800 dark:text-neutral-50 resize-none min-h-[48px] max-h-[120px]"
              rows={1}
              disabled={isLoading}
              aria-label="Message input"
              aria-describedby={isLoading ? "typing-indicator" : undefined}
              style={{
                height: "auto",
                minHeight: "48px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
          </div>

          <div className="flex gap-2">
            {isLoading ? (
              <Button
                type="button"
                onClick={handleStop}
                variant="destructive"
                size="icon"
                className="h-12 w-12 rounded-xl"
                aria-label="Stop generating response"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            ) : (
              <>
                {messages.length > 0 && messages[messages.length - 1].role === "assistant" && (
                  <Button
                    type="button"
                    onClick={handleRegenerate}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl"
                    aria-label="Regenerate last response"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="h-12 w-12 rounded-xl bg-primary-600 hover:bg-primary-700"
                  aria-label="Send message"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </Button>
              </>
            )}
          </div>
        </form>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
