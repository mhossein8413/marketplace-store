import { useState } from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthStore } from "../../store/authStore";

import {
  getMyOrders,
  getMySales,
  cancelOrder,
  approveOrder,
} from "../../services/orderService";

import { getMyProducts } from "../../services/productService";

/* =========================
   Helpers
========================= */

function formatPrice(price) {
  return new Intl.NumberFormat("fa-IR").format(price || 0);
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getStatusInfo(status) {
  switch (status) {
    case "pending":
      return {
        label: "در انتظار تأیید",
        className: "bg-yellow-100 text-yellow-700",
      };

    case "approved":
      return {
        label: "تأیید شده",
        className: "bg-green-100 text-green-700",
      };

    case "rejected":
      return {
        label: "رد شده",
        className: "bg-red-100 text-red-700",
      };

    case "cancelled":
      return {
        label: "لغو شده",
        className: "bg-gray-100 text-gray-600",
      };

    default:
      return {
        label: status || "نامشخص",
        className: "bg-gray-100 text-gray-600",
      };
  }
}

/* =========================
   Product Card
========================= */

function ProductCard({ product }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              بدون تصویر
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold text-gray-900">
            {product.title}
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            قیمت:{" "}
            <span className="font-semibold text-gray-800">
              {formatPrice(product.price)}
            </span>{" "}
            تومان
          </p>

          <p className="mt-1 text-sm text-gray-500">
            موجودی: {product.stock ?? 0}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            تعداد فروش: {product.salesCount ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Order Card
========================= */

function OrderCard({
  order,
  isSeller = false,
  onCancel,
  onApprove,
  onViewCustomer,
  isCancelling = false,
  isApproving = false,
}) {
  const status = getStatusInfo(order.status);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header */}

      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-gray-400">
            شماره سفارش
          </p>

          <p className="mt-1 break-all text-sm font-semibold text-gray-800">
            {order._id}
          </p>
        </div>

        <div
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
        >
          {status.label}
        </div>
      </div>

      {/* Order info */}

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-3">
          <span className="text-gray-500">
            تاریخ ثبت:
          </span>

          <span className="mr-2 font-semibold text-gray-800">
            {formatDate(order.createdAt)}
          </span>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <span className="text-gray-500">
            مبلغ کل:
          </span>

          <span className="mr-2 font-bold text-gray-900">
            {formatPrice(order.totalAmount)} تومان
          </span>
        </div>
      </div>

      {/* Products */}

      <div className="mt-5">
        <h4 className="mb-3 text-sm font-bold text-gray-800">
          محصولات سفارش
        </h4>

        <div className="space-y-3">
          {order.items?.map((item, index) => {
            const product = item.product;

            return (
              <div
                key={item._id || index}
                className="flex gap-3 rounded-xl border border-gray-100 p-3"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {product?.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                      بدون تصویر
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-800">
                    {product?.title || "محصول حذف شده"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    تعداد: {item.quantity}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    قیمت هنگام خرید:{" "}
                    {formatPrice(item.priceAtPurchase)} تومان
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================
          Buyer: Shipping Address
      ========================= */}

      {!isSeller && order.shippingAddress && (
        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h4 className="mb-3 text-sm font-bold text-gray-800">
            آدرس ارسال
          </h4>

          <div className="grid gap-2 text-sm text-gray-600">
            <p>
              گیرنده:{" "}
              <span className="font-semibold text-gray-800">
                {order.shippingAddress.recipientName || "—"}
              </span>
            </p>

            <p>
              تلفن:{" "}
              <span className="font-semibold text-gray-800">
                {order.shippingAddress.phone || "—"}
              </span>
            </p>

            <p>
              شهر:{" "}
              <span className="font-semibold text-gray-800">
                {order.shippingAddress.city || "—"}
              </span>
            </p>

            <p>
              آدرس:{" "}
              <span className="font-semibold text-gray-800">
                {order.shippingAddress.address || "—"}
              </span>
            </p>

            <p>
              کد پستی:{" "}
              <span className="font-semibold text-gray-800">
                {order.shippingAddress.postalCode || "—"}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* =========================
          Seller Actions
      ========================= */}

      {isSeller && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onViewCustomer(order)}
            className="flex-1 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
          >
            👤 مشاهده اطلاعات مشتری
          </button>

          {order.status === "pending" && (
            <button
              type="button"
              onClick={() => onApprove(order._id)}
              disabled={isApproving}
              className="flex-1 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isApproving
                ? "در حال تأیید..."
                : "✓ تأیید سفارش"}
            </button>
          )}
        </div>
      )}

      {/* =========================
          Buyer Actions
      ========================= */}

      {!isSeller && order.status === "pending" && (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => onCancel(order._id)}
            disabled={isCancelling}
            className="w-full rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCancelling
              ? "در حال لغو..."
              : "لغو سفارش"}
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================
   Customer Modal
========================= */

function CustomerModal({ order, onClose }) {
  if (!order) {
    return null;
  }

  const buyer = order.buyer || {};
  const shippingAddress = order.shippingAddress || {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-modal-title"
      >
        {/* Header */}

        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
          <div>
            <h2
              id="customer-modal-title"
              className="text-lg font-bold text-gray-900"
            >
              اطلاعات مشتری
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              اطلاعات مربوط به سفارش
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-600 transition hover:bg-gray-200"
            aria-label="بستن"
          >
            ×
          </button>
        </div>

        {/* Body */}

        <div className="space-y-5 p-5">
          {/* Account */}

          <div>
            <h3 className="mb-3 text-sm font-bold text-gray-800">
              👤 حساب کاربری مشتری
            </h3>

            <div className="space-y-2 rounded-2xl bg-gray-50 p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className="text-sm text-gray-500">
                  نام:
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  {buyer.name ||
                    shippingAddress.recipientName ||
                    "—"}
                </span>
              </div>

              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className="text-sm text-gray-500">
                  ایمیل:
                </span>

                <span className="break-all text-sm font-semibold text-gray-900">
                  {buyer.email || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping */}

          <div>
            <h3 className="mb-3 text-sm font-bold text-gray-800">
              📦 اطلاعات ارسال
            </h3>

            <div className="space-y-3 rounded-2xl bg-gray-50 p-4">
              <div>
                <p className="text-xs text-gray-400">
                  نام گیرنده
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {shippingAddress.recipientName || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  شماره تماس
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {shippingAddress.phone || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  شهر
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {shippingAddress.city || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  آدرس کامل
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm font-semibold leading-7 text-gray-900">
                  {shippingAddress.address || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  کد پستی
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {shippingAddress.postalCode || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Order */}

          <div>
            <h3 className="mb-3 text-sm font-bold text-gray-800">
              🧾 اطلاعات سفارش
            </h3>

            <div className="space-y-2 rounded-2xl bg-gray-50 p-4">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-gray-500">
                  مبلغ کل
                </span>

                <span className="font-bold text-gray-900">
                  {formatPrice(order.totalAmount)} تومان
                </span>
              </div>

              <div className="flex justify-between gap-3 text-sm">
                <span className="text-gray-500">
                  وضعیت
                </span>

                <span className="font-semibold text-gray-900">
                  {getStatusInfo(order.status).label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="border-t border-gray-100 p-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Profile
========================= */

export default function Profile() {
  const { user, token } = useAuthStore();

  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("orders");

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  /* =========================
     Orders Query
  ========================= */

  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => getMyOrders(token),
    enabled: !!token && activeTab === "orders",
  });

  /* =========================
     Products Query
  ========================= */

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["my-products"],
    queryFn: () => getMyProducts(token),
    enabled: !!token && activeTab === "products",
  });

  /* =========================
     Sales Query
  ========================= */

  const {
    data: salesData,
    isLoading: salesLoading,
    error: salesError,
  } = useQuery({
    queryKey: ["my-sales"],
    queryFn: () => getMySales(token),
    enabled: !!token && activeTab === "sales",
  });

  /* =========================
     Data
  ========================= */

  const orders = Array.isArray(ordersData)
    ? ordersData
    : ordersData?.orders || [];

  const products = Array.isArray(productsData)
    ? productsData
    : productsData?.products || [];

  const sales = Array.isArray(salesData)
    ? salesData
    : salesData?.orders || salesData?.sales || [];

  /* =========================
     Cancel Mutation
  ========================= */

  const cancelMutation = useMutation({
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

        queryClient.invalidateQueries({
          queryKey: ["my-products"],
        }),
      ]);
    },
  });

  /* =========================
     Approve Mutation
  ========================= */

  const approveMutation = useMutation({
    mutationFn: (orderId) =>
      approveOrder(token, orderId),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["my-sales"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["my-orders"],
        }),
      ]);
    },
  });

  /* =========================
     Handlers
  ========================= */

  function handleCancelOrder(orderId) {
    const confirmed = window.confirm(
      "آیا از لغو این سفارش مطمئن هستید؟"
    );

    if (!confirmed) {
      return;
    }

    cancelMutation.mutate(orderId);
  }

  function handleApproveOrder(orderId) {
    const confirmed = window.confirm(
      "آیا از تأیید این سفارش مطمئن هستید؟"
    );

    if (!confirmed) {
      return;
    }

    approveMutation.mutate(orderId);
  }

  function handleViewCustomer(order) {
    setSelectedCustomer(order);
  }

  function handleCloseCustomerModal() {
    setSelectedCustomer(null);
  }

  /* =========================
     Current State
  ========================= */

  const currentLoading =
    activeTab === "orders"
      ? ordersLoading
      : activeTab === "products"
        ? productsLoading
        : salesLoading;

  const currentError =
    activeTab === "orders"
      ? ordersError
      : activeTab === "products"
        ? productsError
        : salesError;

  return (
    <div
      className="min-h-screen bg-gray-50 px-4 py-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-6xl">
        {/* =========================
            Profile Header
        ========================= */}

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gray-900 text-3xl font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() ||
                "U"}
            </div>

            <div>
              <h1 className="text-2xl font-black text-gray-900">
                {user?.name || "کاربر"}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {user?.email || "—"}
              </p>

              {user?.role && (
                <div className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  نقش: {user.role}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================
            Tabs
        ========================= */}

        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="grid grid-cols-3 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`px-3 py-4 text-sm font-bold transition sm:text-base ${
                activeTab === "orders"
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              سفارش‌های من
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`px-3 py-4 text-sm font-bold transition sm:text-base ${
                activeTab === "products"
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              محصولات من
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("sales")}
              className={`px-3 py-4 text-sm font-bold transition sm:text-base ${
                activeTab === "sales"
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              فروش‌های من
            </button>
          </div>
        </div>

        {/* =========================
            Content
        ========================= */}

        <div className="mt-6">
          {currentLoading && (
            <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow-sm">
              در حال دریافت اطلاعات...
            </div>
          )}

          {!currentLoading && currentError && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
              {currentError.message ||
                "خطا در دریافت اطلاعات"}
            </div>
          )}

          {/* =========================
              My Orders
          ========================= */}

          {!currentLoading &&
            !currentError &&
            activeTab === "orders" && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="rounded-2xl bg-white p-10 text-center text-gray-400 shadow-sm">
                    هنوز سفارشی ثبت نکرده‌اید.
                  </div>
                ) : (
                  orders.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      isSeller={false}
                      onCancel={handleCancelOrder}
                      isCancelling={
                        cancelMutation.isPending &&
                        cancelMutation.variables ===
                          order._id
                      }
                    />
                  ))
                )}
              </div>
            )}

          {/* =========================
              My Products
          ========================= */}

          {!currentLoading &&
            !currentError &&
            activeTab === "products" && (
              <div className="space-y-4">
                {products.length === 0 ? (
                  <div className="rounded-2xl bg-white p-10 text-center text-gray-400 shadow-sm">
                    هنوز محصولی ثبت نکرده‌اید.
                  </div>
                ) : (
                  products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))
                )}
              </div>
            )}

          {/* =========================
              My Sales
          ========================= */}

          {!currentLoading &&
            !currentError &&
            activeTab === "sales" && (
              <div className="space-y-4">
                {sales.length === 0 ? (
                  <div className="rounded-2xl bg-white p-10 text-center text-gray-400 shadow-sm">
                    هنوز سفارشی برای محصولات شما ثبت نشده است.
                  </div>
                ) : (
                  sales.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      isSeller={true}
                      onApprove={handleApproveOrder}
                      onViewCustomer={handleViewCustomer}
                      isApproving={
                        approveMutation.isPending &&
                        approveMutation.variables ===
                          order._id
                      }
                    />
                  ))
                )}
              </div>
            )}
        </div>
      </div>

      {/* =========================
          Customer Modal
      ========================= */}

      {selectedCustomer && (
        <CustomerModal
          order={selectedCustomer}
          onClose={handleCloseCustomerModal}
        />
      )}
    </div>
  );
}