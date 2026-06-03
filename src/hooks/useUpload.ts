import { toast } from "@/providers/ToastProvider";
import axios from "axios";
import { useCallback } from "react";

const uploadAxios = axios.create();

export const useUpload = () => {
  const uploadFile = useCallback(
    async (
      file: File,
      onProgress?: (p: number) => void,
    ): Promise<{ url: string; thumbnailUrl?: string }> => {
      try {
        const isPdf = file.type === "application/pdf";
        const fileTypeString = isPdf ? "pdf" : "image";

        const resPresign = await axios.get("/api/upload/presign", {
          params: {
            filename: file.name,
            contentType: file.type,
            type: fileTypeString,
          },
        });
        const { presignedUrl, fileUrl } = resPresign.data;

        let thumbnailPresignedUrl = null;
        let thumbnailUrl = null;
        let thumbnailBlob: Blob | null = null;

        if (isPdf) {
          try {
            const { generatePdfThumbnail } = await import("@/utils/pdf");
            thumbnailBlob = await generatePdfThumbnail(file);
            if (thumbnailBlob) {
              const resThumbPresign = await axios.get("/api/upload/presign", {
                params: {
                  filename: "thumbnail.jpg",
                  contentType: "image/jpeg",
                  type: "thumbnail",
                },
              });
              thumbnailPresignedUrl = resThumbPresign.data.presignedUrl;
              thumbnailUrl = resThumbPresign.data.fileUrl;
            }
          } catch (err) {
            console.warn(
              "Failed to generate/presign PDF thumbnail client-side",
              err,
            );
          }
        }

        await uploadAxios.put(presignedUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
              const percentComplete =
                (progressEvent.loaded / progressEvent.total) * 100;
              onProgress(percentComplete);
            }
          },
        });

        // 4. Upload thumbnail if it exists
        if (thumbnailBlob && thumbnailPresignedUrl) {
          try {
            await uploadAxios.put(thumbnailPresignedUrl, thumbnailBlob, {
              headers: { "Content-Type": "image/jpeg" },
            });
          } catch (err) {
            console.warn("Thumbnail upload failed", err);
          }
        }

        return { url: fileUrl, thumbnailUrl: thumbnailUrl || undefined };
      } catch (error: any) {
        let errorMsg = "Upload failed";
        if (error.response?.data?.error) {
          const errData = error.response.data.error;
          errorMsg =
            typeof errData === "object"
              ? errData.message || "Upload failed"
              : errData;
        } else if (error.message) {
          errorMsg = error.message;
        }
        toast.error("Upload failed", { description: errorMsg });
        throw new Error(errorMsg);
      }
    },
    [],
  );

  return { uploadFile };
};
