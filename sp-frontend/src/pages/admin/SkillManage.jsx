import { useEffect, useState } from "react";
import AdminBottomBar from "../../components/AdminBottomBar";
import api from "../../api/api";

export default function SkillManage() {
  const [mainTab, setMainTab] = useState("skills"); // 'skills' or 'categories'
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("skill"); // 'skill' or 'category'
  const [editingItem, setEditingItem] = useState(null);

  const [skillForm, setSkillForm] = useState({
    skill_category_id: "",
    name: "",
    slug: "",
    description: "",
    is_active: true,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
  });

  // Skill Filters
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  async function fetchSkills() {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (activeFilter !== "all") params.is_active = activeFilter;

    api
      .get("/admin/skills", { params })
      .then((res) => {
        setSkills(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  async function fetchCategories() {
    setLoading(true);
    api
      .get("/admin/skill-categories")
      .then((res) => {
        setCategories(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  async function handleDeleteSkill(skillId) {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      api.delete(`/admin/skills/${skillId}`).then(() => fetchSkills());
    }
  }

  async function handleDeleteCategory(categoryId) {
    if (window.confirm("Are you sure you want to delete this category?")) {
      api
        .delete(`/admin/skill-categories/${categoryId}`)
        .then(() => fetchCategories());
    }
  }

  function handleOpenModal(type, item = null) {
    setModalType(type);
    setEditingItem(item);

    if (type === "skill") {
      if (item) {
        setSkillForm({
          skill_category_id: item.skill_category_id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          is_active: item.is_active,
        });
      } else {
        setSkillForm({
          skill_category_id: categories[0]?.id || "",
          name: "",
          slug: "",
          description: "",
          is_active: true,
        });
      }
    } else {
      if (item) {
        setCategoryForm({
          name: item.name,
          slug: item.slug,
        });
      } else {
        setCategoryForm({
          name: "",
          slug: "",
        });
      }
    }
    setIsModalOpen(true);
  }

  async function handleSubmit() {
    const url =
      modalType === "skill"
        ? editingItem
          ? `/admin/skills/${editingItem.id}`
          : "/admin/skills"
        : editingItem
          ? `/admin/skill-categories/${editingItem.id}`
          : "/admin/skill-categories";

    const data = modalType === "skill" ? skillForm : categoryForm;
    const method = editingItem ? "put" : "post";

    try {
      await api[method](url, data);
      setIsModalOpen(false);
      if (modalType === "skill") fetchSkills();
      else fetchCategories();
    } catch (err) {
      alert("Something went wrong. Please check your inputs.");
      console.error(err);
    }
  }

  useEffect(() => {
    if (mainTab === "skills") {
      const timeout = setTimeout(fetchSkills, 300);
      return () => clearTimeout(timeout);
    } else {
      fetchCategories();
    }
  }, [mainTab, search, activeFilter]);

  console.log(skillForm)

  // Initial fetch for categories even if on skills tab (for dropdown)
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none z-0"></div>

      <div className="relative flex flex-col h-full min-h-screen w-full max-w-md mx-auto bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto no-scrollbar z-10">
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined font-bold text-2xl">
                  {mainTab === "skills" ? "psychology" : "category"}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Skill Central
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage skills & categories
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                handleOpenModal(mainTab === "skills" ? "skill" : "category")
              }
              className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <span className="material-symbols-outlined font-bold">add</span>
            </button>
          </div>

          {/* Main Tab Switcher */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 mb-2">
            <button
              onClick={() => setMainTab("skills")}
              className={`flex-1 py-3 text-sm font-bold transition-all relative ${
                mainTab === "skills" ? "text-primary" : "text-slate-400"
              }`}
            >
              Skills
              {mainTab === "skills" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setMainTab("categories")}
              className={`flex-1 py-3 text-sm font-bold transition-all relative ${
                mainTab === "categories" ? "text-primary" : "text-slate-400"
              }`}
            >
              Categories
              {mainTab === "categories" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
              )}
            </button>
          </div>

          {mainTab === "skills" && (
            <div className="py-2 space-y-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="flex bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-lg">
                {["all", "1", "0"].map((id) => (
                  <button
                    key={id}
                    onClick={() => setActiveFilter(id)}
                    className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${
                      activeFilter === id
                        ? "bg-white dark:bg-slate-700 shadow-sm text-primary"
                        : "text-slate-500"
                    }`}
                  >
                    {id === "all" ? "All" : id === "1" ? "Active" : "Inactive"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 p-5 pb-28">
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-xs font-medium text-slate-400">
                  Loading data...
                </p>
              </div>
            ) : mainTab === "skills" ? (
              skills.length > 0 ? (
                skills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    onEdit={() => handleOpenModal("skill", skill)}
                    onDelete={handleDeleteSkill}
                  />
                ))
              ) : (
                <EmptyState message="No skills found" />
              )
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onEdit={() => handleOpenModal("category", cat)}
                  onDelete={handleDeleteCategory}
                />
              ))
            ) : (
              <EmptyState message="No categories found" />
            )}
          </div>
        </main>

        <AdminBottomBar />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingItem ? "Edit" : "Add New"}{" "}
                  {modalType === "skill" ? "Skill" : "Category"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    close
                  </span>
                </button>
              </div>

              <div className="space-y-4">
                {modalType === "skill" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                      Category
                    </label>
                    <select
                      value={skillForm.skill_category_id}
                      onChange={(e) =>
                        setSkillForm({
                          ...skillForm,
                          skill_category_id: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={
                      modalType === "skill" ? skillForm.name : categoryForm.name
                    }
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name
                        .toLowerCase()
                        .replace(/ /g, "-")
                        .replace(/[^\w-]+/g, "");
                      if (modalType === "skill") {
                        setSkillForm({ ...skillForm, name, slug });
                      } else {
                        setCategoryForm({ ...categoryForm, name, slug });
                      }
                    }}
                    placeholder={`Enter ${modalType} name`}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={
                      modalType === "skill" ? skillForm.slug : categoryForm.slug
                    }
                    onChange={(e) => {
                      if (modalType === "skill") {
                        setSkillForm({ ...skillForm, slug: e.target.value });
                      } else {
                        setCategoryForm({
                          ...categoryForm,
                          slug: e.target.value,
                        });
                      }
                    }}
                    placeholder="example-slug"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {modalType === "skill" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                        Description
                      </label>
                      <textarea
                        value={skillForm.description}
                        onChange={(e) =>
                          setSkillForm({
                            ...skillForm,
                            description: e.target.value,
                          })
                        }
                        rows="3"
                        placeholder="Tell us about this skill..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      ></textarea>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Is Active
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Make this skill visible to users
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setSkillForm({
                            ...skillForm,
                            is_active: !skillForm.is_active,
                          })
                        }
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          skillForm.is_active
                            ? "bg-primary"
                            : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                            skillForm.is_active ? "left-7" : "left-1"
                          }`}
                        ></div>
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 text-sm font-bold text-white bg-primary rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {editingItem ? "Save Changes" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SkillCard({ skill, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {skill.category || "Uncategorized"}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
            {skill.name}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {skill.roadmaps_used || 0} Roadmaps used
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider ${
              skill.is_active
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
            }`}
          >
            {skill.is_active ? "Active" : "Inactive"}
          </span>
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                edit
              </span>
            </button>
            <button
              onClick={() => onDelete(skill.id)}
              className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                delete
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all group">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">
            Total Skills:{" "}
            <span className="text-primary/70">
              {category.skills_count || 0}
            </span>
          </p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              delete
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-20">
      <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
        <span className="material-symbols-outlined text-4xl">inventory_2</span>
      </div>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}
