const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

const API_ORIGIN =
  API_URL.replace(/\/api\/?$/, "");

/*
|--------------------------------------------------------------------------
| Request
|--------------------------------------------------------------------------
*/

async function request(
  url,
  options = {}
) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
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
      data.message ||
        "خطا در ارتباط با سرور"
    );
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Authenticated Request
|--------------------------------------------------------------------------
*/

async function requestAuthenticated(
  url,
  token,
  options = {}
) {
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  /*
   * وقتی body از نوع FormData است،
   * نباید Content-Type را دستی تعیین کنیم.
   * Browser خودش boundary مربوط به multipart/form-data
   * را قرار می‌دهد.
   */
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] =
      "application/json";
  }

  return request(url, {
    ...options,
    headers,
  });
}

/*
|--------------------------------------------------------------------------
| Image URL
|--------------------------------------------------------------------------
*/

function normalizeImageUrl(image) {
  if (!image) {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  return `${API_ORIGIN}${
    image.startsWith("/")
      ? image
      : `/${image}`
  }`;
}

/*
|--------------------------------------------------------------------------
| Normalize Product
|--------------------------------------------------------------------------
*/

export function normalizeProduct(
  product
) {
  return {
    id: product._id,

    title: product.title,

    description:
      product.description || "",

    seller:
      product.seller?.name ||
      product.seller?.email ||
      "فروشنده",

    price: product.price,

    stock: product.stock,

    image: normalizeImageUrl(
      product.images?.[0]
    ),

    images:
      (product.images || []).map(
        normalizeImageUrl
      ),

    category:
      product.category?.name ||
      "بدون دسته‌بندی",

    categoryId:
      product.category?._id ||
      product.category ||
      "",

    tags:
      product.tags || [],

    salesCount:
      product.salesCount || 0,

    viewCount:
      product.viewCount || 0,

    isFeatured:
      product.isFeatured || false,

    status:
      product.status,

    rejectionReason:
      product.rejectionReason || "",

    createdAt:
      product.createdAt,

    updatedAt:
      product.updatedAt,
  };
}

/*
|--------------------------------------------------------------------------
| Get Public Products
|--------------------------------------------------------------------------
*/

export async function getProducts({
  category = "",
  tag = "",
} = {}) {
  const params =
    new URLSearchParams();

  if (category) {
    params.set(
      "category",
      category
    );
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

/*
|--------------------------------------------------------------------------
| Get Categories
|--------------------------------------------------------------------------
*/

export async function getCategories() {
  return request(
    `${API_URL}/products/categories`
  );
}

/*
|--------------------------------------------------------------------------
| Create Category
|--------------------------------------------------------------------------
*/

export async function createCategory(
  token,
  name
) {
  return requestAuthenticated(
    `${API_URL}/products/categories`,
    token,
    {
      method: "POST",

      body: JSON.stringify({
        name,
      }),
    }
  );
}

/*
|--------------------------------------------------------------------------
| Get Product By ID
|--------------------------------------------------------------------------
*/

export async function getProductById(
  id
) {
  return request(
    `${API_URL}/products/${id}`
  );
}

/*
|--------------------------------------------------------------------------
| Get Related Products
|--------------------------------------------------------------------------
*/

export async function getRelatedProducts(
  id
) {
  return request(
    `${API_URL}/products/${id}/related`
  );
}

/*
|--------------------------------------------------------------------------
| Get My Products
|--------------------------------------------------------------------------
*/

export async function getMyProducts(
  token
) {
  return requestAuthenticated(
    `${API_URL}/products/my`,
    token
  );
}

/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/

export async function createProduct(
  token,
  formData
) {
  return requestAuthenticated(
    `${API_URL}/products`,
    token,
    {
      method: "POST",

      body: formData,
    }
  );
}

/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

export async function updateProduct(
  token,
  productId,
  productData
) {
  return requestAuthenticated(
    `${API_URL}/products/${productId}`,
    token,
    {
      method: "PATCH",

      body: JSON.stringify(
        productData
      ),
    }
  );
}

/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
*/

export async function deleteProduct(
  token,
  productId
) {
  return requestAuthenticated(
    `${API_URL}/products/${productId}`,
    token,
    {
      method: "DELETE",
    }
  );
}