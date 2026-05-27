import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, MoreVertical, Loader2, Image as ImageIcon, Paperclip, Mic, X } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AIChatbot() {
    const [messages, setMessages] = useState([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm your AI HR Assistant. I can help you analyze candidate resumes, prepare interview questions, track applications, or explain HR metrics. How can I help you today?",
            timestamp: new Date().toISOString()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const suggestions = [
        "Analyze the top 3 candidates for Frontend Dev",
        "Generate 5 technical questions for a React interview",
        "Why was Michael Chen's resume flagged?",
        "Show me a summary of last week's hiring metrics"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Keep focus on input
        setTimeout(() => inputRef.current?.focus(), 10);

        // Phase 1 Mock AI Response
        setTimeout(() => {
            setIsTyping(false);
            const aiMsg = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `(Mock Response) I understood your request: "${text}". In Phase 2, I will process this using the NLP model to provide real insights and actions based on your actual candidate data!`,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1500);
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] animate-in fade-in duration-500 pb-6 flex flex-col">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <Bot className="w-6 h-6" />
                        </div>
                        AI Workspace
                    </h1>
                    <p className="text-muted-foreground mt-1 ml-13">Intelligent assistant for recruiting, analytics, and automation.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Online
                    </span>
                    <button className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Chat Interface */}
            <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden shadow-lg border border-border/60">

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth bg-muted/5">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex gap-4 max-w-[85%] md:max-w-[75%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                                message.role === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            {/* Avatar */}
                            <div className="shrink-0 mt-1">
                                {message.role === 'assistant' ? (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm border border-border">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-sm border border-primary/20">
                                        <User className="w-4 h-4" />
                                    </div>
                                )}
                            </div>

                            {/* Message Bubble */}
                            <div className={cn(
                                "flex flex-col gap-1",
                                message.role === 'user' ? "items-end" : "items-start"
                            )}>
                                <div className={cn(
                                    "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                                    message.role === 'user'
                                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                                        : "bg-card border border-border/50 text-foreground rounded-tl-sm"
                                )}>
                                    {message.content}
                                </div>
                                <span className="text-[10px] text-muted-foreground font-medium px-1">
                                    {formatTime(message.timestamp)}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex gap-4 max-w-[85%] md:max-w-[75%] animate-in fade-in slide-in-from-bottom-2">
                            <div className="shrink-0 mt-1">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm border border-border">
                                    <Bot className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="bg-card border border-border/50 px-4 py-3.5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-[44px]">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_0ms]"></span>
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_400ms]"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-card border-t border-border shrink-0">

                    {/* Smart Suggestions */}
                    {messages.length < 3 && !isTyping && (
                        <div className="flex flex-wrap gap-2 mb-4 hide-scrollbar">
                            {suggestions.map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(suggestion)}
                                    className="text-xs font-medium px-3 py-1.5 bg-muted/50 hover:bg-muted border border-border/50 rounded-full text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Box */}
                    <div className="relative flex items-end gap-2 bg-background border border-border rounded-2xl p-2 focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all shadow-sm">

                        <div className="flex items-center gap-1 pb-1 pl-1 shrink-0 text-muted-foreground">
                            <button className="p-2 hover:bg-muted hover:text-foreground rounded-xl transition-colors" title="Attach File">
                                <Paperclip className="w-4 h-4" />
                            </button>
                        </div>
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Ask about candidates, generated JDs, or hiring metrics..."
                            className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 min-h-[44px] py-3 text-sm placeholder:text-muted-foreground/60 overflow-y-auto"
                            rows={1}
                            autoFocus
                        />

                        <div className="flex items-center gap-2 pb-1 pr-1 shrink-0">
                            <button className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-colors hidden sm:block" title="Voice Input">
                                <Mic className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isTyping}
                                className="p-2.5 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm flex items-center justify-center shrink-0"
                            >
                                {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="text-center mt-2">
                        <span className="text-[10px] text-muted-foreground">AI can make mistakes. Verify important HR decisions.</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
