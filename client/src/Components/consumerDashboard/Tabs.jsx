// src/components/common/Tabs.jsx
import React, { useMemo, useRef, useEffect, useCallback } from "react";
import { LayoutDashboard, Package, Heart } from "lucide-react";

/**
 * Tabs
 *
 * Props:
 * - activeTab: string (currently active tab key)
 * - setActiveTab: function (tabKey) => void
 * - tabs: optional array [{ key, label, icon }] to override defaults
 * - counts: optional object { tabKey: number } to show small badges
 *
 * Example usage:
 * <Tabs activeTab={activeTab} setActiveTab={setActiveTab} counts={{ orders: 3 }} />
 */
export default function Tabs({
  activeTab,
  setActiveTab,
  tabs: customTabs = null,
  counts = {}
}) {
  // default tabs (keeps icons small to match style)
  const defaultTabs = useMemo(
    () => [
      { key: "overview", label: "Overview", icon: <LayoutDashboard size={16} aria-hidden /> },
      { key: "orders", label: "Orders", icon: <Package size={16} aria-hidden /> },
      { key: "favorites", label: "Favorites", icon: <Heart size={16} aria-hidden /> }
    ],
    []
  );

  const tabs = customTabs && Array.isArray(customTabs) && customTabs.length ? customTabs : defaultTabs;

  // refs for focus management
  const tabRefs = useRef([]);
  tabRefs.current = tabs.map((_, i) => tabRefs.current[i] ?? React.createRef());

  // focus active tab on mount / when activeTab changes
  useEffect(() => {
    const idx = tabs.findIndex((t) => t.key === activeTab);
    if (idx >= 0 && tabRefs.current[idx] && tabRefs.current[idx].current) {
      tabRefs.current[idx].current.setAttribute("tabindex", "0");
    }
    // set other tabs to -1 for accessibility (only active is in tab order)
    tabs.forEach((t, i) => {
      if (i !== idx && tabRefs.current[i] && tabRefs.current[i].current) {
        tabRefs.current[i].current.setAttribute("tabindex", "-1");
      }
    });
  }, [activeTab, tabs]);

  const focusTabAt = useCallback((index) => {
    const r = tabRefs.current[index];
    if (r && r.current) {
      r.current.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (e, index) => {
      const last = tabs.length - 1;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = index === last ? 0 : index + 1;
        focusTabAt(next);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = index === 0 ? last : index - 1;
        focusTabAt(prev);
      } else if (e.key === "Home") {
        e.preventDefault();
        focusTabAt(0);
      } else if (e.key === "End") {
        e.preventDefault();
        focusTabAt(last);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const key = tabs[index].key;
        setActiveTab(key);
      }
    },
    [tabs, focusTabAt, setActiveTab]
  );

  const onClick = useCallback(
    (key, idx) => {
      setActiveTab(key);
      // ensure clicked tab becomes focusable
      const r = tabRefs.current[idx];
      if (r && r.current) r.current.focus();
    },
    [setActiveTab]
  );

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className="flex border-b bg-white overflow-x-auto no-scrollbar sm:justify-start"
    >
      {tabs.map((tab, i) => {
        const isActive = activeTab === tab.key;
        const badge = counts?.[tab.key];
        return (
          <button
            key={tab.key}
            ref={(el) => {
              tabRefs.current[i] = { current: el };
            }}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.key}`}
            id={`tab-${tab.key}`}
            onClick={() => onClick(tab.key, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            tabIndex={isActive ? 0 : -1}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
              isActive
                ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.icon}
            <span className="leading-none">{tab.label}</span>

            {/* optional small badge */}
            {typeof badge === "number" && badge > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                {badge > 99 ? "99+" : badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
