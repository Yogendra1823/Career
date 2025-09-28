
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  const renderAvatar = () => {
    if (!user) return null;
    return (
      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center ring-2 ring-white ml-4">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className="text-sm font-medium text-white">{user.name.charAt(0).toUpperCase()}</span>
        )}
      </div>
    );
  }

  return (
    <header className="bg-neutral shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to={isAuthenticated && user?.role === UserRole.ADMIN ? '/admin' : '/dashboard'} className="text-white font-bold text-xl flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Guidance AI
            </NavLink>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {isAuthenticated && user && (
                  user.role === UserRole.ADMIN ? (
                    <>
                      <NavLink to="/admin" className={navLinkClass}>Dashboard</NavLink>
                      <NavLink to="/admin/users" className={navLinkClass}>Users</NavLink>
                      <NavLink to="/admin/quiz" className={navLinkClass}>Quiz</NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                      <NavLink to="/quiz" className={navLinkClass}>Career Quiz</NavLink>
                      <NavLink to="/colleges" className={navLinkClass}>Colleges</NavLink>
                      <NavLink to="/applications" className={navLinkClass}>Applications</NavLink>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
             <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className="flex items-center text-gray-300 hover:text-white ml-4">
                  <span>Welcome, {user?.name}</span>
                  {renderAvatar()}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="ml-4 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-2 ml-4">
                <NavLink to="/login" className="bg-primary text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Login
                </NavLink>
                <NavLink to="/register" className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition-colors">
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
