import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Layers,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isSidebarOpen }) => {
  const { logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
     ${
       isActive
         ? "bg-emerald-500 text-white"
         : "text-slate-600 hover:bg-slate-100"
     }`;

  return (
    <aside
      className={`w-64 bg-white border-r border-slate-200 flex flex-col
      ${isSidebarOpen ? "block" : "hidden"} md:block`}
    >
      {/* Logo */}
      <div className="px-6 py-5 text-lg font-bold text-emerald-600">
        AI Learning Assistant
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/documents" className={linkClass}>
          <FileText size={18} />
          Documents
        </NavLink>

        <NavLink to="/flashcards" className={linkClass}>
          <Layers size={18} />
          Flashcards
        </NavLink>

        <NavLink to="/profile" className={linkClass}>
          <User size={18} />
          Profile
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="mt-auto border-t px-4 py-4">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
