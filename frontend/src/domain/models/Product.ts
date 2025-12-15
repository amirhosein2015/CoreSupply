export interface Product {
  id: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  imageFile: string;
  price: number;
}

// برای پاسخ‌های صفحه‌بندی شده (اگر API ساپورت می‌کند)
// فعلاً فرض می‌کنیم لیست ساده برمی‌گردد
export type ProductListResponse = Product[];
