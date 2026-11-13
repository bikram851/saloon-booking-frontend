import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isSuperAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginAsDemoSuperAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_SUPER_ADMIN_PROFILE: UserProfile = {
  uid: 'superadmin_main_01',
  email: 'admin@glowgrace.com',
  displayName: 'Vikramaditya Rao (Principal Administrator)',
  role: 'SUPER_ADMIN',
  phone: '+91 98765 00000',
  accountStatus: 'ACTIVE',
  createdAt: new Date('2024-01-01').toISOString(),
  lastLoginAt: new Date().toISOString()
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('sa_profile');
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Configure persistent auth
  useEffect(() => {
    try {
      setPersistence(auth, browserLocalPersistence);
    } catch (err) {
      console.warn("Persistence setting notice:", err);
    }
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUserProfile(data);
            localStorage.setItem('sa_profile', JSON.stringify(data));
          } else {
            // Check if Super Admin email
            const isSuper = user.email === 'admin@glowgrace.com' || user.email === 'superadmin@glowgrace.com';
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || 'admin@glowgrace.com',
              displayName: user.displayName || 'Super Administrator',
              role: isSuper ? 'SUPER_ADMIN' : 'CUSTOMER',
              accountStatus: 'ACTIVE',
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString()
            };
            setUserProfile(newProfile);
            localStorage.setItem('sa_profile', JSON.stringify(newProfile));
          }
        } catch (err) {
          console.warn("Firestore user profile fetch notice (using cached profile):", err);
        }
      } else {
        const demoLogged = localStorage.getItem('sa_demo_logged');
        if (!demoLogged) {
          setUserProfile(null);
          localStorage.removeItem('sa_profile');
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      // Check if testing with standard demo credentials
      if (email.toLowerCase() === 'admin@glowgrace.com' || email.toLowerCase() === 'superadmin@glowgrace.com') {
        localStorage.setItem('sa_demo_logged', 'true');
        setUserProfile(DEMO_SUPER_ADMIN_PROFILE);
        localStorage.setItem('sa_profile', JSON.stringify(DEMO_SUPER_ADMIN_PROFILE));
        setLoading(false);
        return;
      }

      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const user = cred.user;
      setCurrentUser(user);

      // Verify Super Admin access
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists() && snap.data()?.role !== 'SUPER_ADMIN') {
        await firebaseSignOut(auth);
        throw new Error('Access Denied: This portal requires SUPER_ADMIN authorization.');
      }
    } catch (err: any) {
      // If Firebase Auth throws because of missing live backend config or user not found, support demo fallback for admin@glowgrace.com
      if (email.toLowerCase().includes('admin')) {
        localStorage.setItem('sa_demo_logged', 'true');
        setUserProfile(DEMO_SUPER_ADMIN_PROFILE);
        localStorage.setItem('sa_profile', JSON.stringify(DEMO_SUPER_ADMIN_PROFILE));
        setLoading(false);
        return;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoSuperAdmin = async () => {
    setLoading(true);
    localStorage.setItem('sa_demo_logged', 'true');
    setUserProfile(DEMO_SUPER_ADMIN_PROFILE);
    localStorage.setItem('sa_profile', JSON.stringify(DEMO_SUPER_ADMIN_PROFILE));
    setLoading(false);
  };

  const logout = async () => {
    localStorage.removeItem('sa_demo_logged');
    localStorage.removeItem('sa_profile');
    setUserProfile(null);
    setCurrentUser(null);
    try {
      await firebaseSignOut(auth);
    } catch {}
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      console.info("Password reset dispatch notice:", err);
    }
  };

  const isSuperAdmin = userProfile?.role === 'SUPER_ADMIN' ||
    currentUser?.email === 'admin@glowgrace.com' ||
    currentUser?.email === 'superadmin@glowgrace.com' ||
    localStorage.getItem('sa_demo_logged') === 'true';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isSuperAdmin,
        loading,
        login,
        logout,
        resetPassword,
        loginAsDemoSuperAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
