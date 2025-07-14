import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

export function ChatMessage({ message, isUser, timestamp, isLoading }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex gap-3 animate-fade-in-up",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className={cn(
        "w-10 h-10 border-2",
        isUser 
          ? "border-accent bg-gradient-accent" 
          : "border-primary bg-gradient-primary"
      )}>
        <AvatarFallback className="bg-transparent">
          {isUser ? (
            <User className="w-5 h-5 text-accent-foreground" />
          ) : (
            <Bot className="w-5 h-5 text-primary-foreground" />
          )}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "flex flex-col max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-3 shadow-card transition-all duration-300 hover:shadow-glow",
          isUser
            ? "bg-gradient-accent text-accent-foreground rounded-br-md"
            : "bg-card text-card-foreground rounded-bl-md border border-border"
        )}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-wave" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-wave" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-wave" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-muted-foreground">Legacy is thinking...</span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          )}
        </div>
        
        <span className="text-xs text-muted-foreground mt-1 px-2">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}