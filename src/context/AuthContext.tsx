"use client";

import {
  useMemo,
  useCallback,
  createContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { IUser } from "@/graphql/types";

interface IAuthContextValue {
  currentUser: IUser | null;
  login: (user: IUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "taskflow-user";
let sessionSnapshot: string | null = null;
const subscribers = new Set<() => void>();

const getSessionSnapshot = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    sessionSnapshot = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return sessionSnapshot;
  }
  return sessionSnapshot;
};

const subscribeToSession = (callback: () => void): (() => void) => {
  subscribers.add(callback);
  window.addEventListener("storage", callback);

  return () => {
    subscribers.delete(callback);
    window.removeEventListener("storage", callback);
  };
};

const getServerSessionSnapshot = (): string | null => {
  return null;
};

const parseUser = (snapshot: string | null): IUser | null => {
  if (!snapshot) return null;

  try {
    const user: unknown = JSON.parse(snapshot);
    if (
      typeof user === "object" &&
      user !== null &&
      "id" in user &&
      typeof user.id === "string" &&
      "name" in user &&
      typeof user.name === "string" &&
      "username" in user &&
      typeof user.username === "string" &&
      "email" in user &&
      typeof user.email === "string"
    ) {
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      };
    }
  } catch {
    return null;
  }

  return null;
};

const saveSession = (user: IUser | null): void => {
  sessionSnapshot = user ? JSON.stringify(user) : null;

  try {
    if (sessionSnapshot) {
      window.localStorage.setItem(STORAGE_KEY, sessionSnapshot);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Keep session state available until the page is closed.
  }

  subscribers.forEach((callback) => callback());
};

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const sessionSnapshot = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );
  const currentUser = useMemo(
    () => parseUser(sessionSnapshot),
    [sessionSnapshot],
  );
  const login = useCallback((user: IUser) => saveSession(user), []);
  const logout = useCallback(() => saveSession(null), []);

  const value = useMemo(
    () => ({ currentUser, login, logout }),
    [currentUser, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
};
