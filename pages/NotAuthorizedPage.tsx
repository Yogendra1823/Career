import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

const NotAuthorizedPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <Card className="text-center max-w-lg">
        <div className="p-6">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-error mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          <h1 className="text-5xl font-extrabold text-error mb-4">Access Denied</h1>
          <p className="text-lg text-gray-600 mb-8">
            You do not have the necessary permissions to access this page.
          </p>
          <Link
            to="/dashboard"
            className="bg-primary text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Your Dashboard
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default NotAuthorizedPage;
