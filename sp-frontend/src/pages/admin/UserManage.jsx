import { useEffect, useState } from "react";
import AdminBottomBar from "../../components/AdminBottomBar";
import api from "../../api/api";

export default function UserManage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchUsers() {
    setLoading(true);
    api
      .get("/admin/users")
      .then((res) => {
        setUsers(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  async function handleDeleteUser(userId) {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user.");
        console.error(err);
      }
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none z-0"></div>

      <div className="relative flex flex-col h-full min-h-screen w-full max-w-md mx-auto bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto no-scrollbar z-10">
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined font-bold text-2xl">
                  group
                </span>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  User Management
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage your community
                </p>
              </div>
            </div>
          </div>

          <div className="py-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 pb-28">
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-xs font-medium text-slate-400">
                  Loading users...
                </p>
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onDelete={handleDeleteUser}
                />
              ))
            ) : (
              <div className="text-center py-20">
                <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                  <span className="material-symbols-outlined text-4xl">
                    person_off
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500">
                  No users found
                </p>
              </div>
            )}
          </div>
        </main>

        <AdminBottomBar />
      </div>
    </div>
  );
}

function UserCard({ user, onDelete }) {
  return (
    <div className="bg-white dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 min-w-0 flex-1">
          <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0 border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {user.name}
            </h3>
            <p className="text-[11px] text-slate-500 truncate mb-1">
              {user.email}
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  user.role === "admin"
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                } border border-amber-200 dark:border-amber-800/50`}
              >
                {user.role}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                • {user.roadmaps_count || 0} Roadmaps
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* Prevent deleting admins if needed, but for now we follow the user request */}
          <button
            onClick={() => onDelete(user.id)}
            className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors border border-slate-100 dark:border-slate-700"
          >
            <span className="material-symbols-outlined text-[20px]">
              delete
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
