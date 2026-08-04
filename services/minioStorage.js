const crypto = require("crypto");
const path = require("path");
const Minio = require("minio");

const bucketName = process.env.MINIO_BUCKET || "portfolio-images";

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: Number(process.env.MINIO_PORT || 9000),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

let bucketInitPromise;

const ensureBucket = async () => {
  if (!bucketInitPromise) {
    bucketInitPromise = (async () => {
      const exists = await minioClient.bucketExists(bucketName);

      if (!exists) {
        await minioClient.makeBucket(bucketName, "us-east-1");
      }
    })();
  }

  return bucketInitPromise;
};

const buildApiImageUrl = (objectName) => {
  return `/api/projects/image?key=${encodeURIComponent(objectName)}`;
};

const uploadProjectImage = async (file) => {
  if (!file || !file.data) {
    throw new Error("No valid file data provided");
  }

  await ensureBucket();

  const extension = path.extname(file.name || "");
  const objectName = `projects/${Date.now()}-${crypto.randomUUID()}${extension}`;

  await minioClient.putObject(bucketName, objectName, file.data, file.size, {
    "Content-Type": file.mimetype || "application/octet-stream",
  });

  return buildApiImageUrl(objectName);
};

const getProjectImageObject = async (objectName) => {
  if (!objectName) {
    throw new Error("Missing object key");
  }

  await ensureBucket();

  const stat = await minioClient.statObject(bucketName, objectName);
  const stream = await minioClient.getObject(bucketName, objectName);

  return {
    stream,
    contentType:
      (stat.metaData && stat.metaData["content-type"]) ||
      "application/octet-stream",
    contentLength: stat.size,
  };
};

module.exports = {
  uploadProjectImage,
  getProjectImageObject,
};