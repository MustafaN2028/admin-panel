"use client";
import { memo } from "react";
import { Navbar, Nav, Dropdown, Container, Button } from "react-bootstrap";
import { List } from "react-bootstrap-icons";
function TopNavbar({ onToggleSidebar, isSidebarOpen }) {
  return (
    <Navbar
      bg="white"
      className="border-bottom px-4 py-2 justify-content-between shadow-sm sticky-top"
      style={{ zIndex: 1020 }}
    >
      <div className="d-flex align-items-center gap-2">
        <Button
          variant="light"
          onClick={onToggleSidebar}
          className="border shadow-sm p-2 d-flex align-items-center justify-content-center rounded-2"
          style={{ width: "38px", height: "38px" }}
          title={
            isSidebarOpen ? "Hide Navigation Menu" : "Show Navigation Menu"
          }
        >
          <List size={20} />
        </Button>
      </div>
    </Navbar>
  );
}
export default memo(TopNavbar);
