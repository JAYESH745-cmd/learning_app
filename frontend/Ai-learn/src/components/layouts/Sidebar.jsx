import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isSidebarOpen }) => {
  const { logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-normal transition
     ${
       isActive
         ? "bg-emerald-500 text-white"
         : "text-slate-700 hover:bg-slate-50"
     }`;

  return (
    <aside
      className={`w-64 bg-white border-r border-slate-200 flex flex-col h-screen
      ${isSidebarOpen ? "block" : "hidden"} md:block`}
    >
      {/* Logo */}
      <div className="px-4 py-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
          <BookOpen className="text-white" size={24} />
        </div>
        <span className="text-lg font-semibold text-slate-800">
          AI Learning Assistant
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 pt-4 space-y-2">
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/documents" className={linkClass}>
          <FileText size={20} />
          Documents
        </NavLink>
        <NavLink to="/flashcards" className={linkClass}>
          <BookOpen size={20} />
          Flashcards
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          <User size={20} />
          Profile
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-slate-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 text-slate-600 hover:text-red-500 text-base font-normal transition w-full"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;