import { useCallback } from "react";
import { toast } from "sonner";

export const useUpload = () => {
  const uploadFile = useCallback(
    async (
      file: File,
      onProgress?: (p: number) => void,
    ): Promise<{ url: string }> => {
      try {
        const response = await fetch("/api/upload", {
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
