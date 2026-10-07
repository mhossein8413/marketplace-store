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

  const queryString = params.toString();

  const url = queryString
    ? `${API_URL}/products?${queryString}`
    : `${API_URL}/products`;

  return request(url);
}

export async function getProductById(id) {
  return request(`${API_URL}/products/${id}`);
}

export async function getRelatedProducts(id) {
  return request(`${API_URL}/products/${id}/related`);
}