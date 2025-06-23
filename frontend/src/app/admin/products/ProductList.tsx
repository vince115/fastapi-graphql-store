// frontend/src/components/admin/products/ProductList.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { graphQLClient } from "@/lib/graphqlClient"; // ✅ 使用你的模組
import ProductFormModal from "./ProductFormModal";
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
import { Product } from "@/types/product";
import {
  PRODUCT_QUERY,
  PRODUCT_MUTATION,
  UPDATE_PRODUCT_MUTATION,
  DELETE_PRODUCT_MUTATION,
} from "@/graphql/products";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // 可選 10、20
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  //加入排序的狀態欄位
  const [sortField, setSortField] = useState<keyof Product | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // 1. 根據關鍵字過濾商品
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. 排序已過濾的商品
  const sortedProducts = [...filteredProducts].sort((a, b) => {
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
      // true > false
      return sortOrder === "asc"
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    }
    return 0;
  });

  // 3. 進行分頁
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentItems = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //點擊標題時排序
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await graphQLClient.request<{ products: Product[] }>(
        PRODUCT_QUERY
      );
      setProducts(res.products);
    };
    fetchData();
  }, []);

useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(1);
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchTerm, totalPages]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setOpenModal(true);
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteTarget(product);
  };
  const confirmDelete = async () => {
    if (deleteTarget) {
      // 向後端發送刪除請求
      await graphQLClient.request(DELETE_PRODUCT_MUTATION, {
        id: Number(deleteTarget.id),
      });
      // 從畫面上移除
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      // 刪除後自動回到第一頁
      if (currentPage > 1 && currentItems.length === 1) {
        setCurrentPage((prev) => prev - 1);
      }
    }
  };

  const handleSave = async (product: Product) => {
    if (product.id) {
      const input = {
        id: Number(product.id),
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        isActive: product.isActive,
      };
      const res = await graphQLClient.request<{ updateProduct: Product }>(
        UPDATE_PRODUCT_MUTATION,
        input
      );

      // 更新舊的 product 清單
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? res.updateProduct : p))
      );
      
    } else {
      const input = {
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        isActive: product.isActive,
      };
      const res = await graphQLClient.request<{ addProduct: Product }>(
        PRODUCT_MUTATION,
        input
      );
      setProducts((prev) => [...prev, res.addProduct]);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="搜尋商品..."
          className="w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          onClick={() => {
            setEditingProduct(null);
            setOpenModal(true);
          }}
        >
          + 新增商品
        </Button>
      </div>

      <Table className="border">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-8">ID.</TableHead>
            <TableHead>圖片</TableHead>
            <TableHead
              onClick={() => handleSort("name")}
              className="cursor-pointer hover:text-teal-900"
            >
              名稱 {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead
              onClick={() => handleSort("category")}
               className="cursor-pointer hover:text-teal-900"
            >
              分類{" "}
              {sortField === "category" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead
              onClick={() => handleSort("price")}
               className="cursor-pointer hover:text-teal-900"
            >
              價格 {sortField === "price" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead
              onClick={() => handleSort("stock")}
               className="cursor-pointer hover:text-teal-900"
            >
              庫存 {sortField === "stock" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead
              onClick={() => handleSort("isActive")}
               className="cursor-pointer hover:text-teal-900"
            >
              狀態 {sortField === "isActive" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableHead>

            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* {products.map((p) => ( */}
          {currentItems.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="text-right">{p.id}.</TableCell>
              <TableCell>
                <Image
                  src={p.imageUrl || "/demo/default.jpg"} // ✅ 自訂預設圖
                  alt={p.name}
                  width={48}
                  height={48}
                  className="rounded object-cover"
                />
              </TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>${p.price}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>
                <Badge variant={p.isActive ? "default" : "destructive"}>
                  {p.isActive ? "上架" : "下架"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button size="sm" onClick={() => handleEdit(p)}>
                  編輯
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteClick(p)} // ✅ 不直接刪除
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
      <ProductFormModal
        open={openModal}
        setOpen={setOpenModal}
        product={editingProduct}
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
              {deleteTarget?.name}
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
