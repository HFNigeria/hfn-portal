import { computed, ref } from 'vue';

const getStoredValue = (key) => {
  const fromLocal = localStorage.getItem(key);
  if (fromLocal !== null) return fromLocal;
  return sessionStorage.getItem(key);
};

const getParsedValue = (key) => {
  const raw = getStoredValue(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const role = ref(getStoredValue('role') || null);
const user = ref(getParsedValue('user') || null);

export function useAuth() {
  const isAuthenticated = computed(() => !!role.value && !!user.value);

  const login = (userData, rememberMe = true) => {
    role.value = userData.role;
    user.value = userData.user;

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('role', userData.role);
    storage.setItem('user', JSON.stringify(userData.user));

    if (rememberMe) {
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('user');
    }
  };

  const logout = () => {
    role.value = null;
    user.value = null;
    ['localStorage', 'sessionStorage'].forEach((s) => {
      const store = s === 'localStorage' ? localStorage : sessionStorage;
      store.removeItem('role');
      store.removeItem('user');
      store.removeItem('token');
      store.removeItem('refresh');
    });
  };

  return { role, user, isAuthenticated, login, logout };
}
