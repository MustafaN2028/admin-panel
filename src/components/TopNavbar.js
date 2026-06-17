"use client";
import { memo } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Nav, Dropdown, Container, Button } from "react-bootstrap";
import { List, Power } from "react-bootstrap-icons";
function TopNavbar({ onToggleSidebar, isSidebarOpen }) {
  const router = useRouter();
  return (
    <Navbar
      bg="white"
      className="border-bottom px-4 py-2 justify-content-between shadow-sm sticky-top"
      style={{ zIndex: 1020 }}
    >
      <div className="d-flex justify-content-between align-items-center gap-2 w-100">
        <Button
          variant="light"
          onClick={onToggleSidebar}
          className="border shadow-sm p-2 d-flex align-items-center justify-content-center rounded-2 d-inline-block"
          style={{ width: "38px", height: "38px" }}
          title={
            isSidebarOpen ? "Hide Navigation Menu" : "Show Navigation Menu"
          }
        >
          <List size={20} />
        </Button>
        <Button
          variant="light"
          className="border shadow-sm p-2 d-flex align-items-center justify-content-center rounded-2 d-inline-block"
          style={{ width: "38px", height: "38px" }}
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        >
          <Power size={20} />
        </Button>
      </div>
    </Navbar>
  );
}
export default memo(TopNavbar);
