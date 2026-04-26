import { useEffect, useState } from "react";
import api from "../../api/api";
import Skeleton from "../../components/Skeleton";
import AdminLayout from "../../components/layouts/AdminLayout";

export default function SkillManage() {
  const [mainTab, setMainTab] = useState("skills");
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("skill");
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

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  async function fetchSkills() {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (activeFilter !== "all") params.is_active = activeFilter;

    api.get("/admin/skills", { params }).then((res) => {
      setSkills(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  async function fetchCategories() {
    setLoading(true);
    api.get("/admin/skill-categories").then((res) => {
      setCategories(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  async function handleDeleteSkill(skillId) {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      api.delete(`/admin/skills/${skillId}`).then(() => fetchSkills());
    }
  }

  async function handleDeleteCategory(categoryId) {
    if (window.confirm("Are you sure you want to delete this category?")) {
      api.delete(`/admin/skill-categories/${categoryId}`).then(() => fetchCategories());
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
        setCategoryForm({ name: item.name, slug: item.slug });
      } else {
        setCategoryForm({ name: "", slug: "" });
      }
    }
    setIsModalOpen(true);
  }

  async function handleSubmit() {
    const url = modalType === "skill"
      ? editingItem ? `/admin/skills/${editingItem.id}` : "/admin/skills"
      : editingItem ? `/admin/skill-categories/${editingItem.id}` : "/admin/skill-categories";

    const data = modalType === "skill" ? skillForm : categoryForm;
    const method = editingItem ? "put" : "post";

    try {
      await api[method](url, data);
      setIsModalOpen(false);
      if (modalType === "skill") fetchSkills();
      else fetchCategories();
    } catch (err) {
      alert("Something went wrong. Please check your inputs.");
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

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <AdminLayout>
      <header className="sticky top-0 z-10 py-4 px-4 md:px-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined font-bold text-2xl">{mainTab === "skills" ? "psychology" : "category"}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight uppercase tracking-widest text-[10px]">Skill Central</h1>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal(mainTab === "skills" ? "skill" : "category")}
            className="flex items-center gap-2 px-2 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all text-sm"
          >
            <span className="material-symbols-outlined font-bold text-sm">add</span>
            New {mainTab === "skills" ? "Skill" : "Category"}
          </button>
        </div>

        <div className={`flex gap-8 border-b border-slate-100 dark:border-slate-800 ${mainTab === 'skills' ? 'pb-0' : 'pb-0'}`}>
          {['skills', 'categories'].map(tab => (
            <button
              key={tab}
              onClick={() => setMainTab(tab)}
              className={`pb-3 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${mainTab === tab ? "text-primary" : "text-slate-400"}`}
            >
              {tab}
              {mainTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>}
            </button>
          ))}
        </div>

        {mainTab === "skills" && (
          <div className="flex items-center gap-2 mt-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
              />
            </div>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="py-2 pl-3 pr-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-600 dark:text-slate-300"
            >
              <option value="all">All Status</option>
              <option value="1">Active Only</option>
              <option value="0">Inactive Only</option>
            </select>
          </div>
        )}
      </header>

      <div className="flex-1 pb-28 pt-8 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm"><Skeleton variant="text" className="h-4 w-20 mb-4" /><Skeleton variant="text" className="h-6 w-3/4 mb-4" /><Skeleton variant="text" className="h-4 w-1/2" /></div>
            ))
          ) : mainTab === "skills" ? (
            skills.length > 0 ? skills.map(skill => <SkillCard key={skill.id} skill={skill} onEdit={() => handleOpenModal("skill", skill)} onDelete={handleDeleteSkill} />) : <div className="col-span-full"><EmptyState message="No skills found" /></div>
          ) : (
            categories.length > 0 ? categories.map(cat => <CategoryCard key={cat.id} category={cat} onEdit={() => handleOpenModal("category", cat)} onDelete={handleDeleteCategory} />) : <div className="col-span-full"><EmptyState message="No categories found" /></div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{editingItem ? "Edit" : "Add New"} {modalType}</h2>
                <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">close</span></button>
              </div>

              <div className="space-y-5">
                {modalType === "skill" && (
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Category</label>
                    <select
                      value={skillForm.skill_category_id}
                      onChange={(e) => setSkillForm({ ...skillForm, skill_category_id: e.target.value })}
                      className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 text-sm font-bold focus:border-primary focus:outline-none transition-all"
                    >
                      {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Name</label>
                  <input
                    type="text"
                    value={modalType === "skill" ? skillForm.name : categoryForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
                      if (modalType === "skill") setSkillForm({ ...skillForm, name, slug });
                      else setCategoryForm({ ...categoryForm, name, slug });
                    }}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 text-sm font-bold focus:border-primary focus:outline-none transition-all"
                    placeholder="Enter name..."
                  />
                </div>
                {modalType === "skill" && (
                  <>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Description</label>
                      <textarea
                        value={skillForm.description}
                        onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                        rows="2"
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 text-sm font-bold focus:border-primary focus:outline-none transition-all resize-none"
                        placeholder="Enter description..."
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Active Status</p>
                        <p className="text-[10px] text-slate-500">Determines if the skill is visible</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={skillForm.is_active} onChange={(e) => setSkillForm({ ...skillForm, is_active: e.target.checked })} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-sm font-black uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-2xl">Cancel</button>
                <button onClick={handleSubmit} className="flex-1 py-4 text-sm font-black uppercase tracking-widest text-white bg-primary rounded-2xl shadow-xl shadow-primary/20">{editingItem ? "Save" : "Create Now"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function SkillCard({ skill, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-slate-950 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:shadow-xl transition-all group">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-black px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-[0.1em] border border-primary/10">{skill.category || "General"}</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 group-hover:text-primary transition-colors truncate">{skill.name}</h3>
          <p className="text-xs text-slate-500 mt-2 font-medium">{skill.roadmaps_used || 0} Roadmaps active</p>
        </div>
        <div className="flex flex-col items-end gap-3 shrink-0">
          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${skill.is_active ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30" : "bg-slate-100 text-slate-400"}`}>{skill.is_active ? "Active" : "Inactive"}</span>
          <div className="flex gap-2">
            <button onClick={onEdit} className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all"><span className="material-symbols-outlined text-[20px]">edit</span></button>
            <button onClick={() => onDelete(skill.id)} className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"><span className="material-symbols-outlined text-[20px]">delete</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-slate-950 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:shadow-xl transition-all group">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">{category.name}</h3>
          <p className="text-xs font-black text-primary/60 uppercase tracking-widest mt-2">{category.skills_count || 0} Skills</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all"><span className="material-symbols-outlined text-[20px]">edit</span></button>
          <button onClick={() => onDelete(category.id)} className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"><span className="material-symbols-outlined text-[20px]">delete</span></button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-20 bg-white dark:bg-slate-950 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10">
      <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300"><span className="material-symbols-outlined text-4xl">inventory_2</span></div>
      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{message}</p>
    </div>
  );
}
