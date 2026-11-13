import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";

function Signup() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!username.trim() || !email.trim() || !password.trim()) {
      return setError("All fields are required");
    }

    if (!emailPattern.test(email)) {
      return setError("Invalid email format");
    }

    if (!passwordPattern.test(password)) {
      return setError("Password must be at least 8 characters and include letters, numbers, and a special character");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/signup",
        { username, email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("SUCCESS:", res.data);

      navigate("/login");

    } catch (err) {
      console.log("ERROR:", err.response?.data);

      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eff1ef] px-4 py-12 sm:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#224225]/[0.08] blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#c4a66a]/[0.14] blur-3xl" />

      <main className="relative w-full max-w-lg">
        <div className="mb-5 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#927444]">
            Swati Gemz
          </p>
          <h1 className="text-4xl font-normal tracking-tight text-[#17271b]" style={{ fontFamily: '"DM Serif Display", Georgia, serif' }}>
            Create your account
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#68736b]">
            Join now and start exploring our collection.
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 rounded-[28px] border border-[#e7e4dc] bg-white p-6 shadow-[0_24px_70px_rgba(30,45,33,0.10)] sm:p-9">
          <label className="block text-sm font-medium text-[#28372d]">
            Username
            <input
              type="text"
              value={username}
              placeholder="Enter your username"
              onChange={(e) => setName(e.target.value)}
              autoComplete="username"
              required
              className="mt-2.5 w-full rounded-xl border border-[#e2e4df] bg-[#fbfbf9] px-4 py-3.5 text-sm text-[#202b23] outline-none transition placeholder:text-[#929990] hover:border-[#c5cec5] focus:border-[#386855] focus:bg-white focus:ring-4 focus:ring-[#386855]/10"
            />
          </label>

          <label className="block text-sm font-medium text-[#28372d]">
            Email
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="mt-2.5 w-full rounded-xl border border-[#e2e4df] bg-[#fbfbf9] px-4 py-3.5 text-sm text-[#202b23] outline-none transition placeholder:text-[#929990] hover:border-[#c5cec5] focus:border-[#386855] focus:bg-white focus:ring-4 focus:ring-[#386855]/10"
            />
          </label>

          <label className="block text-sm font-medium text-[#28372d]">
            Password
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-[#e2e4df] bg-[#fbfbf9] px-4 py-3.5 pr-12 text-sm text-[#202b23] outline-none transition placeholder:text-[#929990] hover:border-[#c5cec5] focus:border-[#386855] focus:bg-white focus:ring-4 focus:ring-[#386855]/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-[#788179] transition hover:text-[#224225]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </label>

          <p className="rounded-xl border border-[#eee9dc] bg-[#faf8f2] px-4 py-3 text-xs leading-5 text-[#68736b]">
            Password should be at least 8 characters and include letters, numbers, and a special character.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#111111] px-4 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition duration-200 hover:bg-[#303030] hover:shadow-[0_10px_22px_rgba(0,0,0,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927444] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="pt-1 text-center text-sm text-[#68736b]">
            Already have an account?
            <Link to="/login" className="ml-1 font-semibold text-[#224225] underline decoration-[#c4a66a] decoration-1 underline-offset-4 transition hover:text-[#927444]">
              Login
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}

export default Signup;