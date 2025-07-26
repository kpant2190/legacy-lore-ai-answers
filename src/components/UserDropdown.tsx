import { useState } from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

interface UserDropdownProps {
  user: any; // User object from Supabase auth
}

export function UserDropdown({ user }: UserDropdownProps) {
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  // Get user initials for fallback
  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer transition-all duration-300 hover:scale-105">
          <Avatar className="w-10 h-10 border-2 border-primary/30 shadow-glow hover:border-primary/50 transition-all duration-300">
            <AvatarImage 
              src={user.user_metadata?.avatar_url} 
              alt={user.email} 
            />
            <AvatarFallback className="bg-gradient-primary text-white font-medium">
              {user.email ? getInitials(user.email) : <User className="w-5 h-5" />}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-card/95 backdrop-blur-xl border-primary/20 shadow-glow"
        sideOffset={8}
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-foreground">{user.user_metadata?.full_name || 'User'}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem 
          className="cursor-pointer text-foreground hover:bg-primary/10 focus:bg-primary/10"
        >
          <Link to="/account" className="w-full">
            My Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}