// frontend/src/app/admin/products/ProductFormModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Product } from "@/types/product";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  product: Product | null;
  onSave: (p: Product) => void | Promise<void>; // 修正點
}

export default function ProductFormModal({ open, setOpen, product, onSave }: Props) {
  const [form, setForm] = useState<Product>({
    id: "",
    name: "",
    category: "",
    price: 0,
    stock: 0,
    isActive: true,
    imageUrl: "",
  });

  useEffect(() => {
    setForm(product ?? {
        id: "",
        name: "",
        category: "",
        price: 0,
        stock: 0,
        isActive: true,
        imageUrl: "",
      });
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ 
        ...prev,
        [name]: ["price", "stock"].includes(name) && value !== "" ? Number(value) : value,

    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (product) {
        // 編輯模式：保留原本的 id
        onSave({ ...form, id: product.id });
      } else {
        // 新增模式：不要傳 id，由後端自動產生
        onSave({ ...form, id: undefined }); 
      }
    
    // onSave(data); 
    console.log("商品已儲存：", form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "編輯商品" : "新增商品"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="flex items-center">
            <span className="w-1/6 text-base">名稱</span>
            <Input name="name" value={form.name} onChange={handleChange} placeholder="商品名稱" required />
          </div>
          <div className="flex items-center">
            <span className="w-1/6">分類</span>
            <Input name="category" value={form.category} onChange={handleChange} placeholder="分類" required />
          </div>
          <div className="flex items-center">
            <span className="w-1/6">價格</span>
            <Input name="price" type="number" value={form.price} onChange={handleChange} placeholder="價格" required />
          </div>
          <div className="flex items-center">
          <span className="w-1/6">庫存</span>
            <Input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="庫存" required />
          </div>
          <div className="flex items-center">
            <span className="w-1/6">圖片url</span>  
            <Input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="圖片網址" />
          </div>
          <div className="flex items-center">
          <span className="w-1/6">上架</span>  
            <Switch
                id="active"
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, active: checked }))}
            />
        </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit">儲存</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
