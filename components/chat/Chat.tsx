"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
  error?: boolean;
  errorMessage?: string;
  isRetrying?: boolean;
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

  const handleRetry = async (failedMessageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === failedMessageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    const failedMessage = messages[messageIndex];
    const previousMessages = messages.slice(0, messageIndex);
    
    // Mark as retrying
    setMessages(prev => prev.map(m => 
      m.id === failedMessageId ? { ...m, isRetrying: true, error: false, errorMessage: undefined } : m
    ));
    setIsLoading(true);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: previousMessages }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      // Reset the failed message and stream new content
      setMessages(prev => prev.map(m => 
        m.id === failedMessageId ? { ...m, content: '', isRetrying: false } : m
      ));

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
                    const msgIndex = updated.findIndex(m => m.id === failedMessageId);
                    if (msgIndex !== -1 && updated[msgIndex].role === 'assistant') {
                      updated[msgIndex].content += parsed.textDelta;
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
      console.error('Retry error:', error);
      setMessages(prev => prev.map(m => 
        m.id === failedMessageId ? { 
          ...m, 
          error: true, 
          errorMessage: 'Failed to retry. Please try again.',
          isRetrying: false 
        } : m
      ));
    } finally {
      setIsLoading(false);
      setAbortController(null);
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
      
      // Handle different error types
      let errorMessage = "I apologize, but I'm experiencing technical difficulties. Please try again later.";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          // User stopped the request - don't show error
          return;
        }
        
        // Check for rate limit (429)
        if (error.message.includes('429') || error.message.includes('rate limit')) {
          errorMessage = "You're sending requests too quickly. Please wait a moment and try again.";
        }
        
        // Check for network errors
        if (error.message.includes('fetch') || error.message.includes('network')) {
          errorMessage = "Network error. Please check your connection and try again.";
        }
      }
      
      // Mark the last assistant message as failed (if it exists)
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          lastMsg.error = true;
          lastMsg.errorMessage = errorMessage;
        }
        return updated;
      });
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
    <div className="flex flex-col h-[calc(100dvh-200px)] md:h-[600px] bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden">
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
                <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 ml-4">
                  <li>• "What could cause these symptoms?"</li>
                  <li>• "Help me understand my lab results"</li>
                  <li>• "What questions should I ask my doctor?"</li>
                  <li>• "Explain this medical term"</li>
                </ul>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-4 italic">
                  ⚠️ MediAI provides general information only and is not a substitute for professional medical advice.
                </p>
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
                {message.isRetrying ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 ml-2">Retrying...</span>
                  </div>
                ) : message.error ? (
                  <div>
                    <div className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">
                          {message.errorMessage || "Response failed"}
                        </p>
                        <Button
                          onClick={() => handleRetry(message.id)}
                          disabled={isLoading}
                          size="sm"
                          variant="outline"
                          className="mt-2 text-xs h-8 px-3 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                          aria-label="Retry failed message"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Retry
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {message.content}
                  </div>
                )}
                {!message.error && !message.isRetrying && (
                  <div
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-primary-200"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Loading indicator with skeleton */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-100 dark:bg-neutral-700 rounded-2xl rounded-bl-sm px-4 py-3 w-full max-w-[85%] md:max-w-[70%]">
              <div className="space-y-2">
                <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse w-1/2" />
                <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse w-5/6" />
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
              onClick={() => handleSubmit()}
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
