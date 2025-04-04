
import React from 'react';
import { LoginForm } from '@/components/AuthForms';
import { QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-4 border-b">
        <div className="container">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <QrCode className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">ScanShare</span>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 container flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;
