"use client";
// frontend/src/components/admin/AdminClientGuard.tsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

type JwtPayload = { exp: number };

export default function AdminClientGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      }
    } catch (err) {
      console.error("Token 錯誤或解析失敗：", err);
      localStorage.removeItem("adminToken");
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">後台管理系統</h1>
      <ul className="space-y-3">
        <li>
          <Link href="/admin/products" className="text-blue-600 underline">
            商品管理
          </Link>
        </li>
        <li>
          <Link href="/admin/users" className="text-blue-600 underline">
            使用者管理
          </Link>
        </li>
      </ul>
    </>
  );
}
