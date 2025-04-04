
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { QrCode, ScanLine, History, LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline">Qr Scanner</span>
          </Link>
        </div>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-1 text-sm font-medium">
              
              
              
            </nav>
            
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {location.pathname !== '/login' && (
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Button>
            )}
            
            {location.pathname !== '/register' && (
              <Button 
                variant="default" 
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
