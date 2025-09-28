import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import QuizPage from './pages/QuizPage';
import CollegesPage from './pages/CollegesPage';
import RecommendationsPage from './pages/RecommendationsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import Chatbot from './components/Chatbot';
import { UserRole } from './types';
import NotAuthorizedPage from './pages/NotAuthorizedPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import QuizManagementPage from './pages/admin/QuizManagementPage';
import ApplicationTrackerPage from './pages/ApplicationTrackerPage';
import VerificationSentPage from './pages/VerificationSentPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <div className="min-h-screen flex flex-col font-sans text-neutral dark:text-gray-200">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerificationSentPage />} />
                <Route path="/not-authorized" element={<NotAuthorizedPage />} />
                
                <Route element={<ProtectedRoute allowedRoles={[UserRole.STUDENT, UserRole.ADMIN, UserRole.COUNSELOR]} />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/colleges" element={<CollegesPage />} />
                  <Route path="/recommendations" element={<RecommendationsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/applications" element={<ApplicationTrackerPage />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/users" element={<UserManagementPage />} />
                  <Route path="/admin/quiz" element={<QuizManagementPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <footer className="bg-neutral text-white text-center p-4">
              <p>&copy; 2025 AI Student Guidance Platform. All rights reserved.</p>
            </footer>
            <Chatbot />
          </div>
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;