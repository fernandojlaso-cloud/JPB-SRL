import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  KeyRound, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Briefcase,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { JpbSrlLogo } from './JpbSrlLogo';
import { UserRole } from '../types';

export const AuthScreen: React.FC = () => {
  const { login, loginWithGoogle, register, currentUser, userProfile, logout } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [requestedRole, setRequestedRole] = useState<UserRole>('administrativo');
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // If user is logged in but pending approval
  if (currentUser && userProfile?.status === 'pending') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-rose-500 selection:text-white">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center backdrop-blur-xl">
          <div className="inline-flex p-3.5 bg-amber-500/10 text-amber-400 rounded-2xl mb-4 border border-amber-500/20">
            <Clock className="h-10 w-10 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">
            Cuenta Pendiente de Aprobación
          </h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Hola <span className="font-semibold text-slate-200">{userProfile.displayName || currentUser.email}</span>. Tu cuenta ha sido autenticada con éxito. Por motivos de seguridad, todo nuevo usuario requiere <strong className="text-amber-300">autorización previa</strong> de la administración de JPB SRL antes de acceder a los datos financieros.
          </p>

          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 mb-6 text-left text-xs space-y-2.5">
            <div className="flex justify-between text-slate-400">
              <span>Usuario / Email:</span>
              <span className="font-medium text-slate-200">{currentUser.email}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Rol Solicitado:</span>
              <span className="font-semibold text-amber-400 capitalize">{userProfile.role}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Estado de Autorización:</span>
              <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                Esperando Aprobación
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-[11px] text-slate-400 mb-6 text-left leading-relaxed">
            💡 <strong>Administrador:</strong> Puedes notificar a <strong className="text-slate-200">fernandoj.laso@gmail.com</strong> para que ingrese a la pestaña <em>"Usuarios & Roles"</em>, verifique tu perfil, apruebe tu acceso y te asigne las obras correspondientes.
          </div>

          <button
            onClick={() => logout()}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition cursor-pointer border border-slate-700"
          >
            Cerrar Sesión / Cambiar de Cuenta
          </button>
        </div>
      </div>
    );
  }

  // If user is rejected or revoked
  if (currentUser && (userProfile?.status === 'rejected' || userProfile?.status === 'revoked')) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-rose-900/40 rounded-3xl p-8 shadow-2xl text-center">
          <div className="inline-flex p-3.5 bg-rose-500/10 text-rose-400 rounded-2xl mb-4 border border-rose-500/20">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">
            Acceso No Autorizado
          </h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Tu acceso al sistema no fue autorizado o ha sido revocado. Contacta al Administrador Maestro de JPB SRL (<span className="text-slate-200">fernandoj.laso@gmail.com</span>).
          </p>
          <button
            onClick={() => logout()}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition cursor-pointer border border-slate-700"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleSubmitting(true);
    try {
      await loginWithGoogle(requestedRole);
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('El inicio de sesión fue cancelado antes de completarse.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('La ventana emergente de Google fue bloqueada por el navegador. Por favor permite popups en tu navegador.');
      } else {
        setError(err.message || 'Error al iniciar sesión con Google.');
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        if (!name.trim()) throw new Error('Por favor ingresa tu nombre completo.');
        if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');
        await register(email, password, name, requestedRole);
        setRegisteredSuccess(true);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      console.error(err);
      let msg = 'Ocurrió un error al procesar la solicitud.';
      if (err.code === 'auth/operation-not-allowed') {
        msg = 'El proveedor de correo con clave no está activo. Utiliza el botón oficial de Google para autenticarte con tu cuenta.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Email o contraseña incorrectos.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Ya existe una cuenta registrada con este correo.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'El formato del correo electrónico no es válido.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-rose-500 selection:text-white">
      <div className="max-w-md w-full">
        {/* Brand Header with JPB SRL Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <JpbSrlLogo variant="auth" />
          </div>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Sistema Integral de Control Financiero de Obras & Gestión de Fondos
          </p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              <span>{isRegistering ? 'Solicitar Registro de Acceso' : 'Ingreso al Sistema'}</span>
            </h1>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
              Acceso Seguro
            </span>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {registeredSuccess && (
            <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>Registro exitoso. Tu cuenta está en espera de aprobación por la administración.</span>
            </div>
          )}

          {/* Role selector for Google or new users */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Rol / Función Solicitada:</span>
              <span className="text-[10px] text-amber-400/90 font-normal">Requiere Autorización</span>
            </label>
            <select
              value={requestedRole}
              onChange={(e) => setRequestedRole(e.target.value as UserRole)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400 transition cursor-pointer"
            >
              <option value="administrativo">💼 Administrativo (Carga de Ingresos, Egresos y Liquidaciones)</option>
              <option value="comitente">🏢 Comitente / Cliente (Solo Lectura de sus Obras Asignadas)</option>
              <option value="director">📋 Director de Proyecto (Administración y Control)</option>
            </select>
          </div>

          {/* Primary 1-Click Google Sign-In */}
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleSubmitting || isSubmitting}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl text-sm transition shadow-lg flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 ring-2 ring-white/20 active:scale-[0.99]"
            >
              {/* Google G SVG */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
              <span>
                {isGoogleSubmitting ? 'Conectando con Google...' : 'Ingresar / Solicitar Acceso con Google'}
              </span>
            </button>

            <div className="mt-3 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Control de Acceso:</strong> Todo usuario que ingrese con Google (excepto el Superadmin Maestro) queda automáticamente en estado <em>"Pendiente de Autorización"</em> hasta ser aprobado por Fernando Laso.
              </span>
            </div>

            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <span className="relative px-3 bg-slate-900 text-slate-500 text-xs uppercase tracking-wider font-medium">
                o ingresar con correo
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nombre y Apellido
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition placeholder:text-slate-600"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Correo Electrónico
                </label>
                {!isRegistering && email !== 'fernandoj.laso@gmail.com' && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('fernandoj.laso@gmail.com');
                      setError(null);
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
                  >
                    fernandoj.laso@gmail.com
                  </button>
                )}
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  {isRegistering ? 'Crear Contraseña' : 'Contraseña'}
                </label>
                {isRegistering && (
                  <span className="text-[11px] text-slate-500">Mínimo 6 caracteres</span>
                )}
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isRegistering ? 'Elige tu contraseña' : '••••••••'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full mt-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm transition border border-slate-700 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Procesando...' : isRegistering ? 'Crear Cuenta y Solicitar Aprobación' : 'Ingresar con Correo'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
                setRegisteredSuccess(false);
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium transition cursor-pointer"
            >
              {isRegistering
                ? '¿Ya tienes una cuenta aprobada? Iniciar Sesión'
                : '¿Prefieres registrarte con contraseña? Haz clic aquí'}
            </button>
          </div>
        </div>

        {/* Superadmin note */}
        <div className="mt-5 text-center">
          <p className="text-[11px] text-slate-500">
            Superadministrador Maestro: <span className="text-slate-400 font-medium">fernandoj.laso@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};
