"use client";
import { memo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/features/authSlice";
import { Navbar, Button } from "react-bootstrap";
import { List, Power } from "react-bootstrap-icons";

function TopNavbar({ onToggleSidebar, isSidebarOpen }) {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <Navbar
      className="px-4 py-2 justify-content-between sticky-top bg-white bg-opacity-75"
      style={{
        zIndex: 1020,
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center gap-2 w-100">
        <Button
          variant="light"
          onClick={onToggleSidebar}
          className="btn-outline-secondary border p-0 d-flex align-items-center justify-content-center rounded-2"
          style={{ width: "36px", height: "36px" }}
          title={
            isSidebarOpen ? "Hide Navigation Menu" : "Show Navigation Menu"
          }
        >
          <List size={24} style={{ width: "24px", height: "24px" }} />
        </Button>
        <Button
          variant="light"
          className="btn-outline-secondary border p-0 d-flex align-items-center justify-content-center rounded-2 text-danger"
          style={{ width: "36px", height: "36px" }}
          title="Sign Out"
          onClick={() => {
            dispatch(logout());
            router.push("/login");
          }}
        >
          <Power size={24} style={{ width: "24px", height: "24px" }} />
        </Button>
      </div>
    </Navbar>
  );
}

export default memo(TopNavbar);
