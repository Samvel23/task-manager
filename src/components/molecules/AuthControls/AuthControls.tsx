"use client";

import { useState } from "react";

import type { IUser } from "@/graphql/types";

import styles from "./AuthControls.module.scss";

interface IAuthControlsProps {
  users: IUser[];
  currentUser: IUser | null;
  onLogin: (user: IUser) => void;
  onLogout: () => void;
  mode?: "header" | "gate";
}

export const AuthControls = ({
  users,
  currentUser,
  onLogin,
  onLogout,
  mode = "header",
}: IAuthControlsProps) => {
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ?? "");
  const selectedUser = users.find((user) => user.id === selectedUserId);

  if (currentUser) {
    return (
      <div className={styles.profile}>
        <span className={styles.avatar} aria-hidden="true">
          {currentUser.name.slice(0, 1).toUpperCase()}
        </span>
        <span className={styles.profileInfo}>
          <span className={styles.profileName}>{currentUser.name}</span>
          <span className={styles.profileEmail}>{currentUser.email}</span>
        </span>
        <button
          className={styles.logoutButton}
          type="button"
          onClick={onLogout}
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${styles.login} ${mode === "gate" ? styles.gateLogin : ""}`}
    >
      <label className={styles.srOnly} htmlFor="login-user">
        Choose a user
      </label>
      <select
        id="login-user"
        className={styles.userSelect}
        value={selectedUserId}
        onChange={(event) => setSelectedUserId(event.target.value)}
        disabled={users.length === 0}
      >
        {users.length === 0 && <option value="">No users available</option>}
        {users.map((user) => (
          <option value={user.id} key={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <button
        className={styles.loginButton}
        type="button"
        disabled={!selectedUser}
        onClick={() => {
          if (selectedUser) onLogin(selectedUser);
        }}
      >
        Log in
      </button>
    </div>
  );
}
