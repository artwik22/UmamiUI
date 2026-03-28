"use client";

import { useAuth } from "@/lib/auth";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--danger-subtle)] hover:text-[var(--danger)] transition-all duration-200"
      title="Logout"
    >
      <ArrowRightOnRectangleIcon className="w-5 h-5 text-[var(--text-secondary)]" />
    </button>
  );
}
