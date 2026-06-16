// src/app/(dashboard)/layout.js
"use client";
import { useState, useCallback, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";

export default function DashboardLayout({ children }) {
  // Desktop-only state tracking
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);
  console.log(sidebarOpen);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false); // Automatically close on mobile break boundaries
      } else {
        setSidebarOpen(true); // Re-open automatically on desktop viewports
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="d-flex min-vh-100 w-100 bg-light overflow-x-hidden position-relative">
      {/* DESKTOP SIDEBAR GRID PANEL:
        This panel is strictly locked to viewports >= 768px ('d-none d-md-block').
        It handles your 260px to 60px toggle requirements seamlessly.
      */}
      <div
        style={{
          width: sidebarOpen ? "260px" : "60px",
          transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
        }}
        className="bg-white border-end d-none d-md-block h-100"
      >
        <Sidebar isOpen={sidebarOpen} />
      </div>

      {/* MOBILE SIDEBAR OVERLAY PANEL:
        This panel is strictly visible on screens < 768px ('d-block d-md-none').
        It operates at 100% standard visibility, completely unaffected by the 'sidebarOpen' state!
      */}
      {sidebarOpen && (
        <div
          className="d-block d-md-none position-absolute top-0 start-0 bg-white border-end h-100 shadow-lg animate-slide-in"
          style={{ width: "260px", zIndex: 1100 }}
        >
          {/* On mobile, 'isOpen' is permanently true so text links are always fully readable */}
          <Sidebar isOpen={true} onNavigate={toggleSidebar} />
        </div>
      )}

      {/* Mobile Tint Overlay Backdrop */}
      {sidebarOpen && (
        <div
          className="d-block d-md-none position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"
          style={{ zIndex: 1050 }}
          onClick={toggleSidebar} // Clicking background closes it safely
        />
      )}

      {/* Main Content Workspace Frame */}
      <div
        className="flex-grow-1 d-flex flex-column w-100"
        style={{ minWidth: 0 }}
      >
        <TopNavbar
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={sidebarOpen}
        />

        <main className="p-4 flex-grow-1">{children}</main>
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}
