"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (login(username, password)) {
      router.push("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="w-full max-w-sm p-8 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            Enter your credentials to access the dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
