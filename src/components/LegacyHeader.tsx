import { Brain } from 'lucide-react';

export function LegacyHeader() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background border-b border-border/20">
      {/* Sophisticated background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative container mx-auto px-6 py-12">
        <div className="flex items-center justify-center">
          <div className="relative group">
            {/* Enhanced glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700 animate-pulse" />
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-40" />
            
            {/* Logo container */}
            <div className="relative bg-gradient-to-br from-card via-card/80 to-background backdrop-blur-xl p-4 rounded-full border border-border/50 shadow-2xl">
              <Brain className="w-10 h-10 text-primary drop-shadow-lg" />
            </div>
          </div>
        </div>
        
        {/* Enhanced Legacy text */}
        <div className="mt-8 text-center">
          <h1 className="text-6xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-300% animate-gradient">
              Legacy
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full" />
        </div>
      </div>
    </header>
  );
}