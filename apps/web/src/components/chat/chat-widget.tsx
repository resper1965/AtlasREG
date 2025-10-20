'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const SUGESTOES_INICIAIS = [
  "Maiores multas de outubro",
  "Qual o RAP da Taesa?",
  "Últimas decisões da ANEEL",
  "Empresas com alto risco",
  "Tendências do setor",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus no input quando abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    
    if (!textToSend.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Chamar API do backend
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Adicionar token de auth
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: textToSend,
          session_id: 'default',
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      const data = await response.json();

      // Adicionar resposta do bot
      const botMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro no chat:', error);

      // Mensagem de erro
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await fetch('/api/v1/chat/history?session_id=default', {
        method: 'DELETE',
        // TODO: Adicionar token
      });

      setMessages([]);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-[#00ADE8] hover:bg-[#00ADE8]/90 shadow-2xl hover:shadow-[#00ADE8]/50 transition-all duration-300 hover:scale-110 z-50"
          aria-label="Abrir chat com Atlas"
        >
          <div className="relative">
            <MessageCircle className="h-7 w-7" />
            <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-white animate-pulse" />
          </div>
        </Button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[420px] h-[650px] flex flex-col border-[#00ADE8]/30 bg-card/95 backdrop-blur-xl shadow-2xl shadow-[#00ADE8]/20 z-50 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/40 bg-gradient-to-r from-[#00ADE8]/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00ADE8] to-[#0088b8] flex items-center justify-center shadow-lg shadow-[#00ADE8]/50 relative">
                <span className="text-xl">🤖</span>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-400 border-2 border-card animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                  Atlas
                  <Sparkles className="h-3 w-3 text-[#00ADE8]" />
                </p>
                <p className="text-xs text-muted-foreground">
                  Especialista em Energia
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearHistory}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  title="Limpar histórico"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {/* Mensagem de boas-vindas */}
              {messages.length === 0 && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted/50 p-4 text-sm text-foreground border border-border/40">
                    <p className="font-medium mb-2 flex items-center gap-1">
                      👋 Olá! Sou o Atlas
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Especialista em transmissão de energia. Posso ajudar com:
                    </p>
                    <ul className="text-muted-foreground text-xs mt-2 space-y-1 list-disc list-inside">
                      <li>Buscar eventos e decisões regulatórias</li>
                      <li>Analisar empresas transmissoras</li>
                      <li>Comparar métricas financeiras</li>
                      <li>Identificar tendências do setor</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Mensagens */}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl p-4 text-sm',
                      msg.role === 'user'
                        ? 'bg-[#00ADE8] text-white rounded-tr-sm shadow-lg shadow-[#00ADE8]/30'
                        : 'bg-muted/50 text-foreground rounded-tl-sm border border-border/40'
                    )}
                  >
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown
                        className="prose prose-sm prose-invert max-w-none [&>p]:leading-relaxed [&>ul]:my-2 [&>ul]:list-disc [&>ul]:list-inside [&>ol]:my-2 [&>ol]:list-decimal [&>ol]:list-inside [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mt-3 [&>h3]:mb-1 [&>table]:text-xs [&>table]:my-2"
                        components={{
                          // Customizar elementos do markdown
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted/50 p-4 border border-border/40">
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-[#00ADE8] animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 rounded-full bg-[#00ADE8] animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 rounded-full bg-[#00ADE8] animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Sugestões de perguntas */}
          {messages.length === 0 && (
            <div className="px-4 pb-2">
              <p className="text-[10px] text-muted-foreground mb-2">
                💡 Perguntas sugeridas:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGESTOES_INICIAIS.map((sugestao, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2.5 hover:bg-[#00ADE8]/10 hover:border-[#00ADE8]/50 hover:text-[#00ADE8] transition-colors"
                    onClick={() => sendMessage(sugestao)}
                    disabled={isLoading}
                  >
                    {sugestao}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border/40 bg-gradient-to-t from-card/50 to-transparent">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pergunte sobre eventos, empresas..."
                className="bg-muted/50 border-border/40 focus-visible:ring-[#00ADE8]/50 text-sm"
                disabled={isLoading}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="bg-[#00ADE8] hover:bg-[#00ADE8]/90 shadow-lg shadow-[#00ADE8]/30 transition-all duration-200 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 text-center border-t border-border/40">
            <p className="text-[9px] text-muted-foreground">
              Powered by <span className="text-[#00ADE8] font-medium">ness.</span> • IA com dados reais
            </p>
          </div>
        </Card>
      )}
    </>
  );
}

