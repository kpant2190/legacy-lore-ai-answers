import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useMFA() {
  const [hasMFA, setHasMFA] = useState<boolean>(false);
  const [isLoadingMFA, setIsLoadingMFA] = useState(true);
  const [mfaFactors, setMfaFactors] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkMFAStatus();
    } else {
      setHasMFA(false);
      setIsLoadingMFA(false);
      setMfaFactors([]);
    }
  }, [user]);

  const checkMFAStatus = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      if (error) {
        console.error('Error checking MFA status:', error);
        setHasMFA(false);
        setMfaFactors([]);
      } else {
        const verifiedFactors = data?.totp?.filter(factor => factor.status === 'verified') || [];
        setHasMFA(verifiedFactors.length > 0);
        setMfaFactors(verifiedFactors);
      }
    } catch (error) {
      console.error('Error checking MFA status:', error);
      setHasMFA(false);
      setMfaFactors([]);
    } finally {
      setIsLoadingMFA(false);
    }
  };

  const disableMFA = async (factorId: string) => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId: factorId
      });

      if (error) {
        throw error;
      }

      await checkMFAStatus();
      return { success: true };
    } catch (error) {
      console.error('Error disabling MFA:', error);
      return { success: false, error };
    }
  };

  return {
    hasMFA,
    isLoadingMFA,
    mfaFactors,
    checkMFAStatus,
    disableMFA
  };
}