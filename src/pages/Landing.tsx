import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, RotateCcw, Archive, Search, BookOpen, Mic } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">LegacyVoice AI</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/interview" className="text-muted-foreground hover:text-primary transition-colors">
              Interview
            </Link>
            <Link to="/archive" className="text-muted-foreground hover:text-primary transition-colors">
              Archive
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Share Your Story
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Let our AI interviewer guide you through capturing your memories, wisdom, and 
            experiences in a natural conversation.
          </p>
          
          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Start Interview</h3>
                <p className="text-muted-foreground text-sm">
                  Begin a new conversation session
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Continue Story</h3>
                <p className="text-muted-foreground text-sm">
                  Resume a previous session
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Archive className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">View Archive</h3>
                <p className="text-muted-foreground text-sm">
                  Browse your captured stories
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Your Stories, Preserved Forever
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            LegacyVoice AI transforms your conversations into lasting memories that 
            can be shared, searched, and cherished by future generations.
          </p>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Searchable Archive</h3>
                <p className="text-muted-foreground text-sm">
                  Find any story or memory instantly with our intelligent search system.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Memory Books</h3>
                <p className="text-muted-foreground text-sm">
                  Create beautiful, printable books from your captured conversations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Voice Companion</h3>
                <p className="text-muted-foreground text-sm">
                  Future AI that speaks and responds just like your loved one.
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