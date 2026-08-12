import { useAuthStore } from '../../store/useAuthStore';
import SetPasswordScreen from './SetPasswordScreen';
import LoginScreen from './LoginScreen';

/**
 * Wraps the whole app. Renders:
 * - SetPasswordScreen on first run (no password saved on this device yet)
 * - LoginScreen when a password exists but this session hasn't unlocked it
 * - `children` (the real app) once unlocked
 */
export default function LoginGate({ children }) {
  const hasPassword = useAuthStore((s) => !!s.passwordHash);
  const unlocked = useAuthStore((s) => s.unlocked);

  if (!hasPassword) return <SetPasswordScreen />;
  if (!unlocked) return <LoginScreen />;
  return children;
}
