import {
  useEffect,
  useState,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useNavigate } from "react-router";

import {
  createCategory,
  createProduct,
  getCategories,
} from "../../services/productService";

import { useAuthStore } from "../../store/authStore";

export default function CreateProduct() {
  const navigate = useNavigate();

  const queryClient =
    useQueryClient();

  const token = useAuthStore(
    (state) => state.token
  );

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      tags: "",
    });

  const [files, setFiles] =
    useState([]);

  const [previews, setPreviews] =
    useState([]);

  const [error, setError] =
    useState("");

  const [categoryName, setCategoryName] =
    useState("");

  const [showNewCategory, setShowNewCategory] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const categoriesQuery =
    useQuery({
      queryKey: ["categories"],
      queryFn: getCategories,
    });

  const categories =
    categoriesQuery.data?.categories ||
    [];

  /*
  |--------------------------------------------------------------------------
  | Image Preview
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const urls = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews(urls);

    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  /*
  |--------------------------------------------------------------------------
  | Create Category
  |--------------------------------------------------------------------------
  */

  const createCategoryMutation =
    useMutation({
      mutationFn: (name) =>
        createCategory(token, name),

      onSuccess: async (data) => {
        await queryClient.invalidateQueries({
          queryKey: ["categories"],
        });

        const newCategory =
          data.category;

        setForm((prev) => ({
          ...prev,
          category:
            newCategory._id,
        }));

        setCategoryName("");
        setShowNewCategory(false);
      },

      onError: (error) => {
        setError(
          error.message ||
            "ساخت دسته‌بندی با خطا مواجه شد"
        );
      },
    });

  /*
  |--------------------------------------------------------------------------
  | Create Product
  |--------------------------------------------------------------------------
  */

  const createProductMutation =
    useMutation({
      mutationFn: (formData) =>
        createProduct(
          token,
          formData
        ),

      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["products"],
          }),

          queryClient.invalidateQueries({
            queryKey: ["my-products"],
          }),
        ]);

        navigate("/explore");
      },

      onError: (error) => {
        setError(
          error.message ||
            "ثبت محصول با خطا مواجه شد"
        );
      },
    });

  /*
  |--------------------------------------------------------------------------
  | Handlers
  |--------------------------------------------------------------------------
  */

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFiles(event) {
    setError("");

    const selectedFiles =
      Array.from(
        event.target.files || []
      );

    if (
      selectedFiles.length === 0
    ) {
      return;
    }

    const validFiles = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        setError(
          "فقط فایل‌های تصویری مجاز هستند."
        );
        continue;
      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        setError(
          `حجم تصویر «${file.name}» بیشتر از ۵ مگابایت است.`
        );
        continue;
      }

      validFiles.push(file);
    }

    const combined = [
      ...files,
      ...validFiles,
    ].slice(0, 6);

    setFiles(combined);

    event.target.value = "";
  }

  function removeImage(index) {
    setFiles((prev) =>
      prev.filter(
        (_, fileIndex) =>
          fileIndex !== index
      )
    );
  }

  function handleCreateCategory() {
    setError("");

    if (!categoryName.trim()) {
      setError(
        "نام دسته‌بندی را وارد کنید."
      );

      return;
    }

    createCategoryMutation.mutate(
      categoryName.trim()
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!token) {
      setError(
        "برای ثبت محصول ابتدا باید وارد حساب کاربری شوید."
      );

      return;
    }

    if (!form.title.trim()) {
      setError(
        "عنوان محصول را وارد کنید."
      );

      return;
    }

    if (
      !form.description.trim()
    ) {
      setError(
        "توضیحات محصول را وارد کنید."
      );

      return;
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      setError(
        "قیمت محصول معتبر نیست."
      );

      return;
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      setError(
        "موجودی محصول معتبر نیست."
      );

      return;
    }

    if (!form.category) {
      setError(
        "یک دسته‌بندی انتخاب کنید."
      );

      return;
    }

    if (files.length === 0) {
      setError(
        "حداقل یک تصویر برای محصول انتخاب کنید."
      );

      return;
    }

    const tags = form.tags
      .split(",")
      .map((tag) =>
        tag.trim()
      )
      .filter(Boolean);

    const formData =
      new FormData();

    formData.append(
      "title",
      form.title.trim()
    );

    formData.append(
      "description",
      form.description.trim()
    );

    formData.append(
      "price",
      String(
        Number(form.price)
      )
    );

    formData.append(
      "stock",
      String(
        Number(form.stock)
      )
    );

    formData.append(
      "category",
      form.category
    );

    formData.append(
      "tags",
      JSON.stringify(tags)
    );

    files.forEach((file) => {
      formData.append(
        "images",
        file
      );
    });

    createProductMutation.mutate(
      formData
    );
  }

  const isSubmitting =
    createProductMutation.isPending ||
    createCategoryMutation.isPending;

  return (
    <main
      className="min-h-screen bg-gray-50 px-4 py-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="mb-4 text-sm text-gray-500 transition hover:text-gray-900"
          >
            ← بازگشت
          </button>

          <h1 className="text-3xl font-black text-gray-900">
            ثبت محصول جدید
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            محصولت را ثبت کن تا بلافاصله
            در سایت منتشر شود.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-5 shadow-sm sm:p-8"
        >
          {/* Error */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              {error}
            </div>
          )}

          {/* Title */}

          <div className="mb-6">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              عنوان محصول
            </label>

            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="مثلاً iPhone 15"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 outline-none transition focus:border-gray-900"
            />
          </div>

          {/* Description */}

          <div className="mb-6">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              توضیحات
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              placeholder="توضیحات کامل محصول..."
              className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3.5 leading-7 outline-none transition focus:border-gray-900"
            />
          </div>

          {/* Price + Stock */}

          <div className="mb-6 grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                قیمت
              </label>

              <div className="relative">
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="50000000"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 outline-none transition focus:border-gray-900"
                />

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  تومان
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="stock"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                موجودی
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="10"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 outline-none transition focus:border-gray-900"
              />
            </div>
          </div>

          {/* Category */}

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="category"
                className="block text-sm font-bold text-gray-700"
              >
                دسته‌بندی
              </label>

              <button
                type="button"
                onClick={() =>
                  setShowNewCategory(
                    (prev) => !prev
                  )
                }
                className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-200"
              >
                + دسته‌بندی جدید
              </button>
            </div>

            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={
                categoriesQuery.isLoading
              }
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 outline-none transition focus:border-gray-900"
            >
              <option value="">
                {categoriesQuery.isLoading
                  ? "در حال دریافت دسته‌بندی‌ها..."
                  : "یک دسته‌بندی انتخاب کنید"}
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>

            {/* New Category */}

            {showNewCategory && (
              <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="mb-3 text-sm font-bold text-gray-800">
                  ساخت دسته‌بندی جدید
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={
                      categoryName
                    }
                    onChange={(event) =>
                      setCategoryName(
                        event.target.value
                      )
                    }
                    placeholder="مثلاً لپ‌تاپ"
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-gray-900"
                  />

                  <button
                    type="button"
                    onClick={
                      handleCreateCategory
                    }
                    disabled={
                      createCategoryMutation.isPending
                    }
                    className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-50"
                  >
                    {createCategoryMutation.isPending
                      ? "در حال ساخت..."
                      : "ساخت دسته"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}

          <div className="mb-6">
            <label
              htmlFor="tags"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              تگ‌ها
            </label>

            <input
              id="tags"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="iphone, apple, mobile"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 outline-none transition focus:border-gray-900"
            />

            <p className="mt-2 text-xs text-gray-400">
              چند تگ را با کاما جدا کن.
            </p>
          </div>

          {/* Images */}

          <div className="mb-8">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              تصاویر محصول
            </label>

            <label
              htmlFor="images"
              className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center transition hover:border-gray-500 hover:bg-gray-100"
            >
              <div className="text-4xl">
                📷
              </div>

              <p className="mt-3 font-bold text-gray-800">
                انتخاب تصاویر
              </p>

              <p className="mt-1 text-xs text-gray-400">
                حداکثر ۶ تصویر، هر تصویر حداکثر ۵MB
              </p>

              <input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={
                  handleFiles
                }
                className="hidden"
              />
            </label>

            {/* Image previews */}

            {files.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {files.map(
                  (file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"
                    >
                      <img
                        src={previews[index]}
                        alt={file.name}
                        className="aspect-square w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(
                            index
                          )
                        }
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-600"
                        aria-label="حذف تصویر"
                      >
                        ×
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-2 py-2 text-[10px] text-white">
                        {file.name}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createProductMutation.isPending
              ? "در حال انتشار محصول..."
              : "ثبت و انتشار محصول"}
          </button>
        </form>
      </div>
    </main>
  );
}