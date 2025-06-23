//frontend/src/app/admin/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ 防止 form reload
    try {

        const res = await fetch("http://localhost:8000/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (!res.ok) throw new Error("登入失敗");

        const data = await res.json();
        localStorage.setItem("adminToken", data.access_token);
        router.push("/admin");

      } catch (error) {
        console.error("登入失敗：", error);
        alert("帳號或密碼錯誤！");
      }
    // 假設未來加 JWT 驗證 API
    // if (username === "admin" && password === "1234") {
    //   // ✅ 暫時模擬登入，之後會存 JWT
    //   localStorage.setItem("adminToken", "mock-token");
    //   router.push("/admin");
    // } else {
    //   alert("帳號或密碼錯誤");
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">登入後台管理系統</h1>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-base font-medium text-gray-700">帳號</label>
         
          <input
         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="account"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700">密碼</label>
          <input
           className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        </div>
        <div className="text-right">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            忘記密碼？
          </a>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          onClick={handleLogin}
        >
          登入
        </button>
      </form>

      {/* <div className="mt-6 text-center text-sm text-gray-500">
        或使用以下帳號登入
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button className="flex items-center justify-center border border-gray-300 rounded-md py-2 hover:bg-gray-50">
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
          使用 Google 登入
        </button>
        <button className="flex items-center justify-center border border-gray-300 rounded-md py-2 hover:bg-gray-50">
          <img src="/github-icon.svg" alt="GitHub" className="w-5 h-5 mr-2" />
          使用 GitHub 登入
        </button>
      </div> */}

  </div>
  </div>
  );
}