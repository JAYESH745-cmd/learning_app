import React from "react";
import { Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div />

      <div className="flex items-center gap-5">
        <Bell className="text-slate-500 cursor-pointer" size={20} />

        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="text-sm">
            <p className="font-medium">{user?.username || "User"}</p>
            <p className="text-slate-400 text-xs">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
