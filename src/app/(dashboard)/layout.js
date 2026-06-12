"use client";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import { useCallback, useState } from "react";
export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);
  return (
    <div className="d-flex h-100">
      <div
        style={{
          width: sidebarOpen ? "260px" : "60px",
          transition: "all 0.3s ease",
          overflow: "hidden",
          position: "relative",
          zIndex: 100,
        }}
        className="bg-white border-end"
      >
        <Sidebar isOpen={sidebarOpen} />
      </div>
      <div className="d-flex flex-column flex-grow-1">
        <TopNavbar
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={sidebarOpen}
        />
        <main>{children}</main>
      </div>
    </div>
  );
}
