
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="text-center">
      <div className="bg-white dark:bg-neutral-700 rounded-lg shadow-2xl p-12 max-w-4xl mx-auto mt-8 relative">
        <h1 className="text-5xl font-extrabold text-neutral dark:text-white mb-4">Find Your Future with AI</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Our intelligent platform helps you discover the perfect career path and educational journey based on your unique personality and interests.
        </p>
        <Link
          to="/register"
          className="bg-primary text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
        >
          Get Started for Free
        </Link>
      </div>

      <div className="mt-20 grid md:grid-cols-3 gap-8 text-left">
        <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          </div>
          <h3 className="text-xl font-bold mb-2 dark:text-white">Personalized Quiz</h3>
          <p className="text-gray-600 dark:text-gray-300">Take our interactive quiz to uncover your strengths and passions.</p>
        </div>
        <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary text-white mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>
          <h3 className="text-xl font-bold mb-2 dark:text-white">AI-Powered Insights</h3>
          <p className="text-gray-600 dark:text-gray-300">Receive instant, data-driven recommendations for careers and courses.</p>
        </div>
        <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-accent text-white mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
          </div>
          <h3 className="text-xl font-bold mb-2 dark:text-white">Explore Colleges</h3>
          <p className="text-gray-600 dark:text-gray-300">Search for colleges that match your profile and are located near you.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
