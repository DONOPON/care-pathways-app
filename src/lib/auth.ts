import { useEffect, useState, useCallback } from "react";
import { storage, seedIfEmpty } from "./storage";
import type { User } from "./types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedIfEmpty();
    const id = storage.getSession();
    if (id) {
      const u = storage.getUsers().find((x) => x.id === id) ?? null;
      setUser(u);
    }
    setReady(true);
  }, []);

  const login = useCallback((email: string, password: string): User | null => {
    seedIfEmpty();
    const found = storage
      .getUsers()
      .find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) {
      storage.setSession(found.id);
      setUser(found);
      return found;
    }
    return null;
  }, []);

  const register = useCallback((data: Omit<User, "id">): User | null => {
    seedIfEmpty();
    const users = storage.getUsers();
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) return null;
    const newUser: User = { ...data, id: `u-${Date.now()}` };
    users.push(newUser);
    storage.setUsers(users);
    storage.setSession(newUser.id);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    storage.setSession(null);
    setUser(null);
  }, []);

  return { user, ready, login, register, logout };
}
