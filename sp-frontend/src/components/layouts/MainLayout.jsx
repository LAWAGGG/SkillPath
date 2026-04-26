import Sidebar from "../Sidebar";
import BottomBar from "../BottomBar";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar - Sticky */}
      <div className="hidden md:block h-screen sticky top-0 z-50">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative bg-dots dot-pattern">
        <main className="flex-1 w-full">
          {children}
        </main>

        {/* Mobile Bottom Bar */}
        <div className="md:hidden">
          <BottomBar />
        </div>
      </div>
    </div>
  );
}
