import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { setToken } from "../utils/uttils";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    api
      .post("/auth/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      .then((res) => {
        setToken(res.data.token);
        navigate("/dashboard");
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.message || "An error occurred");
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        }
      });
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden">
      {/* Subtle Dot Background Pattern */}
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none z-0"></div>

      <div className="relative flex flex-col h-full min-h-screen w-full max-w-md mx-auto bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto no-scrollbar z-10">
        {/* Hero/Header Section */}
        <div className="relative w-full h-[25vh] min-h-[200px] bg-gradient-to-br from-indigo-600 via-primary to-cyan-500 rounded-b-[2.5rem] flex flex-col justify-between p-8 overflow-hidden">
          {/* Decorative abstract shapes */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-cyan-300 opacity-20 rounded-full blur-2xl"></div>

          {/* Logo & Headline */}
          <div className="z-10 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary font-bold shadow-lg">
                <span className="material-symbols-outlined text-[20px]">
                  code_blocks
                </span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                SkillPath
              </span>
            </div>
            <h1 className="text-white text-3xl font-extrabold leading-tight tracking-tight">
              Roadmap Generator <br />
              <span className="text-cyan-200">With AI</span>
            </h1>
          </div>
        </div>

        {/* Register Form Section */}
        <div className="flex-1 px-6 pt-8 pb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Create account
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Join us to start generating your roadmaps.
            </p>
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Name Field */}
            <div className="space-y-1.5">
              <label
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                htmlFor="name"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">
                    person
                  </span>
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
                  id="name"
                  placeholder="Enter your full name"
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {errors["name"] && (
                <p className="text-red-500 text-xs mt-1">{errors["name"]}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">
                    mail
                  </span>
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
                  id="email"
                  placeholder="Enter your email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors["email"] && (
                <p className="text-red-500 text-xs mt-1">{errors["email"]}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">
                    lock
                  </span>
                </div>
                <input
                  className="block w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
                  id="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {errors["password"] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors["password"]}
                </p>
              )}
            </div>

            {/* Password Confirmation Field */}
            <div className="space-y-1.5">
              <label
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                htmlFor="password_confirmation"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">
                    lock_reset
                  </span>
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
                  id="password_confirmation"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
              </div>
            </div>

            {/* Main Action Button */}
            <button
              className="w-full bg-primary hover:bg-primary-dark active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
              type="submit"
            >
              <span>Sign up</span>
              <span className="material-symbols-outlined text-[20px]">
                person_add
              </span>
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?
            <Link
              to="/"
              className="font-bold text-primary hover:text-primary-dark transition-colors ms-1"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Bottom padding for iOS home indicator */}
        <div className="h-6"></div>
      </div>
    </div>
  );
}
