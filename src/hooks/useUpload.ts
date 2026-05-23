import { useCallback } from "react";
import { toast } from "sonner";

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
                reject(new Error(errorMsg));
              }
            };

            xhr.onerror = () =>
              reject(new Error("Network error during upload"));
            xhr.send(formData);
          });
        }

        const response = await fetch("/api/upload/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });

        const data = await response.json();
        if (!response.ok)
          throw new Error(
            data.message || data.error || "Failed to get upload URL",
          );

        const { uploadUrl, fileUrl } = data;

        if (!uploadUrl) {
          throw new Error("Missing uploadUrl from response");
        }

        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadUrl, true);
          xhr.setRequestHeader("Content-Type", file.type);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
              const percentComplete = (event.loaded / event.total) * 100;
              onProgress(percentComplete);
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve({ url: fileUrl });
            } else {
              reject(new Error("Failed to upload file to S3"));
            }
          };

          xhr.onerror = () => reject(new Error("Network error during upload"));
          xhr.send(file);
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
