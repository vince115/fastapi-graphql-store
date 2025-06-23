// frontend/src/app/admin/users/UserFormModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/user";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User | null;
  onSave: (u: User) => void | Promise<void>;
}

type UserFormState = {
  id?: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  isActive: boolean;
};

export default function UserFormModal({ open, setOpen, user, onSave }: Props) {
  const [form, setForm] = useState<UserFormState>({
    username: "",
    email: "",
    password: "",
    role: "user",
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setForm({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        password: user.password ?? "",
      });
    } else {
      setForm({
        username: "",
        email: "",
        password: "",
        role: "user",
        isActive: true,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleaned = value === "● ● ● ● ● ●" ? "" : value;
    setForm((prev) => ({ ...prev, [name]: cleaned }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { password, ...rest } = form;
    const isPasswordValid =
      password && password !== "● ● ● ● ● ●" && password.trim() !== "";
    const payload = isPasswordValid ? { ...rest, password } : rest;
    onSave(payload);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "編輯使用者" : "新增使用者"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="flex items-center">
            <span className="w-1/6 text-base ">帳號</span>
            <div className="w-5/6">
            <Input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="帳號"
              required
            /></div>
          </div>
          <div className="flex items-center">
            <span className="w-1/6">Email</span>
            <div className="w-5/6">
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
            />
            </div>
          </div>

          <div className="flex items-center">
            <span className="w-1/6">密碼</span>
            <div className="flex flex-col w-5/6">
              <Input
                name="password"
                type="password"
                value={form.password ?? ""}
                onChange={handleChange}
                placeholder="● ● ● ● ● ●"
                required={!user} // 新增使用者時為必填，編輯可選填
              />{" "}
           
              {user && (
                <p className="text-sm text-muted-foreground ml-2">
                  如需變更請輸入新密碼，若不輸入則保留原密碼
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <span className="w-1/6">角色</span>
            <div className="w-2/6">
            <Select
              value={form.role}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="選擇角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">user</SelectItem>
                <SelectItem value="admin">admin</SelectItem>
              </SelectContent>
            </Select>
            </div>
          </div>
          <div className="flex items-center">
            
            <span className="w-1/6">啟用</span>
            <div className="w-3/6">
            <Switch
              id="isActive"
              checked={form.isActive}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, isActive: checked }))
              }
            />
             </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              取消
            </Button>
            <Button type="submit">儲存</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
