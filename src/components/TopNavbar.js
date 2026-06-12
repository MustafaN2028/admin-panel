"use client";
import { Navbar, Nav, Dropdown, Container } from "react-bootstrap";
import { List } from "react-bootstrap-icons";
export default function TopNavbar() {
  return (
    <Navbar
      bg="white"
      className="border-bottom px-4 py-2 justify-content-between shadow-sm sticky-top"
      style={{ zIndex: 1020 }}
    >
      <div className="d-flex align-items-center gap-2">
        <List size={18} />
      </div>
    </Navbar>
  );
}
