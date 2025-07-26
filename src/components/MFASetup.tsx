import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Shield, Smartphone, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MFASetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function MFASetup({ onComplete, onCancel }: MFASetupProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [factorId, setFactorId] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    enrollMFA();
  }, []);

  const enrollMFA = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      if (data) {
        setQrCode(data.totp.qr_code);
        setSecret(data.totp.secret);
        setFactorId(data.id);
        console.log('MFA enrollment successful, factor ID:', data.id);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to initialize MFA setup',
        variant: 'destructive',
      });
    }
  };

  const verifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter a 6-digit verification code',
        variant: 'destructive',
      });
      return;
    }

    setIsEnrolling(true);
    
    try {
      console.log('Verifying MFA with factor ID:', factorId, 'and code:', verificationCode);
      
      // For MFA setup, we need to create a challenge first, then verify
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: factorId
      });

      if (challengeError) {
        console.error('Challenge creation error:', challengeError);
        toast({
          title: 'Error',
          description: challengeError.message,
          variant: 'destructive',
        });
        return;
      }

      // Now verify the challenge with the code
      const { error } = await supabase.auth.mfa.verify({
        factorId: factorId,
        challengeId: challengeData.id,
        code: verificationCode
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: '2FA has been enabled successfully!',
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Copied',
        description: 'Secret key copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy secret key',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <CardTitle>Set up Two-Factor Authentication</CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Smartphone className="w-4 h-4" />
              <span>Step 1: Install an authenticator app</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Download Google Authenticator, Authy, or any TOTP app
            </p>
          </div>
          
          {qrCode && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">Step 2: Scan QR Code</div>
                <div className="flex justify-center">
                  <img
                    src={qrCode}
                    alt="QR Code for 2FA setup"
                    className="w-48 h-48 border rounded-lg"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Or enter this code manually:
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={secret}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copySecret}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="verificationCode">
              Step 3: Enter verification code
            </Label>
            <Input
              id="verificationCode"
              type="text"
              inputMode="numeric"
              placeholder="6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isEnrolling}
          >
            Cancel
          </Button>
          <Button
            onClick={verifyAndEnable}
            disabled={verificationCode.length !== 6 || isEnrolling}
            className="flex-1"
          >
            {isEnrolling ? 'Verifying...' : 'Enable 2FA'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}