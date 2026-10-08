import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const uploadDirectory = path.resolve(
  process.cwd(),
  "uploads",
  "products"
);

fs.mkdirSync(uploadDirectory, {
  recursive: true,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    cb(
      null,
      `${Date.now()}-${randomUUID()}${extension}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "فقط فایل‌های تصویری مجاز هستند"
      ),
      false
    );
  }
};

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 6,
  },

  fileFilter,
});

export const uploadProductImages = (
  req,
  res,
  next
) => {
  upload.array("images", 6)(
    req,
    res,
    (error) => {
      if (error) {
        return res.status(400).json({
          message:
            error.message ||
            "خطا در آپلود تصاویر",
        });
      }

      next();
    }
  );
};