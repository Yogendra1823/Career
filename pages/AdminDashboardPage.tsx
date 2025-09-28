import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

const PIE_COLORS = {
    [UserRole.STUDENT]: '#4F46E5',
    [UserRole.COUNSELOR]: '#10B981',
    [UserRole.ADMIN]: '#EF4444',
};

const AdminDashboardPage: React.FC = () => {
  const { users, user: adminUser } = useAuth();

  const analytics = useMemo(() => {
    const students = users.filter(u => u.role === UserRole.STUDENT);
    const totalStudents = students.length;
    if (totalStudents === 0) {
      return {
        quizCompletionRate: 0,
        recommendationUsage: 0,
        streamData: [],
        roleData: [],
      };
    }

    const completedQuizCount = students.filter(s => s.progress?.quizCompleted).length;
    const viewedRecommendationCount = students.filter(s => (s.progress?.recommendationsViewed || 0) > 0).length;
    
    const streamCounts = students.reduce((acc, student) => {
        if(student.quizHistory && student.quizHistory.length > 0){
            const latestStream = student.quizHistory[student.quizHistory.length - 1].recommendation.recommendedStream;
            acc[latestStream] = (acc[latestStream] || 0) + 1;
        } else {
            acc['Undecided'] = (acc['Undecided'] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const streamData = Object.entries(streamCounts).map(([name, students]) => ({ name, students }));

    const roleCounts = users.reduce((acc, u) => {
        acc[u.role] = (acc[u.role] || 0) + 1;
        return acc;
    }, {} as Record<UserRole, number>);

    const roleData = Object.entries(roleCounts).map(([name, value]) => ({ name, value }));
    
    return {
      quizCompletionRate: Math.round((completedQuizCount / totalStudents) * 100),
      recommendationUsage: Math.round((viewedRecommendationCount / totalStudents) * 100),
      streamData,
      roleData,
    };
  }, [users]);
  
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
          <p className="text-4xl font-bold">{users.length.toLocaleString()}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Quiz Completion</h3>
          <p className="text-4xl font-bold">{analytics.quizCompletionRate}%</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Recommendations Viewed</h3>
          <p className="text-4xl font-bold">{analytics.recommendationUsage}%</p>
        </Card>
         <Card>
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Admin Profile</h3>
            <div className="mt-2">
                <p className="text-xl font-bold truncate">{adminUser?.name}</p>
                <p className="text-sm text-gray-500 truncate">{adminUser?.email}</p>
            </div>
         </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          <Card className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-4">Student Stream Distribution</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={analytics.streamData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)"/>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">User Role Distribution</h2>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={analytics.roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                           {analytics.roleData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name as UserRole]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
          </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">View, edit, or remove user accounts from the platform.</p>
            <Link to="/admin/users" className="inline-block bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                Go to User Management
            </Link>
        </Card>
        <Card>
            <h2 className="text-2xl font-bold mb-4">Manage Quiz</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Add, edit, or remove questions from the career quiz.</p>
            <Link to="/admin/quiz" className="inline-block bg-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-600 transition-colors">
                Edit Quiz Questions
            </Link>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;