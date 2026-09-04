import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Sparkles, Trash2, Minus, MessageSquare } from 'lucide-react';
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

// Parse basic markdown: bullet points, bold, italic, inline code, links, line breaks
const parseMarkdown = (text: string): string => {
    if (!text) return '';
    return text
        .replace(/\r\n/g, '\n')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/^[ \t]*[-*]\s+/gm, '• ')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^\s*].*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-[#f4f3f1] px-1 py-0.5 rounded text-[11px] font-mono">$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#0070b5] hover:underline font-semibold" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/\n/g, '<br/>');
};

// Format timestamp
const formatTime = (timeStr?: string): string => {
    try {
        const d = timeStr ? new Date(timeStr) : new Date();
        if (isNaN(d.getTime())) return '';
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return '';
    }
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

    // Typewriter streaming references
    const targetContentRef = useRef('');
    const displayedContentRef = useRef('');
    const isStreamCompletedRef = useRef(false);
    const typewriterTimerRef = useRef<number | null>(null);

    // Auto scroll to bottom
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 250);
        }
    }, [isOpen]);

    // Hide hint bubble after 8 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowBubbleHint(false), 8000);
        return () => clearTimeout(timer);
    }, []);

    const stopTypewriter = useCallback(() => {
        if (typewriterTimerRef.current !== null) {
            clearInterval(typewriterTimerRef.current);
            typewriterTimerRef.current = null;
        }
    }, []);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            stopTypewriter();
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [stopTypewriter]);

    const startTypewriter = useCallback(() => {
        stopTypewriter();
        typewriterTimerRef.current = window.setInterval(() => {
            const target = targetContentRef.current;
            const current = displayedContentRef.current;

            if (current.length < target.length) {
                const remaining = target.length - current.length;
                // Adaptive speed: type faster if we have more buffered characters
                const step = remaining > 120 ? 6 : remaining > 50 ? 4 : remaining > 20 ? 2 : 1;
                const nextContent = target.slice(0, current.length + step);
                displayedContentRef.current = nextContent;

                setMessages(prev => {
                    if (prev.length === 0) return prev;
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last && last.role === 'assistant') {
                        updated[updated.length - 1] = {
                            ...last,
                            content: nextContent,
                        };
                    }
                    return updated;
                });
            } else if (isStreamCompletedRef.current) {
                stopTypewriter();
                setIsStreaming(false);
            }
        }, 16);
    }, [stopTypewriter]);

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
        stopTypewriter();
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsStreaming(false);
        setIsOpen(false);
    };

    const handleClearChat = () => {
        stopTypewriter();
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsStreaming(false);
        setMessages([]);
        const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('chatbot_session_id', newSessionId);
        sessionId.current = newSessionId;
    };

    // Send message and handle SSE streaming with token-by-token typewriter
    const handleSendMessage = async (textToSend?: string) => {
        const query = (textToSend !== undefined ? textToSend : inputValue).trim();
        if (!query || isStreaming) return;

        stopTypewriter();
        targetContentRef.current = '';
        displayedContentRef.current = '';
        isStreamCompletedRef.current = false;

        const now = new Date().toISOString();
        const userMsg: IChatMessage = { role: 'user', content: query, timestamp: now };
        const assistantMsg: IChatMessage = { role: 'assistant', content: '', timestamp: now };

        setMessages(prev => [...prev, userMsg, assistantMsg]);
        setInputValue('');
        setIsStreaming(true);

        startTypewriter();

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
                    message: query,
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
                buffer = buffer.replace(/\r\n/g, '\n');

                const eventBlocks = buffer.split('\n\n');
                // The last block is incomplete until next \n\n delimiter
                buffer = eventBlocks.pop() || '';

                for (const block of eventBlocks) {
                    if (!block.trim()) continue;
                    const lines = block.split('\n');
                    const dataLines: string[] = [];
                    for (const line of lines) {
                        if (line.startsWith('data:')) {
                            // Extract exact data content after 'data:', preserving spaces and newlines
                            dataLines.push(line.slice(5));
                        }
                    }
                    const tokenStr = dataLines.join('\n');
                    if (tokenStr) {
                        targetContentRef.current += tokenStr;
                    }
                }
            }

            // Process any trailing event block in buffer
            if (buffer.trim()) {
                const lines = buffer.split('\n');
                const dataLines: string[] = [];
                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        dataLines.push(line.slice(5));
                    }
                }
                const tokenStr = dataLines.join('\n');
                if (tokenStr) {
                    targetContentRef.current += tokenStr;
                }
                buffer = '';
            }

            isStreamCompletedRef.current = true;
        } catch (error: unknown) {
            if (error instanceof Error && error.name === 'AbortError') {
                stopTypewriter();
                setIsStreaming(false);
                return;
            }
            console.error('Chat stream error:', error);
            stopTypewriter();
            setIsStreaming(false);
            setMessages(prev => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.content) {
                    updated[updated.length - 1] = {
                        ...lastMsg,
                        content: 'Xin lỗi, đã có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại sau giây lát nhé.',
                    };
                }
                return updated;
            });
        } finally {
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
        <div
            className="fixed bottom-6 right-6 md:right-8 z-50 flex flex-col items-end gap-3"
            id="ai-curator-widget"
        >
            {/* Chat Window - Only rendered when open */}
            {isOpen && (
                <div
                    className="w-[370px] sm:w-[390px] h-[500px] max-h-[calc(100vh-210px)] min-h-[350px] bg-[#faf9f7] rounded-xl shadow-2xl border border-[#e5e2dd] flex flex-col overflow-hidden animate-fade-in-up"
                    id="chatbot-window"
                >
                    {/* Header */}
                    <div className="px-4 py-3.5 bg-white border-b border-[#e5e2dd] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#1a1a1a] text-white shadow-sm shrink-0">
                                <Sparkles className="w-4 h-4 text-white" />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h3 className="font-serif text-[15px] font-semibold text-[#1a1a1a] leading-none">
                                        BookVerse AI Curator
                                    </h3>
                                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#e9e8e6] text-[#4c4546]">
                                        BETA
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#4c4546] mt-0.5 leading-none">
                                    Trợ lý gợi ý &amp; tìm kiếm sách
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-[#4c4546]">
                            <button
                                onClick={handleClearChat}
                                className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#f4f3f1] transition-colors duration-200 cursor-pointer"
                                title="Xóa lịch sử hội thoại"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#f4f3f1] transition-colors duration-200 cursor-pointer"
                                title="Thu nhỏ"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#f4f3f1] transition-colors duration-200 cursor-pointer"
                                title="Đóng"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 text-[13px] leading-relaxed chatbot-messages bg-[#faf9f7]">
                        {isLoadingHistory ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="flex flex-col items-center gap-2 text-[#4c4546]">
                                    <div className="w-6 h-6 border-2 border-[#1a1a1a]/20 border-t-[#1a1a1a] rounded-full animate-spin"></div>
                                    <span className="text-[12px]">Đang tải lịch sử...</span>
                                </div>
                            </div>
                        ) : messages.length === 0 ? (
                            /* Welcome Initial State */
                            <div className="space-y-4">
                                <div className="flex gap-2.5 max-w-[95%]">
                                    <div className="w-7 h-7 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                        <Sparkles className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="bg-white p-3.5 rounded-lg rounded-tl-none border border-[#e5e2dd] shadow-xs text-[#1a1a1a] space-y-2">
                                        <p className="font-serif text-[14px] font-semibold text-[#1a1a1a]">
                                            Chào mừng bạn đến với BookVerse! 📖
                                        </p>
                                        <p className="text-[12.5px] leading-relaxed text-[#4c4546]">
                                            Tôi là <strong>BookVerse AI Curator</strong>. Bạn đang tìm kiếm một cuốn sách thế nào hôm nay? Hãy chia sẻ tâm trạng, thể loại hoặc chủ đề bạn đang quan tâm nhé!
                                        </p>
                                        <span className="block text-[10px] text-[#848484] pt-1">
                                            {formatTime()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Messages List */
                            messages.map((msg, idx) => {
                                const isUser = msg.role === 'user';
                                const isLastAssistant = !isUser && idx === messages.length - 1;
                                const isWaitingFirstToken = isLastAssistant && isStreaming && !msg.content;

                                return (
                                    <div
                                        key={idx}
                                        className={`flex gap-2.5 animate-fade-in-up ${isUser ? 'justify-end' : 'justify-start max-w-[95%]'}`}
                                    >
                                        {!isUser && (
                                            <div className="w-7 h-7 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                                <Sparkles className="w-3.5 h-3.5" />
                                            </div>
                                        )}

                                        <div
                                            className={`
                                            p-3 rounded-lg shadow-xs text-[13px] leading-relaxed
                                            ${isUser
                                                    ? 'max-w-[85%] bg-[#1a1a1a] text-white rounded-tr-none'
                                                    : 'bg-white text-[#1a1a1a] rounded-tl-none border border-[#e5e2dd]'
                                                }
                                        `}
                                        >
                                            {isWaitingFirstToken ? (
                                                /* Single bouncing dots animation inside bubble while waiting for first tokens */
                                                <div className="flex items-center gap-1.5 py-1 px-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div
                                                        className="space-y-1"
                                                        dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }}
                                                    />

                                                    {/* Streaming Cursor */}
                                                    {isLastAssistant && isStreaming && (
                                                        <span className="inline-block w-1.5 h-3.5 bg-[#1a1a1a] ml-0.5 animate-pulse align-middle"></span>
                                                    )}

                                                    <span
                                                        className={`block text-[10px] mt-1 ${isUser ? 'text-white/60 text-right' : 'text-[#848484]'
                                                            }`}
                                                    >
                                                        {formatTime(msg.timestamp)}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-[#e5e2dd] shrink-0">
                        <div className="flex items-center bg-[#f4f3f1] border border-[#e5e2dd] rounded-md px-3 py-1.5 focus-within:border-[#1a1a1a] transition-colors">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Hỏi về sách, tác giả, cảm xúc..."
                                disabled={isStreaming}
                                className="bg-transparent border-none outline-none text-[13px] w-full placeholder-[#848484] focus:ring-0 px-0 py-1 h-7 text-[#1a1a1a] disabled:opacity-50"
                                id="chatbot-input"
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={!inputValue.trim() || isStreaming}
                                className="ml-2 w-7 h-7 shrink-0 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#0070b5] text-white rounded transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:hover:bg-[#1a1a1a]"
                                id="chatbot-send-btn"
                                title="Gửi tin nhắn"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 mt-2 text-[10.5px] text-[#4c4546]">
                            <span>Được hỗ trợ bởi BookVerse AI • Tìm kiếm ngữ cảnh</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Hint Tooltip (when chat is closed) */}
            {showBubbleHint && !isOpen && (
                <div className="animate-fade-in-up bg-white rounded-xl shadow-xl px-3.5 py-2.5 max-w-[240px] border border-[#e5e2dd] relative flex items-start gap-2 text-[#1a1a1a] mr-1">
                    <button
                        onClick={() => setShowBubbleHint(false)}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#e9e8e6] hover:bg-[#dadad8] rounded-full flex items-center justify-center text-[#4c4546] text-[10px] transition-colors cursor-pointer"
                        title="Đóng gợi ý"
                    >
                        ×
                    </button>
                    <Sparkles className="w-4 h-4 text-[#0070b5] shrink-0 mt-0.5" />
                    <p className="text-[11.5px] leading-snug">
                        Bạn cần tìm sách hay? Hỏi <strong>AI Curator</strong> nhé!
                    </p>
                </div>
            )}

            {/* Floating Launcher Button matching Stitch */}
            <button
                onClick={isOpen ? handleClose : handleOpen}
                className="w-13 h-13 sm:w-14 sm:h-14 p-3.5 bg-[#1a1a1a] hover:bg-[#0070b5] text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
                title="BookVerse AI Curator"
                id="chatbot-toggle-btn"
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white transition-transform duration-200" />
                ) : (
                    <MessageSquare className="w-6 h-6 text-white transition-transform duration-200 group-hover:scale-110" />
                )}
            </button>
        </div>
    );
};

export default ChatBot;
