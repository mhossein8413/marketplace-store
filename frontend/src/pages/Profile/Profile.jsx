import { useState } from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthStore } from "../../store/authStore";

import {
  getMyProducts,
  normalizeProduct,
} from "../../services/productService";

import {
  getMyOrders,
  getMySales,
  cancelOrder,
} from "../../services/orderService";

function Profile() {
  const user = useAuthStore(
    (state) => state.user
  );

  const token = useAuthStore(
    (state) => state.token
  );

  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] =
    useState("orders");

  // ==============================
  // دریافت سفارش‌های من
  // ==============================

  const ordersQuery = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => getMyOrders(token),
    enabled: Boolean(token),
  });

  // ==============================
  // دریافت محصولات من
  // ==============================

  const productsQuery = useQuery({
    queryKey: ["my-products"],
    queryFn: () => getMyProducts(token),
    enabled: Boolean(token),
  });

  // ==============================
  // دریافت فروش‌های من
  // ==============================

  const salesQuery = useQuery({
    queryKey: ["my-sales"],
    queryFn: () => getMySales(token),
    enabled: Boolean(token),
  });

  // ==============================
  // لغو سفارش
  // ==============================

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId) =>
      cancelOrder(token, orderId),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["my-orders"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["my-sales"],
        }),
      ]);
    },
  });

  // ==============================
  // Data
  // ==============================

  const orders =
    ordersQuery.data?.orders || [];

  const products =
    (productsQuery.data?.products || [])
      .map(normalizeProduct);

  const sales =
    salesQuery.data?.orders || [];

  const isLoading =
    ordersQuery.isPending ||
    productsQuery.isPending ||
    salesQuery.isPending;

  // ==============================
  // Cancel handler
  // ==============================

  const handleCancelOrder = (orderId) => {
    const confirmed = window.confirm(
      "آیا مطمئن هستید که می‌خواهید این سفارش را لغو کنید؟"
    );

    if (!confirmed) {
      return;
    }

    cancelOrderMutation.mutate(orderId);
  };

  // ==============================
  // Render
  // ==============================

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            پروفایل من
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            مدیریت حساب، محصولات و سفارش‌ها
          </p>
        </div>

        {/* Profile Card */}

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

            {/* Avatar */}

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-black text-3xl font-bold text-white">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            {/* Information */}

            <div className="space-y-3">

              <div>
                <p className="text-sm text-gray-400">
                  نام
                </p>

                <p className="text-lg font-semibold text-gray-900">
                  {user?.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  ایمیل
                </p>

                <p className="text-sm font-medium text-gray-700">
                  {user?.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  نوع حساب
                </p>

                <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {user?.role === "admin"
                    ? "مدیر"
                    : "کاربر"}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Tabs */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2">
          <div className="grid grid-cols-3 gap-2">

            <button
              type="button"
              onClick={() =>
                setActiveTab("orders")
              }
              className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                activeTab === "orders"
                  ? "bg-black text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              سفارش‌های من
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("products")
              }
              className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                activeTab === "products"
                  ? "bg-black text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              محصولات من
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("sales")
              }
              className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                activeTab === "sales"
                  ? "bg-black text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              فروش‌های من
            </button>

          </div>
        </div>

        {/* Cancel Error */}

        {cancelOrderMutation.isError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {cancelOrderMutation.error?.message ||
              "لغو سفارش انجام نشد"}
          </div>
        )}

        {/* Cancel Success */}

        {cancelOrderMutation.isSuccess && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            سفارش با موفقیت لغو شد.
          </div>
        )}

        {/* Loading */}

        {isLoading && (
          <div className="mt-6 rounded-3xl bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="mt-4 text-sm text-gray-500">
              در حال دریافت اطلاعات...
            </p>

          </div>
        )}

        {/* Orders */}

        {!isLoading &&
          activeTab === "orders" && (
            <div className="mt-6 space-y-4">

              {orders.length === 0 ? (
                <EmptyState
                  title="هنوز سفارشی ندارید"
                  description="وقتی خریدی انجام دهید، سفارش‌های شما اینجا نمایش داده می‌شوند."
                />
              ) : (
                orders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    type="buyer"
                    onCancel={handleCancelOrder}
                    isCancelling={
                      cancelOrderMutation.isPending
                    }
                  />
                ))
              )}

            </div>
          )}

        {/* Products */}

        {!isLoading &&
          activeTab === "products" && (
            <div className="mt-6 space-y-4">

              {products.length === 0 ? (
                <EmptyState
                  title="هنوز محصولی ثبت نکرده‌اید"
                  description="محصولاتی که ثبت می‌کنید در این بخش نمایش داده می‌شوند."
                />
              ) : (
                products.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                  />
                ))
              )}

            </div>
          )}

        {/* Sales */}

        {!isLoading &&
          activeTab === "sales" && (
            <div className="mt-6 space-y-4">

              {sales.length === 0 ? (
                <EmptyState
                  title="هنوز فروشی ندارید"
                  description="سفارش‌هایی که برای محصولات شما ثبت شوند اینجا نمایش داده می‌شوند."
                />
              ) : (
                sales.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    type="seller"
                  />
                ))
              )}

            </div>
          )}

      </div>
    </div>
  );
}

// ==========================================
// Empty State
// ==========================================

function EmptyState({
  title,
  description,
}) {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">

      <h2 className="text-xl font-bold text-gray-900">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
        {description}
      </p>

    </div>
  );
}

// ==========================================
// Product Row
// ==========================================

function ProductRow({ product }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

        {/* Image */}

        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100">

          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              بدون تصویر
            </div>
          )}

        </div>

        {/* Info */}

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <h3 className="font-bold text-gray-900">
              {product.title}
            </h3>

            <StatusBadge
              status={product.status}
            />

          </div>

          <p className="mt-2 text-sm text-gray-500">
            {product.price.toLocaleString(
              "fa-IR"
            )}{" "}
            تومان
          </p>

          {product.rejectionReason && (
            <p className="mt-2 text-sm text-red-500">
              دلیل رد:{" "}
              {product.rejectionReason}
            </p>
          )}

        </div>

        {/* Stock */}

        <div className="text-sm text-gray-500">
          موجودی:{" "}
          <span className="font-semibold text-gray-900">
            {product.stock}
          </span>
        </div>

      </div>

    </div>
  );
}

// ==========================================
// Status Badge
// ==========================================

function StatusBadge({ status }) {
  const styles = {
    pending:
      "bg-yellow-50 text-yellow-700",

    approved:
      "bg-green-50 text-green-700",

    rejected:
      "bg-red-50 text-red-700",

    cancelled:
      "bg-gray-100 text-gray-600",
  };

  const labels = {
    pending: "در انتظار تایید",

    approved: "تایید شده",

    rejected: "رد شده",

    cancelled: "لغو شده",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] ||
        "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

// ==========================================
// Order Card
// ==========================================

function OrderCard({
  order,
  type,
  onCancel,
  isCancelling,
}) {
  const items = order.items || [];

  const canCancel =
    type === "buyer" &&
    order.status === "pending";

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="text-xs text-gray-400">
            شماره سفارش
          </p>

          <p className="mt-1 break-all text-sm font-semibold text-gray-900">
            {order._id}
          </p>

        </div>

        <StatusBadge
          status={order.status}
        />

      </div>

      {/* Items */}

      <div className="mt-5 space-y-3">

        {items.map((item, index) => (
          <div
            key={`${order._id}-${index}`}
            className="flex items-center justify-between rounded-2xl bg-gray-50 p-4"
          >

            <div>

              <p className="font-medium text-gray-900">
                {item.product?.title ||
                  "محصول"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                تعداد:{" "}
                {item.quantity}
              </p>

            </div>

            <p className="text-sm font-semibold text-gray-900">
              {item.priceAtPurchase?.toLocaleString(
                "fa-IR"
              )}{" "}
              تومان
            </p>

          </div>
        ))}

      </div>

      {/* Footer */}

      <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

        {/* Seller / Buyer */}

        {type === "buyer" ? (
          <p className="text-sm text-gray-500">
            فروشنده:{" "}
            <span className="font-medium text-gray-900">
              {order.seller?.name ||
                "فروشنده"}
            </span>
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            خریدار:{" "}
            <span className="font-medium text-gray-900">
              {order.buyer?.name ||
                "خریدار"}
            </span>
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">

          <p className="text-base font-bold text-gray-900">
            مجموع:{" "}
            {order.totalAmount?.toLocaleString(
              "fa-IR"
            )}{" "}
            تومان
          </p>

          {/* Cancel Button */}

          {canCancel && (
            <button
              type="button"
              disabled={isCancelling}
              onClick={() =>
                onCancel(order._id)
              }
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCancelling
                ? "در حال لغو..."
                : "لغو سفارش"}
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

export default Profile;