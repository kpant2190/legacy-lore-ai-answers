import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Shield, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MFAVerificationProps {
  onSuccess: () => void;
  onBack: () => void;
  challengeId: string;
  factorId: string;
}

export function MFAVerification({ onSuccess, onBack, challengeId, factorId }: MFAVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  // Sign out the user when MFA verification component mounts
  // This ensures they're not authenticated while entering MFA code
  useEffect(() => {
    const signOutForMFA = async () => {
      console.log('MFA Verification mounted, signing out user for MFA challenge');
      await supabase.auth.signOut();
      console.log('User signed out, ready for MFA verification');
    };
    
    signOutForMFA();
  }, []);

  const verifyMFA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter a 6-digit verification code',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      console.log('Verifying MFA with challenge ID:', challengeId, 'and code:', verificationCode);
      
      const { error } = await supabase.auth.mfa.verify({
        factorId: factorId,
        challengeId: challengeId,
        code: verificationCode
      });

      if (error) {
        console.error('MFA verification error:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      console.log('MFA verification successful - user should now be authenticated');
      
      // After successful MFA verification, the user should be automatically signed in
      // We can verify this by checking the session
      const { data: session } = await supabase.auth.getSession();
      console.log('Session after MFA verification:', session);
      
      toast({
        title: 'Success',
        description: 'Two-factor authentication successful!',
      });
      
      // Small delay to ensure session is properly set
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enter the 6-digit code from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="verificationCode">
            Verification Code
          </Label>
          <Input
            id="verificationCode"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center text-2xl tracking-widest h-14"
            maxLength={6}
            autoComplete="one-time-code"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isVerifying}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={verifyMFA}
            disabled={verificationCode.length !== 6 || isVerifying}
            className="flex-1"
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Can't access your authenticator app?{' '}
            <button className="text-primary hover:underline">
              Contact support
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}