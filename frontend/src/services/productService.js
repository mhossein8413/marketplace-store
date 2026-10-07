const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(url) {
  const response = await fetch(url);

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || "خطا در دریافت اطلاعات"
    );
  }

  return data;
}

async function requestAuthenticated(
  url,
  token
) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || "خطا در دریافت اطلاعات"
    );
  }

  return data;
}

export function normalizeProduct(product) {
  return {
    id: product._id,

    title: product.title,

    description: product.description || "",

    seller:
      product.seller?.name ||
      product.seller?.email ||
      "فروشنده",

    price: product.price,

    stock: product.stock,

    image: product.images?.[0] || "",

    images: product.images || [],

    category:
      product.category?.name ||
      "بدون دسته‌بندی",

    categoryId:
      product.category?._id ||
      product.category ||
      "",

    tags: product.tags || [],

    salesCount:
      product.salesCount || 0,

    viewCount:
      product.viewCount || 0,

    isFeatured:
      product.isFeatured || false,

    status: product.status,

    rejectionReason:
      product.rejectionReason || "",

    createdAt: product.createdAt,

    updatedAt: product.updatedAt,
  };
}

export async function getProducts({
  category = "",
  tag = "",
} = {}) {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  if (tag) {
    params.set("tag", tag);
  }

  const queryString =
    params.toString();

  const url = queryString
    ? `${API_URL}/products?${queryString}`
    : `${API_URL}/products`;

  return request(url);
}

export async function getProductById(id) {
  return request(
    `${API_URL}/products/${id}`
  );
}

export async function getRelatedProducts(id) {
  return request(
    `${API_URL}/products/${id}/related`
  );
}

export async function getMyProducts(token) {
  return requestAuthenticated(
    `${API_URL}/products/my`,
    token
  );
}