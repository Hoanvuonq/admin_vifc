import { toast } from "@/providers/ToastProvider";
import { useCallback } from "react";

export const useUpload = () => {
  const uploadFile = useCallback(
    async (
      file: File,
      onProgress?: (p: number) => void,
    ): Promise<{ url: string; thumbnailUrl?: string }> => {
      try {
        if (file.type === "application/pdf") {
          return new Promise(async (resolve, reject) => {
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

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/upload/pdf", true);

            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable && onProgress) {
                const percentComplete = (event.loaded / event.total) * 100;
                onProgress(percentComplete);
              }
            };

            xhr.onload = () => {
              if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                toast.success("PDF uploaded successfully!");
                resolve({
                  url: response.fileUrl,
                  thumbnailUrl: response.thumbnailUrl,
                });
              } else {
                let errorMsg = "Failed to upload PDF";
                try {
                  const errorRes = JSON.parse(xhr.responseText);
                  if (errorRes.error) errorMsg = errorRes.error;
                } catch (e) {}
                toast.error("Upload failed", { description: errorMsg });
                reject(new Error(errorMsg));
              }
            };

            xhr.onerror = () =>
              reject(new Error("Network error during upload"));
            xhr.send(formData);
          });
        }

        // === Image upload: send file directly via FormData ===
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("file", file);

          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/api/upload/image", true);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
              const percentComplete = (event.loaded / event.total) * 100;
              onProgress(percentComplete);
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              toast.success("Image uploaded successfully!");
              resolve({ url: response.fileUrl });
            } else {
              let errorMsg = "Failed to upload image";
              try {
                const errorRes = JSON.parse(xhr.responseText);
                if (errorRes.error) errorMsg = errorRes.error;
              } catch (e) {}
              toast.error("Upload failed", { description: errorMsg });
              reject(new Error(errorMsg));
            }
          };

          xhr.onerror = () => reject(new Error("Network error during upload"));
          xhr.send(formData);
        });
      } catch (error: any) {
        toast.error("Upload failed", { description: error.message });
        throw error;
      }
    },
    [],
  );

  return { uploadFile };
};
