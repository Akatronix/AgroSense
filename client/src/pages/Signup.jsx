import { useState } from "react";
import {
  Sprout,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Droplets,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import logoImage from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");

      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (formData.username.trim() === "") {
      setError("Username cannot be empty");
      return;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Signup failed");
        return setError(data.message || "Signup failed");
      }

      toast.success("Account created successfully! Please log in.");

      navigate("/login");
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col items-start space-y-6">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="AgriSense Logo" className="w-12 h-12" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AgriSense</h1>
              <p className="text-sm text-gray-500">Smart Agriculture</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 leading-tight">
            Monitor Your Farm with{" "}
            <span className="text-[#17cf97]">Smart Agriculture</span>
          </h2>

          <p className="text-lg text-gray-600">
            Join thousands of farmers who trust AgriSense to monitor soil
            nutrients (NPK), pH levels, temperature, and moisture for optimal
            crop health.
          </p>

          <div className="space-y-4 w-full">
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-2 bg-[#17cf97]/10 rounded-lg">
                <Sprout className="text-[#17cf97]" size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Soil Health Analysis
                </p>
                <p className="text-sm text-gray-500">
                  Real-time NPK & pH monitoring
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-2 bg-[#17cf97]/10 rounded-lg">
                <Droplets className="text-[#17cf97]" size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Climate Tracking</p>
                <p className="text-sm text-gray-500">
                  Temperature & moisture alerts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <Card className="p-8 w-full max-w-md mx-auto lg:max-w-none">
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#17cf97] rounded-xl flex items-center justify-center shadow-md shadow-[#17cf97]/20">
                <Sprout className="text-white" size={24} />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-900">AgriSense</h1>
                <p className="text-xs text-gray-500">Smart Agriculture</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-sm text-gray-500 mt-2">
              Start optimizing your crop yield today
            </p>
            <p className="text-red-500">{error ? error : ""}</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                    setError(null);
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#17cf97] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setError(null);
                  }}
                  placeholder="farmer@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#17cf97] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#17cf97] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    });
                    setError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#17cf97] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              className="w-full py-3 !bg-[#17cf97] hover:!bg-[#15b386] text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
              <ArrowRight size={18} />
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#17cf97] hover:text-[#15b386] font-semibold"
            >
              Sign in
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
