import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { MessageInput } from './MessageInput';
import { VoiceRecorder } from './VoiceRecorder';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Database, Mic } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Mock RAG responses - replace with actual API calls
  const mockRAGResponses = [
    "Based on my knowledge base, I can help you with that. Here's what I found...",
    "Let me search through the documentation for you. According to the latest information...",
    "I've analyzed the relevant data from my knowledge base. The answer is...",
    "From the research papers and documentation I have access to, I can tell you that...",
    "Based on similar queries in my database, here's a comprehensive answer..."
  ];

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateRAGResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const baseResponse = mockRAGResponses[Math.floor(Math.random() * mockRAGResponses.length)];
    
    // Create contextual response based on user input
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return `Hello! I'm Legacy, your AI knowledge assistant. I can help you find information from my extensive knowledge base. What would you like to know?`;
    }
    
    if (userMessage.toLowerCase().includes('how') || userMessage.toLowerCase().includes('what')) {
      return `${baseResponse}\n\nBased on the context of your question about "${userMessage.substring(0, 50)}...", I can provide you with detailed information. This response is generated from multiple sources in my knowledge base, ensuring accuracy and relevance.\n\n📚 Sources: Document Database, Research Papers, Technical Documentation`;
    }
    
    return `${baseResponse}\n\nRegarding your query: "${userMessage.substring(0, 60)}..."\n\nI've processed this through my RAG system and found relevant information. The knowledge base contains comprehensive data that helps me provide contextual and accurate responses.\n\n🔍 Confidence: 94% | 📊 Sources: 3 documents`;
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await simulateRAGResponse(content);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble accessing my knowledge base right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceRecording = async (audioBlob: Blob) => {
    // In a real implementation, you would:
    // 1. Send audioBlob to speech-to-text service
    // 2. Get transcribed text
    // 3. Process with RAG system
    
    // For demo purposes, simulate speech-to-text
    const simulatedTranscription = "This is a simulated transcription from your voice recording. In a real implementation, this would be converted from speech to text using a service like OpenAI Whisper or Google Speech-to-Text.";
    
    await handleSendMessage(simulatedTranscription);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat Messages */}
      <Card className="flex-1 bg-card/50 backdrop-blur-sm border-border overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
              <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Ready to Assist
              </h3>
              <p className="text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Start your conversation with Legacy. I'll provide intelligent responses 
                using advanced knowledge retrieval technology.
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge variant="secondary" className="bg-secondary/30 backdrop-blur-sm border border-border/50 px-4 py-2">
                  🧠 Advanced RAG
                </Badge>
                <Badge variant="secondary" className="bg-secondary/30 backdrop-blur-sm border border-border/50 px-4 py-2">
                  🎤 Voice Enabled
                </Badge>
                <Badge variant="secondary" className="bg-secondary/30 backdrop-blur-sm border border-border/50 px-4 py-2">
                  📊 Enterprise Ready
                </Badge>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <ChatMessage
                  message=""
                  isUser={false}
                  timestamp={new Date()}
                  isLoading={true}
                />
              )}
            </div>
          )}
        </ScrollArea>
      </Card>

      {/* Input Section */}
      <Card className="mt-4 p-6 bg-card/60 backdrop-blur-xl border-border/50 shadow-xl">
        <div className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-3 justify-center">
            <Badge 
              variant={inputMode === 'text' ? 'default' : 'secondary'}
              className={`cursor-pointer transition-all duration-300 px-6 py-2 rounded-full ${
                inputMode === 'text' 
                  ? 'bg-gradient-primary shadow-glow' 
                  : 'bg-secondary/50 hover:bg-secondary/70 backdrop-blur-sm'
              }`}
              onClick={() => setInputMode('text')}
            >
              💬 Text Input
            </Badge>
            <Badge 
              variant={inputMode === 'voice' ? 'default' : 'secondary'}
              className={`cursor-pointer transition-all duration-300 px-6 py-2 rounded-full flex items-center gap-2 ${
                inputMode === 'voice' 
                  ? 'bg-gradient-primary shadow-glow' 
                  : 'bg-secondary/50 hover:bg-secondary/70 backdrop-blur-sm'
              }`}
              onClick={() => setInputMode('voice')}
            >
              <Mic className="w-3 h-3" />
              Voice Input
            </Badge>
          </div>

          <Separator className="bg-border/30" />

          {/* Input Controls */}
          {inputMode === 'text' ? (
            <MessageInput 
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          ) : (
            <div className="flex justify-center">
              <VoiceRecorder 
                onRecordingComplete={handleVoiceRecording}
                isDisabled={isLoading}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}