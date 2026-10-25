import React from "react";

// Minimal UI kit — Button, Card, Badge, Spinner, Input, EmptyState, PageHeader, Alert, toast

export function Button({ children, onClick, disabled, variant = "primary", className = "" }) {
  const base = "px-4 py-2 rounded font-medium transition-colors focus:outline-none";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };
  return (
    <button className={`${base} ${styles[variant] || styles.primary} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-lg shadow p-4 ${className}`}>{children}</div>;
}

export function Badge({ children, color = "blue", className = "" }) {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    gray: "bg-gray-100 text-gray-800",
    yellow: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.blue} ${className}`}>
      {children}
    </span>
  );
}

export function Spinner({ className = "" }) {
  return (
    <svg className={`animate-spin h-5 w-5 text-blue-600 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

export function Input({ value, onChange, placeholder, type = "text", className = "", disabled }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${className}`}
    />
  );
}

export function EmptyState({ title = "Nothing here", description = "", action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-3">📭</div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {description && <p className="text-gray-500 mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      {children}
    </div>
  );
}

export function Alert({ children, type = "info", className = "" }) {
  const styles = {
    info: "bg-blue-50 border-blue-300 text-blue-800",
    success: "bg-green-50 border-green-300 text-green-800",
    warning: "bg-yellow-50 border-yellow-300 text-yellow-800",
    error: "bg-red-50 border-red-300 text-red-800",
  };
  return (
    <div className={`border rounded p-3 ${styles[type] || styles.info} ${className}`}>{children}</div>
  );
}

// Simple toast (renders nothing, just console.logs)
export const toast = {
  success: (msg) => console.log("[toast:success]", msg),
  error: (msg) => console.error("[toast:error]", msg),
  info: (msg) => console.log("[toast:info]", msg),
  warning: (msg) => console.warn("[toast:warning]", msg),
};

