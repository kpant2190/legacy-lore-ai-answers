import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, Mic } from 'lucide-react';

const Archive = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const handleStartInterview = () => {
    navigate('/interview');
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
            <Button variant="ghost" onClick={() => navigate('/interview')} className="text-muted-foreground hover:text-primary">
              Interview
            </Button>
            <Button variant="ghost" className="text-primary font-medium">
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
      <main className="relative z-10 container mx-auto px-6 py-16 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Story Archive</h1>
          <p className="text-muted-foreground text-lg">Browse and search through your captured memories</p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/20 mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search stories, keywords, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-background/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="family">Family History</SelectItem>
                  <SelectItem value="career">Career Journey</SelectItem>
                  <SelectItem value="childhood">Childhood Memories</SelectItem>
                  <SelectItem value="wisdom">Life Lessons</SelectItem>
                  <SelectItem value="achievements">Achievements</SelectItem>
                  <SelectItem value="relationships">Relationships</SelectItem>
                  <SelectItem value="challenges">Challenges</SelectItem>
                  <SelectItem value="travel">Travel & Adventures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* No Stories State */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/20">
          <CardContent className="p-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No stories yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start your first interview to capture your stories
            </p>
            <Button 
              onClick={handleStartInterview}
              className="bg-primary hover:bg-primary/90"
            >
              Start Interview
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Archive;