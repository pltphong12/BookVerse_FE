import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Trash2, Minimize2 } from 'lucide-react';
import { callFetchChatHistoryApi } from '../../services/api';
import { IChatMessage } from '../../types/backend';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

// Generate a unique session ID per browser session
const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('chatbot_session_id');
    if (!sessionId) {
        sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('chatbot_session_id', sessionId);
    }
    return sessionId;
};

// Parse basic markdown: **bold**, *italic*, newlines
const parseMarkdown = (text: string): string => {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br/>');
};

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [showBubbleHint, setShowBubbleHint] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const sessionId = useRef(getSessionId());

    // Auto scroll to bottom
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Hide hint bubble after 8 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowBubbleHint(false), 8000);
        return () => clearTimeout(timer);
    }, []);

    // Fetch chat history when opening
    const fetchHistory = useCallback(async () => {
        setIsLoadingHistory(true);
        try {
            const res = await callFetchChatHistoryApi(sessionId.current);
            if (res.data?.data?.messages && res.data.data.messages.length > 0) {
                const normalized = res.data.data.messages.map(m => ({
                    ...m,
                    role: m.role.toLowerCase() as 'user' | 'assistant',
                }));
                setMessages(normalized);
            }
        } catch (error) {
            console.error('Failed to fetch chat history:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
        setShowBubbleHint(false);
        fetchHistory();
    };

    const handleClose = () => {
        // Abort any streaming request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsStreaming(false);
        setIsOpen(false);
    };

    const handleClearChat = () => {
        setMessages([]);
        // Generate new session
        const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('chatbot_session_id', newSessionId);
        sessionId.current = newSessionId;
    };

    // Send message and handle SSE streaming
    const handleSendMessage = async () => {
        const trimmed = inputValue.trim();
        if (!trimmed || isStreaming) return;

        // Add user message
        const userMsg: IChatMessage = { role: 'user', content: trimmed };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsStreaming(true);

        // Add empty assistant message for streaming
        const assistantMsg: IChatMessage = { role: 'assistant', content: '' };
        setMessages(prev => [...prev, assistantMsg]);

        // Create abort controller for this request
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${BACKEND_URL}/api/v1/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    sessionId: sessionId.current,
                    message: trimmed,
                }),
                signal: abortController.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                // Process SSE events from buffer
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const token = line.slice(5);
                        if (token) {
                            setMessages(prev => {
                                const updated = [...prev];
                                const lastMsg = updated[updated.length - 1];
                                if (lastMsg && lastMsg.role === 'assistant') {
                                    updated[updated.length - 1] = {
                                        ...lastMsg,
                                        content: lastMsg.content + token,
                                    };
                                }
                                return updated;
                            });
                        }
                    }
                }
            }
        } catch (error: unknown) {
            if (error instanceof Error && error.name === 'AbortError') {
                // User cancelled, do nothing
                return;
            }
            console.error('Chat stream error:', error);
            setMessages(prev => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.content) {
                    updated[updated.length - 1] = {
                        ...lastMsg,
                        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
                    };
                }
                return updated;
            });
        } finally {
            setIsStreaming(false);
            abortControllerRef.current = null;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Floating Chat Bubble */}
            <div className="fixed bottom-6 right-6 z-[9999] flex items-end gap-3">
                {/* Hint Tooltip */}
                {showBubbleHint && !isOpen && (
                    <div className="animate-fade-in-up bg-white rounded-2xl shadow-xl px-4 py-3 max-w-[220px] border border-gray-100 relative">
                        <button
                            onClick={() => setShowBubbleHint(false)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-xs transition-colors cursor-pointer"
                        >
                            ×
                        </button>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                            <p className="text-sm text-gray-700 font-medium">Bạn cần hỗ trợ? Hỏi tôi nhé! 🤖</p>
                        </div>
                        {/* Arrow */}
                        <div className="absolute -right-2 bottom-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-white"></div>
                    </div>
                )}

                {/* Chat Bubble Button */}
                <button
                    onClick={isOpen ? handleClose : handleOpen}
                    className={`
                        group relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center 
                        transition-all duration-500 ease-out cursor-pointer
                        ${isOpen
                            ? 'bg-gradient-to-br from-red-400 to-red-600 rotate-0 scale-90'
                            : 'bg-gradient-to-br from-primary-500 to-primary-700 hover:from-primary-400 hover:to-primary-600 hover:scale-110 hover:shadow-primary-500/40'
                        }
                    `}
                    id="chatbot-toggle-btn"
                >
                    {/* Ripple effect */}
                    {!isOpen && (
                        <>
                            <span className="absolute inset-0 rounded-full bg-primary-400 animate-ping opacity-20"></span>
                            <span className="absolute inset-0 rounded-full bg-primary-400 animate-pulse opacity-10"></span>
                        </>
                    )}
                    <div className={`transition-all duration-500 ${isOpen ? 'rotate-90 scale-110' : 'rotate-0'}`}>
                        {isOpen ? (
                            <X className="w-7 h-7 text-white" />
                        ) : (
                            <MessageCircle className="w-7 h-7 text-white" />
                        )}
                    </div>
                </button>
            </div>

            {/* Chat Window */}
            <div
                className={`
                    fixed bottom-28 right-6 z-[9998]
                    w-[400px] h-[580px] max-h-[80vh]
                    bg-white rounded-3xl shadow-2xl
                    border border-gray-100
                    flex flex-col overflow-hidden
                    transition-all duration-500 ease-out origin-bottom-right
                    ${isOpen
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
                    }
                `}
                id="chatbot-window"
            >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 px-5 py-4 shrink-0">
                    {/* Background decoration */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10"></div>
                        <div className="absolute -bottom-3 -left-3 w-16 h-16 rounded-full bg-white/5"></div>
                    </div>

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-base">BookVerse AI</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    <span className="text-white/80 text-xs">Luôn sẵn sàng hỗ trợ</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleClearChat}
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                                title="Xóa lịch sử chat"
                            >
                                <Trash2 className="w-4 h-4 text-white/80" />
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                                title="Thu nhỏ"
                            >
                                <Minimize2 className="w-4 h-4 text-white/80" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white chatbot-messages">
                    {isLoadingHistory ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                                <span className="text-sm text-gray-400">Đang tải lịch sử...</span>
                            </div>
                        </div>
                    ) : messages.length === 0 ? (
                        /* Welcome State */
                        <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                                <Bot className="w-10 h-10 text-primary-500" />
                            </div>
                            <div className="text-center space-y-2">
                                <h4 className="font-bold text-gray-800 text-lg">Xin chào! 👋</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Tôi là trợ lý AI của BookVerse. Tôi có thể giúp bạn tìm sách, tra cứu giá, và giải đáp mọi thắc mắc!
                                </p>
                            </div>
                            {/* Quick action buttons */}
                            <div className="flex flex-wrap gap-2 justify-center mt-2">
                                {['Sách bán chạy?', 'Tìm sách hay', 'Khuyến mãi hôm nay'].map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => {
                                            setInputValue(q);
                                            setTimeout(() => inputRef.current?.focus(), 50);
                                        }}
                                        className="px-3 py-2 text-xs font-medium bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-colors border border-primary-100 hover:border-primary-200 cursor-pointer"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Messages List */
                        messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-2.5 animate-fade-in-up ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                    }`}
                            >
                                {/* Avatar */}
                                <div
                                    className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-primary-400 to-primary-600'
                                        : 'bg-gradient-to-br from-gray-100 to-gray-200'
                                        }`}
                                >
                                    {msg.role === 'user' ? (
                                        <User className="w-4 h-4 text-white" />
                                    ) : (
                                        <Bot className="w-4 h-4 text-primary-500" />
                                    )}
                                </div>

                                {/* Message Bubble */}
                                <div
                                    className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl rounded-tr-md shadow-md shadow-primary-500/20'
                                        : 'bg-white text-gray-700 rounded-2xl rounded-tl-md shadow-md border border-gray-100'
                                        }`}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />
                                    {/* Streaming cursor */}
                                    {msg.role === 'assistant' && isStreaming && idx === messages.length - 1 && (
                                        <span className="inline-block w-1.5 h-4 bg-primary-400 ml-0.5 animate-blink align-middle rounded-sm"></span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                    {/* Streaming indicator */}
                    {isStreaming && messages.length > 0 && messages[messages.length - 1]?.content === '' && (
                        <div className="flex gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shrink-0 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-primary-500" />
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-md shadow-md border border-gray-100">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="shrink-0 px-4 py-3 bg-white border-t border-gray-100">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập tin nhắn..."
                            disabled={isStreaming}
                            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 disabled:opacity-50"
                            id="chatbot-input"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isStreaming}
                            className={`
                                w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0
                                ${inputValue.trim() && !isStreaming
                                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/30 hover:shadow-lg hover:shadow-primary-500/40 scale-100'
                                    : 'bg-gray-200 text-gray-400 scale-95'
                                }
                            `}
                            id="chatbot-send-btn"
                        >
                            <Send className={`w-4 h-4 ${isStreaming ? 'animate-pulse' : ''}`} />
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center mt-2">
                        Powered by BookVerse AI • Hỗ trợ 24/7
                    </p>
                </div>
            </div>
        </>
    );
};

export default ChatBot;
