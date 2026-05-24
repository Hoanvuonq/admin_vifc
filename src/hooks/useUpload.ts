import { toast } from "@/providers/ToastProvider";
import axios from "axios";
import { useCallback } from "react";

export const useUpload = () => {
  const uploadFile = useCallback(
    async (
      file: File,
      onProgress?: (p: number) => void,
    ): Promise<{ url: string; thumbnailUrl?: string }> => {
      try {
        if (file.type === "application/pdf") {
          const formData = new FormData();
          formData.append("file", file);

          try {
            const { generatePdfThumbnail } = await import("@/utils/pdf");
            const thumbnailBlob = await generatePdfThumbnail(file);
            if (thumbnailBlob) {
              formData.append("thumbnail", thumbnailBlob, "thumbnail.jpg");
            }
          } catch (err) {
            console.warn("Failed to generate PDF thumbnail client-side", err);
          }

          const response = await axios.post("/api/upload/pdf", formData, {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total && onProgress) {
                const percentComplete =
                  (progressEvent.loaded / progressEvent.total) * 100;
                onProgress(percentComplete);
              }
            },
          });

          // toast.success("PDF uploaded successfully!");
          return {
            url: response.data.fileUrl,
            thumbnailUrl: response.data.thumbnailUrl,
          };
        }

        // === Image upload ===
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post("/api/upload/image", formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
              const percentComplete =
                (progressEvent.loaded / progressEvent.total) * 100;
              onProgress(percentComplete);
            }
          },
        });

        // toast.success("Image uploaded successfully!");
        return { url: response.data.fileUrl };
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
