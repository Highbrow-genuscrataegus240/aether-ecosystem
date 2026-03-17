// @ts-nocheck
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, ChevronDown } from 'lucide-react';
import { ChatMessage, sendChatMessage, getQuickActions, ChatContext } from '../services/chatService';
import { ProductAnalytics, Sale, Supplier } from '../types';

interface AIChatbotProps {
    analytics: ProductAnalytics[];
    sales: Sale[];
    suppliers: Supplier[];
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ analytics, sales, suppliers }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const chatPanelRef = useRef<HTMLDivElement>(null);
    const floatingButtonRef = useRef<HTMLButtonElement>(null);

    const context: ChatContext = { analytics, sales, suppliers };
    const quickActions = getQuickActions();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isOpen) return;

            const target = event.target as Node;
            const clickedInsidePanel = chatPanelRef.current?.contains(target);
            const clickedFloatingButton = floatingButtonRef.current?.contains(target);

            if (!clickedInsidePanel && !clickedFloatingButton) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSend = async (messageText?: string) => {
        const text = messageText || input.trim();
        if (!text || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await sendChatMessage(text, context, messages);
            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                ref={floatingButtonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${isOpen
                    ? 'bg-neutral-800 text-neutral-400 rotate-0'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-purple-500/25 hover:shadow-xl hover:scale-105'
                    }`}
            >
                {isOpen ? <ChevronDown className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>

            {/* Chat Panel */}
            <div
                ref={chatPanelRef}
                className={`fixed bottom-24 right-6 z-50 w-[420px] max-h-[600px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-border bg-gradient-to-r from-purple-900/30 to-indigo-900/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Inventory AI</h3>
                                <p className="text-xs text-muted-foreground">Ask anything about your inventory</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                                <Sparkles className="w-8 h-8 text-purple-400" />
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Hi! I can help you analyze your inventory. Try asking:
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {quickActions.map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(action)}
                                        className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-foreground transition-colors"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-purple-600 text-white rounded-br-md'
                                        : 'bg-muted text-foreground rounded-bl-md'
                                        }`}
                                >
                                    <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions (when messages exist) */}
                {messages.length > 0 && (
                    <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
                        {quickActions.slice(0, 2).map((action, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(action)}
                                disabled={isLoading}
                                className="text-xs px-3 py-1 bg-muted/50 hover:bg-muted rounded-full text-muted-foreground whitespace-nowrap transition-colors disabled:opacity-50"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-border bg-background/50">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about your inventory..."
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
