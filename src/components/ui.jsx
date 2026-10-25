import React, { useEffect } from "react";

// ── Button ─────────────────────────────────────────────────────────────────
export function Button({ children, onClick, type = "button", disabled, loading, variant = "primary", className = "" }) {
  const variantClass = {
    primary: "ui-button-primary",
    secondary: "ui-button-secondary",
    ghost: "ui-button-ghost",
    danger: "ui-button-danger",
  }[variant] || "ui-button-primary";
  return (
    <button type={type} className={`ui-button ${variantClass} ${className}`} onClick={onClick} disabled={disabled || loading}>
      {loading && <span className="ui-spinner ui-spinner-sm" aria-hidden="true" />}
      {children}
    </button>
  );
}

// ── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, variant, className = "" }) {
  const variantClass = variant === "bordered" ? "ui-card ui-card-bordered" : "ui-card";
  return <div className={`${variantClass} ${className}`}>{children}</div>;
}

// ── Badge ───────────────────────────────────────────────────────────────────
export function Badge({ children, color = "blue", variant, className = "" }) {
  const key = variant || color;
  const colorClass = {
    blue: "ui-badge-blue",
    green: "ui-badge-green",
    red: "ui-badge-red",
    gray: "ui-badge-gray",
    secondary: "ui-badge-secondary",
  }[key] || "ui-badge-gray";
  return <span className={`ui-badge ${colorClass} ${className}`}>{children}</span>;
}

// ── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ size = "md", className = "" }) {
  const sizeClass = { sm: "ui-spinner-sm", md: "", lg: "ui-spinner-lg" }[size] || "";
  return <span className={`ui-spinner ${sizeClass} ${className}`} role="status" aria-label="Loading" />;
}

// ── Input ───────────────────────────────────────────────────────────────────
export function Input({ label, value, onChange, placeholder, type = "text", className = "", disabled }) {
  return (
    <div className="ui-input-wrap">
      {label && <label className="ui-input-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`ui-input ${className}`}
      />
    </div>
  );
}

// ── EmptyState ──────────────────────────────────────────────────────────────
export function EmptyState({ title = "Nothing here", description = "", action }) {
  return (
    <div className="ui-empty">
      <div className="ui-empty-icon">📭</div>
      <p className="ui-empty-title">{title}</p>
      {description && <p className="ui-empty-desc">{description}</p>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

// ── PageHeader ──────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="ui-page-header">
      <h1>{title}</h1>
      {subtitle && <p className="ui-page-header-subtitle">{subtitle}</p>}
      {children}
    </div>
  );
}

// ── Alert ───────────────────────────────────────────────────────────────────
export function Alert({ children, type = "info", className = "" }) {
  const typeClass = {
    info: "ui-alert-info",
    success: "ui-alert-success",
    warning: "ui-alert-warning",
    error: "ui-alert-error",
  }[type] || "ui-alert-info";
  return <div className={`ui-alert ${typeClass} ${className}`}>{children}</div>;
}

// ── Toast ───────────────────────────────────────────────────────────────────
function getOrCreateRoot() {
  let root = document.getElementById("toast-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "toast-root";
    document.body.appendChild(root);
  }
  return root;
}

function showToast(message, type = "default") {
  const root = getOrCreateRoot();
  const el = document.createElement("div");
  el.className = `toast-item${type !== "default" ? " " + type : ""}`;
  el.textContent = message;
  root.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.3s";
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

export const toast = {
  success: (msg) => showToast(msg, "success"),
  error: (msg) => showToast(msg, "error"),
  info: (msg) => showToast(msg, "default"),
  warning: (msg) => showToast(msg, "default"),
};
