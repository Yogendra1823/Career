import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole, QuizResult, CollegeApplication, ApplicationStatus, LearningStyle } from '../types';

// Helper to read users from localStorage
const getUsersFromStorage = (): User[] => {
  try {
    const savedUsers = localStorage.getItem('appUsers');
    return savedUsers ? JSON.parse(savedUsers) : [];
  } catch (error) {
    console.error("Failed to parse users from localStorage", error);
    localStorage.removeItem('appUsers');
    return [];
  }
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  users: User[];
  login: (email: string, password?: string) => User;
  logout: () => void;
  register: (name: string, email: string) => User;
  updateUser: (data: Partial<User>) => void;
  addUser: (newUser: Omit<User, 'id' | 'verified'>) => void;
  editUser: (userId: string, updatedData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  verifyUser: (userId: string) => void;
  saveQuizResult: (result: QuizResult) => void;
  addApplication: (app: Omit<CollegeApplication, 'id'>) => void;
  updateApplication: (app: CollegeApplication) => void;
  deleteApplication: (appId: string) => void;
  updateProgress: (data: Partial<User['progress']>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(getUsersFromStorage);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('authUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('authUser');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('appUsers', JSON.stringify(users));
  }, [users]);
  
  const persistUser = (updatedUser: User) => {
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      return updatedUser;
  }

  const register = useCallback((name: string, email: string): User => {
    const lowercasedEmail = email.toLowerCase();
    let foundUser = users.find(u => u.email.toLowerCase() === lowercasedEmail);
    if (foundUser) {
        throw new Error("An account with this email already exists.");
    }
    const newUser: User = { 
        id: Date.now().toString(), 
        name, 
        email, 
        role: UserRole.STUDENT,
        verified: false, // Start as unverified
        progress: { quizCompleted: false, collegesSearched: 0, recommendationsViewed: 0 },
        notificationSettings: { emailOnNewRecommendation: true, emailOnApplicationDeadline: true },
        applications: [],
        quizHistory: [],
        academicGoals: '',
        learningStyle: 'Visual',
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, [users]);


  const login = useCallback((email: string, password?: string): User => {
    const lowercasedEmail = email.toLowerCase();
    
    if (lowercasedEmail === 'medarametlayogendra@gmail.com') {
      if (password === 'Sunny=2305') {
        const adminUser: User = {
          id: 'admin-special-001',
          name: 'Yogendra Medarametla',
          email: email,
          role: UserRole.ADMIN,
          verified: true,
        };
        setUser(adminUser);
        localStorage.setItem('authUser', JSON.stringify(adminUser));
        return adminUser;
      } else {
        throw new Error('Invalid credentials for admin user.');
      }
    }

    const foundUser = users.find(u => u.email.toLowerCase() === lowercasedEmail);
    if (!foundUser) {
      throw new Error('No account found with this email.');
    }
    
    // Check for verification
    if (!foundUser.verified) {
        throw new Error('Email not verified. Please check your inbox or click the verify button.');
    }

    setUser(foundUser);
    localStorage.setItem('authUser', JSON.stringify(foundUser));
    return foundUser;
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('authUser');
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const updatedUser = { ...currentUser, ...data };
      return persistUser(updatedUser);
    });
  }, []);
  
  const saveQuizResult = useCallback((result: QuizResult) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        const updatedHistory = [...(currentUser.quizHistory || []), result];
        const updatedProgress = { 
            ...(currentUser.progress || { quizCompleted: false, collegesSearched: 0, recommendationsViewed: 0 }),
            quizCompleted: true,
            recommendationsViewed: (currentUser.progress?.recommendationsViewed || 0) + 1,
        };
        const updatedUser = { ...currentUser, quizHistory: updatedHistory, progress: updatedProgress };
        return persistUser(updatedUser);
    });
  }, []);

    const updateProgress = useCallback((data: Partial<User['progress']>) => {
        setUser(currentUser => {
            if (!currentUser) return null;
            const updatedProgress = { ...currentUser.progress!, ...data };
            const updatedUser = { ...currentUser, progress: updatedProgress };
            return persistUser(updatedUser);
        });
    }, []);

  const addApplication = useCallback((app: Omit<CollegeApplication, 'id'>) => {
      setUser(currentUser => {
          if (!currentUser) return null;
          const newApp = { ...app, id: Date.now().toString() };
          const updatedApps = [...(currentUser.applications || []), newApp];
          const updatedUser = { ...currentUser, applications: updatedApps };
          return persistUser(updatedUser);
      });
  }, []);

  const updateApplication = useCallback((app: CollegeApplication) => {
      setUser(currentUser => {
          if (!currentUser) return null;
          const updatedApps = (currentUser.applications || []).map(a => a.id === app.id ? app : a);
          const updatedUser = { ...currentUser, applications: updatedApps };
          return persistUser(updatedUser);
      });
  }, []);

  const deleteApplication = useCallback((appId: string) => {
      setUser(currentUser => {
          if (!currentUser) return null;
          const updatedApps = (currentUser.applications || []).filter(a => a.id !== appId);
          const updatedUser = { ...currentUser, applications: updatedApps };
          return persistUser(updatedUser);
      });
  }, []);
  
  const addUser = useCallback((newUser: Omit<User, 'id' | 'verified'>) => {
    const userWithId: User = { 
        ...newUser, 
        id: Date.now().toString(),
        verified: true, // Admins create verified users
        progress: { quizCompleted: false, collegesSearched: 0, recommendationsViewed: 0 },
        notificationSettings: { emailOnNewRecommendation: true, emailOnApplicationDeadline: true },
        applications: [],
    };
    setUsers(prev => [...prev, userWithId]);
  }, []);
  
  const editUser = useCallback((userId: string, updatedData: Partial<User>) => {
     setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
     if(user?.id === userId) {
        setUser(prev => prev ? { ...prev, ...updatedData } : null);
     }
  }, [user]);
  
  const deleteUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const verifyUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verified: true } : u));
  }, []);


  const value = {
    isAuthenticated: !!user,
    user,
    users,
    login,
    logout,
    register,
    updateUser,
    addUser,
    editUser,
    deleteUser,
    verifyUser,
    saveQuizResult,
    addApplication,
    updateApplication,
    deleteApplication,
    updateProgress,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};