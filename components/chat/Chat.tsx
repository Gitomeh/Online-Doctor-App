"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const [showJumpButton, setShowJumpButton] = useState(false);

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
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      createdAt: new Date(),
    };

    // Immediately add user message to chat state
    setMessages((prev) => [...prev, userMessage]);
    
    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);

    // Create abort controller for this request
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      // Create assistant message for streaming
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Read the stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'text-delta' && parsed.textDelta) {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const lastMsg = updated[updated.length - 1];
                    if (lastMsg && lastMsg.role === 'assistant') {
                      lastMsg.content += parsed.textDelta;
                    }
                    return updated;
                  });
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      setMessages((prev) => [...prev, {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "I apologize, but I'm experiencing technical difficulties. Please try again later.",
        createdAt: new Date(),
      }]);
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const clearHistory = () => {
    setMessages([]);
  };

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white"
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
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-3">
              Hi, I'm Dr. MediAI
            </h3>
            <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-4">
              Your AI Health Assistant
            </p>
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6 max-w-lg border border-primary-200 dark:border-primary-800">
              <p className="text-neutral-800 dark:text-neutral-200 mb-4">
                How can I help you today?
              </p>
              <div className="space-y-2 text-left">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  💡 <strong>Try asking:</strong>
                </p>
                <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1 ml-4">
                  <li>• "What symptoms should I watch for?"</li>
                  <li>• "I have a headache and fever"</li>
                  <li>• "What specialist should I see?"</li>
                </ul>
              </div>
            </div>
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
              <span className="sr-only">Dr. MediAI is typing</span>
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
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your symptoms..."
              className="w-full px-4 py-3 pr-12 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800 dark:text-neutral-50 resize-none min-h-[48px] max-h-[120px]"
              rows={1}
              disabled={isLoading}
              aria-label="Message input"
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

          {isLoading ? (
            <Button
              onClick={handleStop}
              size="icon"
              className="h-12 w-12 rounded-xl bg-red-600 hover:bg-red-700"
              aria-label="Stop generation"
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
            <Button
              onClick={(e) => handleSubmit(e)}
              disabled={!input.trim()}
              size="icon"
              className="h-12 w-12 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
          )}
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
