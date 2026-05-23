"use client";

import { useEffect, useState } from "react";
import { ref, onValue, query, orderByChild } from "firebase/database";
import { db } from "@/lib/firebase";
import { Product } from "@/lib/definitions";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = query(ref(db, "products"), orderByChild("name"));

    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsList = Object.keys(data).map(key => ({
          id: key,
        ...data[key]
        }));
        setProducts(productsList);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-6">جاري التحميل...</div>;

  return (
    <div className="page-container p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">المنتجات</h1>
      <p className="mb-6 text-gray-400">عدد المنتجات: {products.length}</p>

      <div className="grid gap-4">
        {products.length === 0? (
          <p>لا يوجد منتجات</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="p-4 bg-gray-800 rounded-lg">
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-gray-400">{product.price} $</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
