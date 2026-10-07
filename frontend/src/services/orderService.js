const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(url, token) {
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
      data.message || "خطا در دریافت اطلاعات سفارش"
    );
  }

  return data;
}

export async function getMyOrders(token) {
  return request(
    `${API_URL}/orders/my`,
    token
  );
}

export async function getMySales(token) {
  return request(
    `${API_URL}/orders/sales`,
    token
  );
}