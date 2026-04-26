import { useEffect, useState } from "react";
import api from "../../api/api";
import Skeleton from "../../components/Skeleton";
import AdminLayout from "../../components/layouts/AdminLayout";

export default function UserManage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function fetchUsers() {
    setLoading(true);
    api.get("/admin/users").then((res) => {
      setUsers(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  function handleDeleteUser(userId) {
    setUserToDelete(userId);
  }

  async function confirmDeleteUser() {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/admin/users/${userToDelete}`);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user.");
    } finally {
      setIsDeleting(false);
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
    <AdminLayout>
      <header className="sticky top-0 z-10 py-4 px-4 md:px-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined font-bold text-2xl">group</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight uppercase tracking-widest text-[10px]">User Management</h1>
            </div>
          </div>
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </header>

      <div className="flex-1 pb-28 pt-8 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm"><Skeleton variant="circular" className="h-12 w-12 mb-4" /><Skeleton variant="text" className="h-5 w-3/4 mb-2" /><Skeleton variant="text" className="h-3 w-1/2" /></div>
            ))
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map(user => <UserCard key={user.id} user={user} onDelete={handleDeleteUser} />)
          ) : (
            <div className="col-span-full text-center py-20 bg-white dark:bg-slate-950 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
              <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300"><span className="material-symbols-outlined text-4xl">person_off</span></div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete User Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-300 border border-white/10">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">person_remove</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete User?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">
                This action cannot be undone. All data associated with this user will be permanently removed.
              </p>
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => setUserToDelete(null)}
                  disabled={isDeleting}
                  className="py-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  disabled={isDeleting}
                  className="py-3.5 rounded-2xl bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <><span className="material-symbols-outlined animate-spin text-[16px]">sync</span> Deleting...</>
                  ) : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function UserCard({ user, onDelete }) {
  return (
    <div className="bg-white dark:bg-slate-950 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:shadow-xl transition-all group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 min-w-0 flex-1">
          <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200 dark:border-white/5 shadow-inner">
            <span className="material-symbols-outlined text-[32px]">person</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{user.name}</h3>
            <p className="text-xs text-slate-500 truncate mb-3">{user.email}</p>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${user.role === "admin" ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400" : "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400"}`}>{user.role}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">• {user.roadmaps_count || 0} Roadmaps</span>
            </div>
          </div>
        </div>
        <button onClick={() => onDelete(user.id)} className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all shrink-0 active:scale-90" title="Delete User"><span className="material-symbols-outlined">delete</span></button>
      </div>
    </div>
  );
}
