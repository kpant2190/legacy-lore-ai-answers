import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft, Mic } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import authBackground from "@/assets/auth-background.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { MFAVerification } from "@/components/MFAVerification";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Check localStorage for MFA state on component mount
  const [showMFAVerification, setShowMFAVerification] = useState(() => {
    const stored = localStorage.getItem('mfa_verification_active') === 'true';
    console.log('Auth component initializing, MFA verification from localStorage:', stored);
    return stored;
  });
  const [mfaChallengeId, setMfaChallengeId] = useState(() => {
    const stored = localStorage.getItem('mfa_challenge_id') || '';
    console.log('Auth component initializing, challenge ID from localStorage:', stored);
    return stored;
  });
  const [mfaFactorId, setMfaFactorId] = useState(() => {
    const stored = localStorage.getItem('mfa_factor_id') || '';
    console.log('Auth component initializing, factor ID from localStorage:', stored);
    return stored;
  });
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Block ALL redirects when MFA verification is active
  useEffect(() => {
    const mfaActive = localStorage.getItem('mfa_verification_active') === 'true';
    console.log('Redirect check - isAuthenticated:', isAuthenticated, 'showMFAVerification:', showMFAVerification, 'mfaActive:', mfaActive);
    
    // Only redirect if authenticated AND no MFA is active AND component doesn't show MFA
    if (isAuthenticated && !mfaActive && !showMFAVerification) {
      console.log('Redirecting to home - no MFA needed');
      navigate("/");
    } else if (isAuthenticated && (mfaActive || showMFAVerification)) {
      console.log('Blocking redirect - MFA verification needed');
    }
  }, [isAuthenticated, navigate, showMFAVerification]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Attempting sign in for:', email);
      
      // Set MFA checking state to prevent redirects
      localStorage.setItem('mfa_verification_active', 'true');
      
      // First, try to sign in normally
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log('Sign in error:', error);
        // Clear MFA state on error
        localStorage.removeItem('mfa_verification_active');
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        console.log('Initial sign in successful, user ID:', data.user.id);
        
        // Now check if this user has MFA enabled
        const { data: mfaData, error: mfaError } = await supabase.auth.mfa.listFactors();
        console.log('Checking MFA factors:', mfaData);
        
        if (mfaError) {
          console.error('Error checking MFA factors:', mfaError);
          localStorage.removeItem('mfa_verification_active');
          toast({
            title: "Error",
            description: "Failed to check security settings",
            variant: "destructive",
          });
          return;
        }

        // Check if user has verified TOTP factors
        const verifiedTotpFactors = mfaData?.totp?.filter(factor => factor.status === 'verified') || [];
        
        if (verifiedTotpFactors.length > 0) {
          console.log('User has MFA enabled, creating challenge');
          
          // Create challenge for MFA while user is authenticated
          const mfaFactor = verifiedTotpFactors[0];
          const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
            factorId: mfaFactor.id
          });
          
          if (challengeError) {
            console.error('Error creating MFA challenge:', challengeError);
            localStorage.removeItem('mfa_verification_active');
            toast({
              title: "Error",
              description: "Failed to initiate two-factor authentication",
              variant: "destructive",
            });
            return;
          }

          if (challengeData) {
            console.log('MFA challenge created successfully');
            
            // Store MFA state in localStorage
            localStorage.setItem('mfa_challenge_id', challengeData.id);
            localStorage.setItem('mfa_factor_id', mfaFactor.id);
            
            // Set component state immediately
            setShowMFAVerification(true);
            setMfaChallengeId(challengeData.id);
            setMfaFactorId(mfaFactor.id);
            
            toast({
              title: "Two-Factor Authentication Required",
              description: "Please enter your authenticator code to complete sign in",
            });
            
            // Stop all further processing
            return;
          }
        } else {
          // No MFA configured - clear the checking state and allow normal sign in
          console.log('No MFA required, sign in complete');
          localStorage.removeItem('mfa_verification_active');
          toast({
            title: "Success",
            description: "Signed in successfully!",
          });
        }
      }
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      localStorage.removeItem('mfa_verification_active');
      toast({
        title: "Error",
        description: "An unexpected error occurred during sign in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMFASuccess = () => {
    // Clear MFA state from localStorage
    localStorage.removeItem('mfa_verification_active');
    localStorage.removeItem('mfa_challenge_id');
    localStorage.removeItem('mfa_factor_id');
    
    setShowMFAVerification(false);
    navigate("/");
  };

  const handleMFABack = () => {
    // Clear MFA state from localStorage
    localStorage.removeItem('mfa_verification_active');
    localStorage.removeItem('mfa_challenge_id');
    localStorage.removeItem('mfa_factor_id');
    
    setShowMFAVerification(false);
    setMfaChallengeId('');
    setMfaFactorId('');
  };

  // Show MFA verification if needed
  console.log('Rendering Auth component. showMFAVerification:', showMFAVerification, 'challengeId:', mfaChallengeId, 'factorId:', mfaFactorId);
  
  if (showMFAVerification) {
    console.log('Rendering MFA verification screen');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <MFAVerification
          onSuccess={handleMFASuccess}
          onBack={handleMFABack}
          challengeId={mfaChallengeId}
          factorId={mfaFactorId}
        />
      </div>
    );
  }

  console.log('Rendering normal auth form');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`.trim()
          }
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Account created! Please check your email to verify your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Image and Branding */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${authBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-accent/80"></div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Back to Website Link */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to website</span>
          </Link>
          
          {/* Logo and Branding */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Mic className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  LegacyVoice AI
                </h1>
                <p className="text-white/70 text-sm">Preserving Stories, Creating Legacies</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">
                Capture Memories,<br />
                Share Wisdom
              </h2>
              <p className="text-white/80 text-lg max-w-md">
                Let our AI interviewer guide you through preserving your most precious stories 
                and life experiences for future generations.
              </p>
            </div>
          </div>
          
          {/* Bottom decorative elements */}
          <div className="flex space-x-2">
            <div className="w-12 h-1 bg-white rounded-full"></div>
            <div className="w-6 h-1 bg-white/50 rounded-full"></div>
            <div className="w-6 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Mic className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                LegacyVoice AI
              </span>
            </div>
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to website</span>
            </Link>
          </div>

          {/* Auth Form */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {isSignUp ? "Create an account" : "Welcome back"}
              </h1>
              <p className="text-muted-foreground">
                {isSignUp 
                  ? "Start preserving your stories today" 
                  : "Continue your legacy journey"
                }
              </p>
            </div>

            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">First name</Label>
                    <Input 
                      id="firstName"
                      placeholder="Enter first name"
                      className="h-12"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required={isSignUp}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">Last name</Label>
                    <Input 
                      id="lastName"
                      placeholder="Enter last name"
                      className="h-12"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required={isSignUp}
                      disabled={loading}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Enter your email"
                  className="h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isSignUp ? "Enter your password (min 6 characters)" : "Enter your password"}
                    className="h-12 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" className="border-muted-foreground" />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the <span className="text-primary hover:underline cursor-pointer">Terms & Conditions</span>
                  </label>
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" className="border-muted-foreground" />
                    <label htmlFor="remember" className="text-muted-foreground">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-primary text-white hover:opacity-90 transition-opacity shadow-glow"
                disabled={loading}
              >
                {loading 
                  ? (isSignUp ? "Creating account..." : "Signing in...") 
                  : (isSignUp ? "Create account" : "Sign in")
                }
              </Button>
            </form>
            
            <div className="space-y-4">
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or register with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="ml-2">Google</span>
                </Button>
                
                <Button variant="outline" className="h-12">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-.99 3.902-.99.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.966 4.475z"/>
                  </svg>
                  <span className="ml-2">Apple</span>
                </Button>
              </div>
            </div>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isSignUp ? "Already have an account? " : "New to LegacyVoice AI? "}
              </span>
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? "Sign in" : "Create an account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;