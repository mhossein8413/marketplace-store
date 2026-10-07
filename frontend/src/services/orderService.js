const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || "خطا در ارتباط با سرور"
    );
  }

  return data;
}

export async function getMyOrders(token) {
  return request(`${API_URL}/orders/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getMySales(token) {
  return request(`${API_URL}/orders/sales`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createOrder(token, orderData) {
  return request(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
}