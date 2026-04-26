import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { setRole, setToken } from "../utils/uttils";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    api
      .post("/auth/register", formData)
      .then((res) => {
        setToken(res.data.token);
        setRole(res.data.user.role);
        navigate("/dashboard");
      })
      .catch((error) => {
        if (error.response) {
          setErrorMessage(error.response.data.message);
          if (error.response.status === 422) {
            setErrors(error.response.data.errors);
          }
        }
      });
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen w-full relative overflow-hidden flex flex-col md:flex-row">
      {/* Subtle Dot Background Pattern */}
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none z-0"></div>

      {/* Hero/Header Section - Left on desktop */}
      <div className="relative w-full md:w-1/2 h-[35vh] md:h-screen bg-gradient-to-br from-indigo-600 via-primary to-cyan-500 flex flex-col justify-center p-8 md:p-16 overflow-hidden z-10">
        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-48 h-48 bg-cyan-300 opacity-20 rounded-full blur-2xl"></div>

        <div className="z-10">
          <div className="flex items-center gap-2 mb-6 md:mb-8">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary font-bold shadow-lg shadow-black/10">
              <span className="material-symbols-outlined text-[24px]">
                code_blocks
              </span>
            </div>
            <span className="text-white font-black text-2xl tracking-tight">
              SkillPath
            </span>
          </div>
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight mb-4">
            Start Your <br />
            <span className="text-cyan-200">Learning Journey</span>
          </h1>
          <p className="text-white/80 text-sm md:text-lg font-medium max-w-md hidden md:block">
            Join thousands of learners building their future with AI-guided roadmaps.
          </p>
        </div>
      </div>

      {/* Register Form Section - Right on desktop */}
      <div className="flex-1 bg-white dark:bg-slate-950 z-10 flex flex-col justify-center items-center p-6 md:p-16 overflow-y-auto no-scrollbar">
        <div className="w-full max-w-md py-8">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
              Create account
            </h2>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Set up your profile to start generating roadmaps.
            </p>
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {errorMessage}
              </div>
            )}
          </div>

          <form className="space-y-5" onSubmit={handleRegister}>
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">
                    person
                  </span>
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold"
                  required
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  type="text"
                />
              </div>
              {errors["name"] && <p className="text-red-500 text-[10px] font-bold ml-1">{errors["name"]}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">
                    mail
                  </span>
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold"
                  required
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  type="email"
                />
              </div>
              {errors["email"] && <p className="text-red-500 text-[10px] font-bold ml-1">{errors["email"]}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Create Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">
                    lock
                  </span>
                </div>
                <input
                  className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold"
                  required
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {errors["password"] && <p className="text-red-500 text-[10px] font-bold ml-1">{errors["password"]}</p>}
            </div>

            {/* Confirmation Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">
                    lock_reset
                  </span>
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold"
                  required
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                />
              </div>
            </div>

            <button
              className="w-full bg-primary hover:bg-primary-dark active:scale-[0.98] text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2 mt-4"
              type="submit"
            >
              <span>Register</span>
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-bold text-slate-500">
            Already have an account?
            <Link
              to="/"
              className="text-primary hover:text-primary-dark transition-colors ms-2"
            >
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
