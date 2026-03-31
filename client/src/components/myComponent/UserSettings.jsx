import React, { useState } from "react";
import { User, Mail, Save } from "lucide-react";
import api from "@/services/api";
import { useUserDataStore } from "@/stores/userDataStore";
import { toast } from "sonner";

const UserSettings = () => {
  const { userData } = useUserDataStore();
  const [formData, setFormData] = useState({
    fullName: userData ? userData.username : "",
    email: userData ? userData.email : "",
  });

  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleformSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    const myformData = {
      username: formData.fullName,
      email: formData.email,
    };

    const response = await api.post("/user/updateUserInfo", myformData);

    if (response.status === 200) {
      setError("");
      setFormData({
        fullName: "",
        email: "",
      });
      toast.success("User information updated successfully");
    } else {
      toast.error("Failed to update user information");
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Account Settings</h2>
      <p className="text-sm text-gray-500 mb-6">
        Update your profile information
      </p>

      <form
        onSubmit={handleformSubmit}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => {
                handleChange("fullName", e.target.value);
                setError("");
              }}
              className="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                handleChange("email", e.target.value);
                setError("");
              }}
              className="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              placeholder="Enter your email"
            />
          </div>
          <p className="text-red-500">{error}</p>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UserSettings;
