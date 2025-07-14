import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function MessageInput({ 
  onSendMessage, 
  isLoading, 
  placeholder = "Ask Legacy anything..." 
}: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <div className="flex-1 relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "min-h-[60px] max-h-[120px] resize-none",
            "bg-secondary/50 border-border",
            "focus:border-primary focus:ring-primary focus:shadow-glow",
            "transition-all duration-300",
            "placeholder:text-muted-foreground"
          )}
          disabled={isLoading}
        />
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          {message.length}/1000
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={!message.trim() || isLoading}
        className={cn(
          "h-[60px] px-6 bg-gradient-primary hover:shadow-glow",
          "transition-all duration-300 transform hover:scale-105",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        )}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </Button>
    </form>
  );
}