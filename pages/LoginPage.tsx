import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [unverifiedUserEmail, setUnverifiedUserEmail] = useState<string | null>(null);
  const { login, isAuthenticated, user, users, verifyUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === UserRole.ADMIN) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUnverifiedUserEmail(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    try {
        login(email, password);
        // The useEffect will now handle the redirect after state is updated.
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
            if (err.message.includes('Email not verified')) {
                setUnverifiedUserEmail(email);
            }
        } else {
            setError('Invalid credentials. Please try again.');
        }
    }
  };

  const handleVerify = () => {
      const userToVerify = users.find(u => u.email.toLowerCase() === unverifiedUserEmail?.toLowerCase());
      if (userToVerify) {
          verifyUser(userToVerify.id);
          setError(''); // Clear previous error
          alert('Email verified successfully! You can now log in.');
          setUnverifiedUserEmail(null);
      }
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-neutral dark:text-white mb-6">Login to Your Account</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-neutral-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-neutral-800 dark:text-white"
              placeholder="student@example.com or admin email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-neutral-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-neutral-800 dark:text-white"
              placeholder="Enter password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign in
            </button>
          </div>
        </form>
         {unverifiedUserEmail && (
            <div className="mt-4 text-center">
                 <button onClick={handleVerify} className="w-full text-sm font-medium text-white bg-secondary hover:bg-emerald-700 py-2 px-4 rounded-md">
                    Verify Now (Demo)
                 </button>
            </div>
        )}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Not a member?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-indigo-700">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;