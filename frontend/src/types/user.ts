//src/types/user.ts

export interface User {
    id?: string; // 可選，新增時尚未產生
    username: string;
    email: string;
    password?: string; // 編輯時可選，顯示時通常不返回
    role: string; // e.g. "admin" | "editor"
    isActive: boolean;
  }