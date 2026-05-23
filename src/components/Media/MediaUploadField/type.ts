export interface CustomFile {
  uid: string;
  assetId?: string | number;
  id?: string | number;
  name?: string;
  url?: string;
  thumbnailUrl?: string;
  preview?: string;
  originFileObj?: File;
  status?: "uploading" | "done" | "error" | "removed" | "pending";
  type?: string;
  percent?: number;
  isLoading?: boolean;
  isPublic?: boolean;
  isPrivate?: boolean;
  title?: string;
}

export interface MediaUploadFieldProps {
  value?: CustomFile[];
  onChange: (files: CustomFile[]) => void;

  onUpload?: (
    file: File,
    onProgress: (p: number) => void,
  ) => Promise<{ url: string; id?: string | number; thumbnailUrl?: string }>;

  maxCount?: number;
  size?: "sm" | "md" | "lg";
  allowedTypes?: string[];
  maxSizeMB?: number;
  className?: string;
  classNameSizeUpload?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  isPrivateMode?: boolean;
  isPost?: boolean;
}
