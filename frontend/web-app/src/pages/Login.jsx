// frontend/web-app/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("admin@uce.edu.ec");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login/',
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Invalid credentials");

      localStorage.setItem("cap_token", data.token);
      localStorage.setItem("cap_user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">

        <div className="flex flex-col items-center mb-8">
          <div className="bg-white text-black p-3 rounded-lg mb-4">
            <Building2 size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white">CAP Platform</h1>
          <p className="text-sm text-zinc-300 mt-1">
            Classroom Assignment System
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-md text-sm mb-6 border border-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-zinc-300 border border-white/20"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-zinc-300 border border-white/20"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black py-2.5 rounded-md font-semibold hover:bg-zinc-200"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-zinc-300">
          Don’t have an account?{" "}
          <Link to="/register" className="text-white font-semibold underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}