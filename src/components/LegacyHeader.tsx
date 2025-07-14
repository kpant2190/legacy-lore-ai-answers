// No imports needed

export function LegacyHeader() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background border-b border-border/20">
      {/* Sophisticated background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative container mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-7xl font-medium tracking-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-300% animate-gradient">
              Legacy
            </span>
          </h1>
        </div>
      </div>
    </header>
  );
}