import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';

const VerificationSentPage: React.FC = () => {
  const location = useLocation();
  const { users, verifyUser } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const email = location.state?.email || 'your email address';

  const handleVerify = () => {
    const userToVerify = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (userToVerify) {
        verifyUser(userToVerify.id);
        setIsVerified(true);
    } else {
        alert("Could not find user to verify. Please try registering again.");
    }
  };

  return (
    <div className="flex items-center justify-center py-20">
      <Card className="text-center max-w-lg">
        {isVerified ? (
          // Show success view after clicking verify
          <div className="p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-success mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-4xl font-bold text-neutral dark:text-white mb-4">Account Verified!</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Your account for <span className="font-semibold text-primary">{email}</span> has been successfully verified. You can now log in.
            </p>
            <Link
              to="/login"
              className="bg-primary text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          // Initial view
          <div className="p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-success mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h1 className="text-4xl font-bold text-neutral dark:text-white mb-4">Verify Your Email</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              We've sent a verification link to <span className="font-semibold text-primary">{email}</span>. Please check your inbox.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Since this is a demo, no email is actually sent. Click the button below to verify your account instantly.
            </p>
            <button
              onClick={handleVerify}
              className="w-full bg-secondary text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-emerald-600 transition-colors"
            >
              Verify My Account (Demo)
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VerificationSentPage;
