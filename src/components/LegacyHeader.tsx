import { Brain, Sparkles } from 'lucide-react';

export function LegacyHeader() {
  return (
    <header className="relative overflow-hidden bg-gradient-secondary border-b border-border">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-glow opacity-20" />
      
      <div className="relative container mx-auto px-6 py-8">
        <div className="flex items-center justify-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-full blur-lg opacity-60 animate-pulse-glow" />
            <div className="relative bg-gradient-primary p-3 rounded-full">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Legacy
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Knowledge Assistant
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Ask questions using text or voice, and I'll search through my knowledge base to provide accurate, 
            contextual answers powered by advanced RAG technology.
          </p>
        </div>
      </div>
    </header>
  );
}