"use client";
import Link from "next/link";
import { memo } from "react";
import { usePathname } from "next/navigation";
import { Nav } from "react-bootstrap";
import {
  Speedometer2,
  People,
  GraphUp,
  Tags,
  ShieldLock,
} from "react-bootstrap-icons";

function Sidebar({ isOpen, onNavigate }) {
  const pathname = usePathname();

  const isActive = (path) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <div className="sidebar-container h-100">
      <div className="d-flex align-items-center gap-2 mb-4 py-3 px-3 border-bottom border-secondary border-opacity-25">
        <ShieldLock size={20} className="text-white" />
        {isOpen && (
          <span className="fw-bold text-white small tracking-wider text-uppercase">
            Aartava Admin
          </span>
        )}
      </div>
      <Nav className="flex-column gap-1 flex-grow-1">
        {/* Dashboard Link Layout */}
        <Link
          href="/dashboard"
          onClick={onNavigate} // Closes mobile panel naturally when link is clicked
          className={`sidebar-link ${isActive("/dashboard") ? "active" : ""} ${isOpen ? "justify-content-start px-3" : "justify-content-center px-0"
            }`}
        >
          <Speedometer2 size={16} />
          {isOpen && <span className="ms-1">Dashboard</span>}
        </Link>

        {/* User Directory Link Layout */}
        <Link
          href="/user"
          onClick={onNavigate}
          className={`sidebar-link ${isActive("/user") ? "active" : ""} ${isOpen ? "justify-content-start px-3" : "justify-content-center px-0"
            }`}
        >
          <People size={16} />
          {isOpen && <span className="ms-1">User Directory</span>}
        </Link>

        {/* Subscription Link Layout */}
        {/* <Link
          href="/subscription"
          onClick={onNavigate}
          className={`sidebar-link ${isActive("/subscription") ? "active" : ""} ${isOpen ? "justify-content-start px-3" : "justify-content-center px-0"
            }`}
        >
          <GraphUp size={16} />
          {isOpen && <span className="ms-1">Subscription</span>}
        </Link> */}

        {/* Subscription Plans Link Layout */}
        <Link
          href="/subscription-plans"
          onClick={onNavigate}
          className={`sidebar-link ${isActive("/subscription-plans") ? "active" : ""} ${isOpen ? "justify-content-start px-3" : "justify-content-center px-0"
            }`}
        >
          <Tags size={16} />
          {isOpen && <span className="ms-1">Subscription Plans</span>}
        </Link>
      </Nav>
    </div>
  );
}

export default memo(Sidebar);
