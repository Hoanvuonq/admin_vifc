const ABSOLUTE_PROTOCOL_REGEX = /^(?:https?:)?\/\//i;

export const getPublicBase = (): string => {
  return (
    process.env.NEXT_PUBLIC_STORAGE_PUBLIC_BASE ||
    "https://pub-5341c10461574a539df355b9fbe87197.r2.dev"
  );
};

export const toPublicUrl = (path?: string | null): string => {
  if (!path || path === "undefined" || path === "null") return "";
  const normalized = String(path).trim();

  if (
    ABSOLUTE_PROTOCOL_REGEX.test(normalized) ||
    normalized.startsWith("data:") ||
    normalized.startsWith("blob:")
  ) {
    return normalized;
  }

  const base = getPublicBase()?.trim().replace(/\/$/, "");
  const cleanPath = normalized.replace(/^\/+/, "");

  if (!base) return `/${cleanPath}`;

  return `${base}/${cleanPath}`;
};
