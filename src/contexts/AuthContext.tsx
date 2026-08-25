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
import { doc, getDoc, setDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

export const SUPERADMIN_EMAIL = 'fernandoj.laso@gmail.com';

export interface AuthSessionUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  currentUser: AuthSessionUser | null;
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

const LOCAL_SESSION_KEY = 'jpb_auth_session_user';

// Secure SHA-256 hashing for Firestore-backed accounts
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_jpb_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getSafeAccountDocId(email: string): string {
  return email.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthSessionUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    // Check if there is a local session for custom email/password login
    const savedSessionRaw = localStorage.getItem(LOCAL_SESSION_KEY);
    let initialCustomUser: AuthSessionUser | null = null;
    if (savedSessionRaw) {
      try {
        initialCustomUser = JSON.parse(savedSessionRaw);
      } catch (e) {
        localStorage.removeItem(LOCAL_SESSION_KEY);
      }
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      const activeUser: AuthSessionUser | null = firebaseUser 
        ? { uid: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName }
        : initialCustomUser;

      setCurrentUser(activeUser);

      if (activeUser) {
        const userDocRef = doc(db, 'users', activeUser.uid);
        
        // Listen to profile updates in real-time
        unsubscribeProfile = onSnapshot(userDocRef, async (snap) => {
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            // Ensure superadmin email always has superadmin role & active status
            if (activeUser.email?.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) {
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
            const isSuper = activeUser.email?.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
            const newProfile: UserProfile = {
              uid: activeUser.uid,
              email: activeUser.email || '',
              displayName: activeUser.displayName || activeUser.email?.split('@')[0] || 'Usuario',
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
    const cleanEmail = email.trim().toLowerCase();
    
    // First, try Firebase Authentication
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, pass);
      localStorage.removeItem(LOCAL_SESSION_KEY);
      return;
    } catch (fbErr: any) {
      console.log('Firebase login fallback to Firestore accounts:', fbErr?.code);
      
      // Fallback: Check Firestore custom accounts
      const accountDocId = getSafeAccountDocId(cleanEmail);
      const accountRef = doc(db, 'auth_accounts', accountDocId);
      const accountSnap = await getDoc(accountRef);

      const enteredHash = await hashPassword(pass);

      if (accountSnap.exists()) {
        const accountData = accountSnap.data();
        if (accountData.passwordHash !== enteredHash) {
          throw new Error('Contraseña incorrecta. Por favor verifica tu clave.');
        }

        const customUser: AuthSessionUser = {
          uid: accountData.uid,
          email: accountData.email,
          displayName: accountData.name || accountData.email.split('@')[0],
        };

        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(customUser));
        setCurrentUser(customUser);

        // Fetch or create user profile
        const userDocRef = doc(db, 'users', customUser.uid);
        const profileSnap = await getDoc(userDocRef);
        const isSuper = cleanEmail === SUPERADMIN_EMAIL.toLowerCase();

        if (profileSnap.exists()) {
          const prof = profileSnap.data() as UserProfile;
          if (isSuper && (prof.role !== 'superadmin' || prof.status !== 'active')) {
            const updatedSuper: UserProfile = { ...prof, role: 'superadmin', status: 'active' };
            await setDoc(userDocRef, updatedSuper, { merge: true });
            setUserProfile(updatedSuper);
          } else {
            setUserProfile(prof);
          }
        } else {
          const newProfile: UserProfile = {
            uid: customUser.uid,
            email: cleanEmail,
            displayName: customUser.displayName || 'Usuario',
            role: isSuper ? 'superadmin' : 'administrativo',
            status: isSuper ? 'active' : 'pending',
            createdAt: new Date().toISOString(),
            approvedAt: isSuper ? new Date().toISOString() : undefined,
            approvedBy: isSuper ? 'system' : undefined,
            assignedProjectIds: [],
          };
          await setDoc(userDocRef, newProfile);
          setUserProfile(newProfile);
        }
        return;
      }

      // If user is superadmin and no account registered yet, auto-register their master password
      if (cleanEmail === SUPERADMIN_EMAIL.toLowerCase()) {
        const uid = 'superadmin_master_' + getSafeAccountDocId(cleanEmail);
        const customUser: AuthSessionUser = {
          uid,
          email: cleanEmail,
          displayName: 'Fernando Laso',
        };

        await setDoc(accountRef, {
          uid,
          email: cleanEmail,
          name: 'Fernando Laso',
          passwordHash: enteredHash,
          createdAt: new Date().toISOString(),
        });

        const superProfile: UserProfile = {
          uid,
          email: cleanEmail,
          displayName: 'Fernando Laso',
          role: 'superadmin',
          status: 'active',
          createdAt: new Date().toISOString(),
          approvedAt: new Date().toISOString(),
          approvedBy: 'system',
          assignedProjectIds: [],
        };
        await setDoc(doc(db, 'users', uid), superProfile);

        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(customUser));
        setCurrentUser(customUser);
        setUserProfile(superProfile);
        return;
      }

      // If account does not exist
      throw new Error('No se encontró una cuenta registrada con este correo. Por favor regístrate primero seleccionando "¿No tienes cuenta? Regístrate y solicita acceso".');
    }
  };

  const loginWithGoogle = async (requestedRole: UserRole = 'administrativo') => {
    localStorage.removeItem(LOCAL_SESSION_KEY);
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
    const cleanEmail = email.trim().toLowerCase();
    const isSuper = cleanEmail === SUPERADMIN_EMAIL.toLowerCase();

    // Check if account already exists in Firestore auth_accounts
    const accountDocId = getSafeAccountDocId(cleanEmail);
    const accountRef = doc(db, 'auth_accounts', accountDocId);
    const existingSnap = await getDoc(accountRef);

    if (existingSnap.exists()) {
      throw new Error('Ya existe una cuenta registrada con este correo electrónico. Por favor inicia sesión con tu contraseña.');
    }

    const passwordHash = await hashPassword(pass);
    const uid = isSuper ? 'superadmin_master_' + accountDocId : 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    // Save custom credential in Firestore
    await setDoc(accountRef, {
      uid,
      email: cleanEmail,
      name: name.trim(),
      passwordHash,
      createdAt: new Date().toISOString(),
    });

    // Save user profile in Firestore
    const profile: UserProfile = {
      uid,
      email: cleanEmail,
      displayName: name.trim(),
      role: isSuper ? 'superadmin' : requestedRole,
      status: isSuper ? 'active' : 'pending',
      createdAt: new Date().toISOString(),
      approvedAt: isSuper ? new Date().toISOString() : undefined,
      approvedBy: isSuper ? 'system' : undefined,
      assignedProjectIds: [],
    };
    await setDoc(doc(db, 'users', uid), profile);

    // Also attempt Firebase registration in background if possible
    try {
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (userCred.user) {
        await updateProfile(userCred.user, { displayName: name.trim() });
      }
    } catch (e) {
      console.log('Firebase background registration bypassed, active in Firestore.');
    }

    const customUser: AuthSessionUser = {
      uid,
      email: cleanEmail,
      displayName: name.trim(),
    };

    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(customUser));
    setCurrentUser(customUser);
    setUserProfile(profile);
  };

  const logout = async () => {
    localStorage.removeItem(LOCAL_SESSION_KEY);
    setCurrentUser(null);
    setUserProfile(null);
    try {
      await signOut(auth);
    } catch (e) {
      console.log('Signout finished.');
    }
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

