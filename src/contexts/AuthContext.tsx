import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

export const SUPERADMIN_EMAIL = 'fernandoj.laso@gmail.com';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isDirector: boolean;
  isAdministrativo: boolean;
  isComitente: boolean;
  canManageUsers: boolean;
  canManageObras: boolean;
  canCreateTransactions: boolean;
  canEditDeleteTransactions: boolean;
  canEditTransactions: boolean;
  canViewPlanDeCuentas: boolean;
  canBackup: boolean;
  canRestore: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: (requestedRole?: UserRole) => Promise<void>;
  register: (email: string, pass: string, name: string, requestedRole?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        
        // Listen to profile updates in real-time
        unsubscribeProfile = onSnapshot(userDocRef, async (snap) => {
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            // Ensure superadmin email always has superadmin role & active status
            if (user.email?.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) {
              if (data.role !== 'superadmin' || data.status !== 'active') {
                const superData: UserProfile = {
                  ...data,
                  role: 'superadmin',
                  status: 'active',
                };
                await setDoc(userDocRef, superData, { merge: true });
                setUserProfile(superData);
                setIsLoading(false);
                return;
              }
            }
            setUserProfile(data);
          } else {
            // First time login for this user: bootstrap profile
            const isSuper = user.email?.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'Usuario',
              role: isSuper ? 'superadmin' : 'comitente',
              status: isSuper ? 'active' : 'pending',
              createdAt: new Date().toISOString(),
              approvedAt: isSuper ? new Date().toISOString() : undefined,
              approvedBy: isSuper ? 'system' : undefined,
              assignedProjectIds: [],
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
          setIsLoading(false);
        }, (error) => {
          console.warn('Error fetching user profile:', error);
          setIsLoading(false);
        });
      } else {
        if (unsubscribeProfile) unsubscribeProfile();
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), pass);
  };

  const loginWithGoogle = async (requestedRole: UserRole = 'administrativo') => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      const isSuper = result.user.email?.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
      const userDocRef = doc(db, 'users', result.user.uid);
      const snap = await getDoc(userDocRef);
      if (!snap.exists()) {
        const newProfile: UserProfile = {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || result.user.email?.split('@')[0] || 'Usuario',
          role: isSuper ? 'superadmin' : requestedRole,
          status: isSuper ? 'active' : 'pending',
          createdAt: new Date().toISOString(),
          approvedAt: isSuper ? new Date().toISOString() : undefined,
          approvedBy: isSuper ? 'system' : undefined,
          assignedProjectIds: [],
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      }
    }
  };

  const register = async (email: string, pass: string, name: string, requestedRole: UserRole = 'administrativo') => {
    const userCred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (userCred.user) {
      await updateProfile(userCred.user, { displayName: name });
      const isSuper = email.trim().toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
      const profile: UserProfile = {
        uid: userCred.user.uid,
        email: email.trim().toLowerCase(),
        displayName: name,
        role: isSuper ? 'superadmin' : requestedRole,
        status: isSuper ? 'active' : 'pending',
        createdAt: new Date().toISOString(),
        approvedAt: isSuper ? new Date().toISOString() : undefined,
        approvedBy: isSuper ? 'system' : undefined,
        assignedProjectIds: [],
      };
      await setDoc(doc(db, 'users', userCred.user.uid), profile);
      setUserProfile(profile);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  // Helper flags
  const isSuperAdmin = userProfile?.role === 'superadmin' || currentUser?.email?.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
  const isDirector = isSuperAdmin || userProfile?.role === 'director';
  const isAdministrativo = userProfile?.role === 'administrativo';
  const isComitente = userProfile?.role === 'comitente';

  // Permission checks
  const canManageUsers = isSuperAdmin || isDirector; // Director can approve subordinate staff (administrativo, comitente)
  const canManageObras = isSuperAdmin || isDirector;
  const canCreateTransactions = isSuperAdmin || isDirector || isAdministrativo;
  const canEditDeleteTransactions = isSuperAdmin || isDirector; // Únicamente el Director de Proyecto o Superadmin puede corregir o eliminar asientos
  const canEditTransactions = canCreateTransactions;
  const canViewPlanDeCuentas = isSuperAdmin || isDirector || isAdministrativo; // Oculto para comitente
  const canBackup = isSuperAdmin || isDirector;
  const canRestore = isSuperAdmin;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isLoading,
        isSuperAdmin,
        isDirector,
        isAdministrativo,
        isComitente,
        canManageUsers,
        canManageObras,
        canCreateTransactions,
        canEditDeleteTransactions,
        canEditTransactions,
        canViewPlanDeCuentas,
        canBackup,
        canRestore,
        login,
        loginWithGoogle,
        register,
        logout,
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
