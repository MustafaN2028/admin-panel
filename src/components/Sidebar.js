"use client";
import Link from "next/link";
import { memo } from "react";
import { Nav } from "react-bootstrap";
import {
  Speedometer2,
  People,
  GraphUp,
  ShieldLock,
} from "react-bootstrap-icons";

function Sidebar({ isOpen, onNavigate }) {
  return (
    <div className="bg-dark min-vh-100">
      <div className="d-flex align-items-center gap-2 mb-4 py-3 px-2 border-bottom border-secondary">
        <ShieldLock size={22} className="text-primary" />
      </div>
      <Nav className="flex-column gap-2 flex-grow-1">
        {/* Dashboard Link Layout */}
        <Link
          href="/"
          onClick={onNavigate} // Closes mobile panel naturally when link is clicked
          className={`text-white p-2 d-flex align-items-center gap-3 rounded-2 text-decoration-none ${
            isOpen
              ? "justify-content-start w-100 px-3"
              : "justify-content-center px-0"
          }`}
        >
          <Speedometer2 size={18} />
          {isOpen && <span className="ms-1">Dashboard</span>}
        </Link>

        {/* User Directory Link Layout */}
        <Link
          href="/user"
          onClick={onNavigate}
          className={`text-white p-2 d-flex align-items-center gap-3 rounded-2 text-decoration-none ${
            isOpen
              ? "justify-content-start w-100 px-3"
              : "justify-content-center px-0"
          }`}
        >
          <People size={18} />
          {isOpen && <span className="ms-1">User Directory</span>}
        </Link>

        {/* Subscription Link Layout */}
        <Link
          href="/subscription"
          onClick={onNavigate}
          className={`text-white p-2 d-flex align-items-center gap-3 rounded-2 text-decoration-none ${
            isOpen
              ? "justify-content-start w-100 px-3"
              : "justify-content-center px-0"
          }`}
        >
          <GraphUp size={18} />
          {isOpen && <span className="ms-1">Subscription</span>}
        </Link>
      </Nav>
    </div>
  );
}

export default memo(Sidebar);
