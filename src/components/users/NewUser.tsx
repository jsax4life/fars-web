"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";
import { toast } from "sonner";

const NewUser = () => {
  const router = useRouter();
  const { createUser } = useUsers();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    avatarUrl:
      "https://gravatar.com/avatar/48c3863a0f03a81d67916d28fdaa0ea6?s=400&d=mp&r=pg",
    password: "",
    role: "staff",
    permissions: ["VIEW_CLIENTS", "EDIT_TRANSACTIONS"] as string[],
    isActive: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePermissionToggle = (perm: string) => {
    setForm((prev) => {
      const exists = prev.permissions.includes(perm);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== perm)
          : [...prev.permissions, perm],
      };
    });
  };

  const validate = () => {
    if (!form.firstName || !form.lastName) {
      toast.error("Firstname and Lastname are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Enter a valid email address.");
      return false;
    }
    if (!form.password || form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        role: form.role,
        username: form.username || undefined,
        phone: form.phone || undefined,
        avatarUrl: form.avatarUrl || undefined,
        password: form.password,
        permissions: form.permissions,
        isActive: form.isActive,
      };
      const res = await createUser(payload as any);
      if (res) {
        router.push("/UserList");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="absolute top-6 left-6 z-20">
        <img src="/logo.svg" alt="Company Logo" className="h-20 w-auto" />
      </div>

      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#2E2D2D] to-[#2E2D2D]/90">
          <img src="/loader.gif" alt="Loading..." className="h-20 w-20" />
        </div>
      )}

      <div className="absolute inset-0 z-0 bg-[url('/bg.svg')] bg-cover bg-no-repeat opacity-100"></div>
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#2E2D2D]/90 to-[#2E2D2D]/50"></div>

      <div className="relative z-20 w-full max-w-xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Create User</h1>
        <p className="mt-2 text-sm sm:text-base font-light text-[#f3f3f3]">
          Create an account for a staff or admin.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="firstName"
              placeholder="First name"
              className="w-full px-4 py-2 rounded-md bg-[#424242] placeholder-gray-300 text-sm text-white outline-none focus:ring-2 focus:ring-[#F36F2E]"
              value={form.firstName}
              onChange={handleChange}
            />
            <input
              name="lastName"
              placeholder="Last name"
              className="w-full px-4 py-2 rounded-md bg-[#424242] placeholder-gray-300 text-sm text-white outline-none focus:ring-2 focus:ring-[#F36F2E]"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 rounded-md bg-[#424242] placeholder-gray-300 text-sm text-white outline-none focus:ring-2 focus:ring-[#F36F2E]"
            value={form.email}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="username"
              placeholder="Username (optional)"
              className="w-full px-4 py-2 rounded-md bg-[#424242] placeholder-gray-300 text-sm text-white outline-none focus:ring-2 focus:ring-[#F36F2E]"
              value={form.username}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Phone e.g. +2347012345678"
              className="w-full px-4 py-2 rounded-md bg-[#424242] placeholder-gray-300 text-sm text-white outline-none focus:ring-2 focus:ring-[#F36F2E]"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <input
            name="avatarUrl"
            placeholder="Avatar URL (optional)"
            className="w-full px-4 py-2 rounded-md bg-[#424242] placeholder-gray-300 text-sm text-white outline-none focus:ring-2 focus:ring-[#F36F2E]"
            value={form.avatarUrl}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Temporary Password"
            className="w-full px-4 py-2 rounded-md bg-[#424242] placeholder-gray-300 text-sm text-white outline-none focus:ring-2 focus:ring-[#F36F2E]"
            value={form.password}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              name="role"
              className="w-full px-4 py-2 rounded-md bg-[#424242] text-white text-sm outline-none focus:ring-2 focus:ring-[#F36F2E]"
              value={form.role}
              onChange={handleChange}
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
            <label className="flex items-center space-x-2 text-white text-sm">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span>Active</span>
            </label>
          </div>

          <div className="text-white text-sm">
            <div className="mb-2">Permissions</div>
            <div className="flex flex-wrap gap-2">
              {[
                "VIEW_CLIENTS",
                "EDIT_TRANSACTIONS",
              ].map((perm) => (
                <button
                  type="button"
                  key={perm}
                  onClick={() => handlePermissionToggle(perm)}
                  className={`px-3 py-1 rounded-full border ${
                    form.permissions.includes(perm)
                      ? "bg-[#F36F2E] text-black border-[#F36F2E]"
                      : "bg-[#424242] text-white border-gray-500"
                  }`}
                >
                  {perm}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="w-full py-2 rounded-md bg-[#F36F2E] text-black font-bold hover:bg-[#F36F2E]/90 focus:ring-2 focus:ring-offset-2 focus:ring-[#F36F2E]"
            >
              Create User
            </button>
            <button
              type="button"
              onClick={() => router.push("/UserList")}
              className="w-full py-2 rounded-md bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewUser;


