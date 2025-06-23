// frontend/src/app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ImShield } from "react-icons/im";
import { MdOutlineDisplaySettings } from "react-icons/md";
import { FcLibrary } from "react-icons/fc";
import { HiLibrary } from "react-icons/hi";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function AdminLoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(login(credentials)).unwrap();
      console.log("✅ 管理員登入成功:", result);
      router.replace("/admin");
    } catch (err) {
      console.error("❌ 登入失敗:", err);
      alert("帳號或密碼錯誤");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-md max-w-sm w-full p-8 border border-stone-300">
        <div className="text-center mb-6">
          <HiLibrary className="text-4xl text-teal-500 mx-auto" />
          <h2 className="text-xl font-bold text-gray-800 mt-2">後台管理登入</h2>
          <p className="text-sm mt-2 text-gray-500">
            請輸入管理員帳號與密碼登入系統
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="請輸入帳號"
            value={credentials.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="請輸入密碼"
            value={credentials.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-teal-500 to-sky-500 text-white font-semibold py-2 rounded shadow hover:opacity-60"
          >
            {loading ? "登入中..." : "登入"}
          </button>
        </form>

        <div className="text-center text-gray-400 text-sm mt-6 border-t">
          <div className="mt-0 flex flex-col gap-2">
            <div className="text-center text-sm text-gray-500 mt-4">
              或使用以下帳號登入
            </div>
            <button className="flex items-center justify-center text-gray-100 border bg-zinc-700  border-gray-800 rounded-md py-2 hover:bg-gray-600">
              <FcGoogle className="w-6 h-6 mr-2" />
              使用 Google 登入
            </button>
            <button className="flex items-center justify-center  text-gray-100 border bg-zinc-700  border-gray-800 rounded-md py-2 hover:bg-gray-600">
              <FaGithub className="w-5 h-5 mr-2" />
              使用 GitHub 登入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
