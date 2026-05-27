import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Brain, Stethoscope, MessageSquare, Calendar, User, LogOut, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <Activity size={20} /> },
    { name: 'Risk Assessment', path: '/assessment', icon: <Stethoscope size={20} /> },
    { name: 'Mental Wellness', path: '/mental', icon: <Brain size={20} /> },
    { name: 'Support Coach', path: '/support', icon: <MessageSquare size={20} /> },
    { name: 'Appointments', path: '/appointments', icon: <Calendar size={20} /> },
  ];

  return (
    <div className="w-64 h-screen fixed left-0 top-0 glass border-r border-white flex flex-col z-50">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl flex items-center justify-center text-white shadow-lg">
          <Activity size={24} />
        </div>
        <span className="text-xl font-black gradient-text tracking-tight">HealthSense AI</span>
      </div>

      <div className="flex-1 px-4 mt-6 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200/50">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Demo User</p>
            <p className="text-xs text-slate-500">Free Plan</p>
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
          <button 
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center space-x-2 text-slate-500 hover:text-slate-800 dark:hover:text-white py-2 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span className="text-sm font-medium">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 text-slate-500 hover:text-red-500 py-2 rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
            <LogOut size={16} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
