import { LegacyHeader } from '@/components/LegacyHeader';
import { ChatInterface } from '@/components/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-glow opacity-20 pointer-events-none" />
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }} />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        <LegacyHeader />
        
        <main className="container mx-auto px-6 py-8 h-[calc(100vh-200px)]">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
};

export default Index;
