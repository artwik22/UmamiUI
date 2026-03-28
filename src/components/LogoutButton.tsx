"use client";

import { useAuth } from "@/lib/auth";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
      title="Logout"
    >
      <ArrowRightOnRectangleIcon className="w-5 h-5" />
    </button>
  );
}
