import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, RotateCcw, Archive, Search, BookOpen, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserDropdown } from "@/components/UserDropdown";

const Landing = () => {
  const { user, loading, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 relative overflow-hidden">
      {/* Futuristic background effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
      </div>
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-xl bg-card/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow relative">
              <Mic className="w-6 h-6 text-white" />
              <div className="absolute inset-0 bg-gradient-primary rounded-xl opacity-50 blur-sm"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              LegacyVoice AI
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/interview" className="text-muted-foreground hover:text-primary transition-colors relative group">
              Interview
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/archive" className="text-muted-foreground hover:text-primary transition-colors relative group">
              Archive
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {!isAuthenticated ? (
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                      Sign In
                    </Button>
                  </Link>
                ) : (
                  <UserDropdown user={user} />
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-relaxed animate-fade-in px-4 py-2">
              Share Your Legacy
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              Let our AI interviewer guide you through capturing your memories, wisdom, and 
              experiences in a natural conversation that preserves your legacy forever.
            </p>
          </div>
          
          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-glow transition-all duration-500 hover:scale-105 bg-card/80 backdrop-blur-sm border-primary/20 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardContent className="relative z-10 p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                  <MessageSquare className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Start Interview</h3>
                <p className="text-muted-foreground">
                  Begin a new conversation session with our AI interviewer
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-glow transition-all duration-500 hover:scale-105 bg-card/80 backdrop-blur-sm border-accent/20 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardContent className="relative z-10 p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                  <RotateCcw className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Continue Story</h3>
                <p className="text-muted-foreground">
                  Resume a previous session and build upon your narrative
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-glow transition-all duration-500 hover:scale-105 bg-card/80 backdrop-blur-sm border-primary/20 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <CardContent className="relative z-10 p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                  <Archive className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">View Archive</h3>
                <p className="text-muted-foreground">
                  Browse and search through your captured memories
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-16 space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
              Your Stories, Preserved Forever
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              LegacyVoice AI transforms your conversations into lasting memories that 
              can be shared, searched, and cherished by future generations.
            </p>
          </div>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-glow transition-all duration-500 hover:scale-105 bg-card/80 backdrop-blur-sm border-accent/20 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative z-10 p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                  <Search className="w-12 h-12 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">Searchable Archive</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find any story or memory instantly with our intelligent search system powered by AI.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-glow transition-all duration-500 hover:scale-105 bg-card/80 backdrop-blur-sm border-primary/20 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative z-10 p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                  <BookOpen className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">Memory Books</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create beautiful, printable books from your captured conversations and stories.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-glow transition-all duration-500 hover:scale-105 bg-card/80 backdrop-blur-sm border-accent/20 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative z-10 p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-accent/30 to-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                  <Mic className="w-12 h-12 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">AI Voice Companion</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Future AI technology that speaks and responds just like your loved ones.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;