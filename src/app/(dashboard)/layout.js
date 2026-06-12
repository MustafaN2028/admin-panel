import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
export default function DashboardLayout({ children }) {
  return (
    <div className="d-flex h-100">
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1">
        <TopNavbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
