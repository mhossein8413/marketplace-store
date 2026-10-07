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

export async function registerUser({
  name,
  email,
  password,
}) {
  return request(`${API_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}

export async function loginUser({
  email,
  password,
}) {
  return request(`${API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function getCurrentUser(token) {
  return request(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}