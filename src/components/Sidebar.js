"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav } from "react-bootstrap";
import {
  Speedometer2,
  People,
  GraphUp,
  Gear,
  ShieldLock,
} from "react-bootstrap-icons";
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-dark h-100">
      <div className="d-flex align-items-center gap-2 mb-4 py-3 px-2 border-bottom border-secondary">
        <ShieldLock size={22} className="text-primary" />
        <h5 className="fw-bold m-0 tracking-wide">CORE CONSOLE</h5>
      </div>
      <Nav className="flex-column gap-2 flex-grow-1">
        <Link href="/">
          <Speedometer2 size={18} />
          <span>Dashboard</span>
        </Link>
        <Link href="user">
          <People size={18} /> <span>User Directory</span>
        </Link>
        <Link href="subscription">
          <GraphUp size={18} /> <span>Subscription</span>
        </Link>
      </Nav>
    </div>
  );
}
