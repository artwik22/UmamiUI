"use client";

import { useAuth } from "@/lib/auth";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-600 transition-all duration-200"
      title="Logout"
    >
      <ArrowRightOnRectangleIcon className="w-5 h-5 text-[var(--text-secondary)]" />
    </button>
  );
}
