//
import { useAuthContext } from '@/context/AuthContext';

// Wrapper hook agar API tetap sama
export const useAuth = () => {
  return useAuthContext();
};
