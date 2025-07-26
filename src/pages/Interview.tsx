import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Mic } from 'lucide-react';

const Interview = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<'enhanced' | 'realtime'>('enhanced');

  // Redirect to auth if not authenticated
  if (!loading && !isAuthenticated) {
    navigate('/auth');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const topics = [
    'Family History & Early Life',
    'Career & Professional Journey',
    'Love & Relationships',
    'Life Lessons & Wisdom',
    'Childhood Memories',
    'Overcoming Challenges',
    'Proudest Achievements',
    'Travel & Adventures',
    'Custom Topic'
  ];

  const handleStartInterview = () => {
    // Navigate to the actual interview interface
    navigate('/chat');
  };

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

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-xl bg-card/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow relative">
              <Mic className="w-6 h-6 text-white" />
              <div className="absolute inset-0 bg-gradient-primary rounded-xl opacity-50 blur-sm"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              LegacyVoice AI
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-muted-foreground hover:text-primary">
              Home
            </Button>
            <Button variant="ghost" className="text-primary font-medium">
              Interview
            </Button>
            <Button variant="ghost" onClick={() => navigate('/archive')} className="text-muted-foreground hover:text-primary">
              Archive
            </Button>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/account')} className="text-muted-foreground hover:text-primary">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                👤
              </div>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-16 max-w-4xl">
        <Card className="bg-card/80 backdrop-blur-sm border-border/20">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Start Your Interview Session</h1>
              <p className="text-muted-foreground">What would you like to talk about today?</p>
            </div>

            {/* Topic Selection */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {topics.map((topic) => (
                  <Button
                    key={topic}
                    variant={selectedTopic === topic ? "default" : "outline"}
                    className={`h-auto p-4 text-left justify-start ${
                      selectedTopic === topic 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-background hover:bg-muted'
                    }`}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>

            {/* Experience Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Choose your interview experience</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedExperience === 'enhanced' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-border/50'
                  }`}
                  onClick={() => setSelectedExperience('enhanced')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Enhanced Voice</h4>
                      {selectedExperience === 'enhanced' && (
                        <Badge variant="default" className="bg-primary text-primary-foreground">Selected</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Improved pause handling + better voice quality
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedExperience === 'realtime' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-border/50'
                  }`}
                  onClick={() => setSelectedExperience('realtime')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">OpenAI Realtime</h4>
                      {selectedExperience === 'realtime' && (
                        <Badge variant="default" className="bg-primary text-primary-foreground">Selected</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ChatGPT-style natural conversation flow
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStartInterview}
                disabled={!selectedTopic}
                className="bg-primary hover:bg-primary/90"
              >
                Start Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Interview;