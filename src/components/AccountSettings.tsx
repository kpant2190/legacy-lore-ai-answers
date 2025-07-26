import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, Settings, Trash2, UserX } from 'lucide-react';
import { MFASetup } from './MFASetup';
import { useMFA } from '@/hooks/useMFA';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function AccountSettings() {
  const [showMFASetup, setShowMFASetup] = useState(false);
  const { hasMFA, mfaFactors, disableMFA, checkMFAStatus } = useMFA();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEnableMFA = () => {
    setShowMFASetup(true);
  };

  const handleMFASetupComplete = () => {
    setShowMFASetup(false);
    checkMFAStatus();
    toast({
      title: 'Success',
      description: '2FA has been enabled for your account',
    });
  };

  const handleMFASetupCancel = () => {
    setShowMFASetup(false);
  };

  const handleDisableMFA = async () => {
    if (mfaFactors.length > 0) {
      const result = await disableMFA(mfaFactors[0].id);
      if (result.success) {
        toast({
          title: 'Success',
          description: '2FA has been disabled for your account',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to disable 2FA. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Delete the user account
      const { error } = await supabase.auth.admin.deleteUser(user?.id || '');
      
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete account. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted.',
      });

      // Sign out and redirect to home
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Delete account error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while deleting your account.',
        variant: 'destructive',
      });
    }
  };

  if (showMFASetup) {
    return (
      <div className="container mx-auto max-w-2xl p-6">
        <MFASetup
          onComplete={handleMFASetupComplete}
          onCancel={handleMFASetupCancel}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Account Settings</h1>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security</span>
          </CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                hasMFA ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
              }`}>
                {hasMFA ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <Shield className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={hasMFA ? 'default' : 'secondary'}>
                    {hasMFA ? 'Enabled' : 'Disabled'}
                  </Badge>
                  {hasMFA && (
                    <Badge variant="outline" className="text-xs">
                      TOTP
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {hasMFA ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Disable
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Disable Two-Factor Authentication</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to disable 2FA? This will make your account less secure.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDisableMFA}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Disable 2FA
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button onClick={handleEnableMFA} size="sm">
                  Enable 2FA
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <UserX className="w-5 h-5" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-destructive">Delete Account</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete:
                      <br /><br />
                      • All your interview recordings and stories
                      <br />
                      • Your account settings and preferences
                      <br />
                      • All associated data
                      <br /><br />
                      This action is permanent and cannot be reversed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, Delete My Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}