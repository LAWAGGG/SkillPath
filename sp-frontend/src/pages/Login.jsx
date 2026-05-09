import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { setRole, setToken } from "../utils/uttils";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

 async function handleLogin(e) {
    e.preventDefault();
    api
      .post("/auth/login", {
        email,
        password,
      })
      .then((res) => {
        setToken(res.data.token);
        setRole(res.data.user.role)
        if(res.data.user.role == "user"){
          navigate("/dashboard");
        } else {
          navigate("/admin/dashboard")
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response)
          setErrorMessage(error.response.data.message);
          if (error.response.status == 422) {
            setErrors(error.response.data.errors);
          }
        } else {
          setErrorMessage("Cannot connect to server. Please check your connection.");
          console.error("Network Error:", error.message);
        }
      });
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen w-full relative overflow-hidden flex flex-col md:flex-row">
      {/* Subtle Dot Background Pattern */}
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none z-0"></div>

      {/* Hero/Header Section - Full width on mobile, half on desktop */}
      <div className="relative w-full md:w-1/2 h-[35vh] md:h-screen bg-gradient-to-br from-indigo-600 via-primary to-cyan-500 flex flex-col justify-center p-8 md:p-16 overflow-hidden z-10">
        {/* Decorative abstract shapes */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-cyan-300 opacity-20 rounded-full blur-2xl"></div>

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
            Level Up Your <br />
            <span className="text-cyan-200">Career Skills</span>
          </h1>
          <p className="text-white/80 text-sm md:text-lg font-medium max-w-md hidden md:block">
            Generate personalized learning roadmaps powered by AI and track your progress in real-time.
          </p>
        </div>
      </div>

      {/* Login Form Section - Centered on desktop right side */}
      <div className="flex-1 bg-white dark:bg-slate-950 z-10 flex flex-col justify-center items-center p-6 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
              Welcome back
            </h2>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Please enter your details to sign in.
            </p>
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {errorMessage}
              </div>
            )}
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="space-y-2">
              <label
                className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">
                    mail
                  </span>
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold"
                  id="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  type="email"
                />
              </div>
              {errors["email"] && <p className="text-red-500 text-[10px] font-bold ml-1">{errors["email"]}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label
                  className="block text-xs font-black uppercase tracking-widest text-slate-400"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">
                    lock
                  </span>
                </div>
                <input
                  className="block w-full pl-11 pr-12 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold"
                  id="password"
                  required
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
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

            <button
              className="w-full bg-primary hover:bg-primary-dark active:scale-[0.98] text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2 mt-4"
              type="submit"
            >
              <span>Log in to Account</span>
              <span className="material-symbols-outlined font-bold">
                arrow_forward
              </span>
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-bold text-slate-500">
            Don't have an account?
            <Link
              to="/register"
              className="text-primary hover:text-primary-dark transition-colors ms-2"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
