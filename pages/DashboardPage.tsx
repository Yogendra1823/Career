
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import { UserRole } from '../types';

const ProgressTracker = () => {
    const { user } = useAuth();
    const progress = user?.progress || { quizCompleted: false, collegesSearched: 0, recommendationsViewed: 0 };
    
    const progressPercentage = Math.round(
        ( (progress.quizCompleted ? 1 : 0) / 1 +
          (Math.min(progress.collegesSearched, 5) / 5) + // cap at 5 for visualization
          (Math.min(progress.recommendationsViewed, 3) / 3) // cap at 3
        ) / 3 * 100
    );

    return (
      <Card className="col-span-1 md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
        <div className="space-y-4">
            <div>
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-neutral dark:text-gray-300">Overall Journey</span>
                    <span className="text-sm font-medium text-neutral dark:text-gray-300">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                    <div className="bg-primary h-2.5 rounded-full" style={{width: `${progressPercentage}%`}}></div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                    <p className={`font-bold text-xl ${progress.quizCompleted ? 'text-success' : 'text-neutral dark:text-white'}`}>{progress.quizCompleted ? 'Complete' : 'Pending'}</p>
                    <p className="text-sm text-gray-500">Career Quiz</p>
                </div>
                <div>
                    <p className="font-bold text-xl text-neutral dark:text-white">{progress.recommendationsViewed}</p>
                    <p className="text-sm text-gray-500">Recommendations Viewed</p>
                </div>
                <div>
                    <p className="font-bold text-xl text-neutral dark:text-white">{progress.collegesSearched}</p>
                    <p className="text-sm text-gray-500">Colleges Searched</p>
                </div>
            </div>
        </div>
      </Card>
    );
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === UserRole.ADMIN) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.role === UserRole.ADMIN) {
    return null;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Welcome, {user?.name}!</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        This is your student dashboard. From here, you can start your career discovery journey or explore colleges.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <ProgressTracker />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Career Discovery Quiz</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Not sure where to start? Take our personalized quiz to find the career path that best suits your interests and skills.
            </p>
          </div>
          <Link
            to="/quiz"
            className="mt-4 self-start bg-primary text-white font-bold py-2 px-4 rounded-full hover:bg-indigo-700 transition-colors"
          >
            Take the Quiz
          </Link>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Explore Colleges</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Search for colleges and universities that offer programs aligned with your recommended career path.
            </p>
          </div>
          <Link
            to="/colleges"
            className="mt-4 self-start bg-secondary text-white font-bold py-2 px-4 rounded-full hover:bg-emerald-600 transition-colors"
          >
            Find Colleges
          </Link>
        </Card>
        
        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">View Your Recommendations</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Access your previous quiz results and AI-powered career recommendations at any time.
            </p>
          </div>
          <Link
            to="/recommendations"
            className="mt-4 self-start bg-accent text-white font-bold py-2 px-4 rounded-full hover:bg-orange-600 transition-colors"
          >
            See Recommendations
          </Link>
        </Card>
        
        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Application Tracker</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Manage and track your college applications, deadlines, and notes all in one place.
            </p>
          </div>
          <Link
            to="/applications"
            className="mt-4 self-start bg-info text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 transition-colors"
          >
            Track Applications
          </Link>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Profile</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
                Keep your personal information and preferences up to date.
            </p>
          </div>
          <Link
            to="/profile"
            className="mt-4 self-start bg-gray-700 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-600 transition-colors"
          >
            Go to Profile
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
