// frontend/src/app/admin/users/UserList.tsx
"use client";

import React, { useState, useEffect } from "react";
import { graphQLClient } from "@/lib/graphqlClient";
import UserFormModal from "./UserFormModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/user";
import {
  USER_QUERY,
  USER_MUTATION,
  UPDATE_USER_MUTATION,
  DELETE_USER_MUTATION,
} from "@/graphql/users";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  //加入排序的狀態欄位
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // 1. 根據關鍵字過濾商品
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. 排序已過濾的商品
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    } else if (typeof aVal === "boolean" && typeof bVal === "boolean") {
      return sortOrder === "asc"
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    }
    return 0;
  });

  // 3. 進行分頁
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const currentItems = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //點擊標題時排序
  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await graphQLClient.request<{ users: User[] }>(
        USER_QUERY
      );
      setUsers(res.users);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, totalPages]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setOpenModal(true);
  };

  const handleDeleteClick = (user: User) => {
    setDeleteTarget(user);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      // 向後端發送刪除請求
      await graphQLClient.request(DELETE_USER_MUTATION, {
        id: Number(deleteTarget.id),
      });
      // 從畫面上移除
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
      // 刪除後自動回到第一頁
      if (currentPage > 1 && currentItems.length === 1) {
        setCurrentPage((prev) => prev - 1);
      }
    }
  };

  const handleSave = async (user: User) => {
    if (user.id) {
      const input = {
        id: Number(user.id),
        username: user.username,
        email: user.email,
        // password?: user.password,
        role: user.role,
        isActive: user.isActive,
      };
      const res = await graphQLClient.request<{ updateUser: User }>(
        UPDATE_USER_MUTATION,
        input
      );
       // 更新舊的 user 清單
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? res.updateUser : u))
      );

    } else {

      const input = {
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        isActive: user.isActive,
      };

      const res = await graphQLClient.request<{ addUser: User }>(
        USER_MUTATION,
        input
      );
      setUsers((prev) => [...prev, res.addUser]);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="搜尋使用者..."
          className="w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          onClick={() => {
            setEditingUser(null);
            setOpenModal(true);
          }}
        >
          + 新增用戶
        </Button>
      </div>

      <Table className="border">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-8">ID.</TableHead>
            <TableHead
              onClick={() => handleSort("username")}
              className="cursor-pointer hover:text-teal-900"
            >
              帳號 {sortField === "username" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead
              onClick={() => handleSort("email")}
              className="cursor-pointer"
            >
              Email
              {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead
              onClick={() => handleSort("role")}
              className="cursor-pointer"
            >
              角色
              {sortField === "role" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead
              onClick={() => handleSort("isActive")}
              className="cursor-pointer"
            >
              狀態
              {sortField === "isActive" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>
                <Badge variant={u.isActive ? "default" : "destructive"}>
                  {u.isActive ? "啟用" : "停用"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button size="sm" onClick={() => handleEdit(u)}>
                  編輯
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteClick(u)}
                >
                  刪除
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex border justify-between items-center mt-0 p-4 bg-gray-100 border-t-2">
        {/* 頁碼按鈕區塊 */}
        <div className="flex justify-center item-center gap-4">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            上一頁
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              size="sm"
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            下一頁
          </Button>
        </div>

        {/* 每頁筆數下拉 */}
        <div className="flex items-center gap-4 pl-8">
          <span className="text-sm text-gray-500">每頁顯示</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // 回到第一頁
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5 筆</option>
            <option value={10}>10 筆</option>
            <option value={20}>20 筆</option>
            <option value={50}>50 筆</option>
          </select>
        </div>
      </div>

      <UserFormModal
        open={openModal}
        setOpen={setOpenModal}
        user={editingUser}
        onSave={handleSave}
      />

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認刪除</DialogTitle>
          </DialogHeader>
          <p>
            你確定要刪除
            <span className="font-semibold text-red-600 mx-1">
              {deleteTarget?.username}
            </span>
            嗎？刪除後將無法恢復。
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              確認刪除
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
