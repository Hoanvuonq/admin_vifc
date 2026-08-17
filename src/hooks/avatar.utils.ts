export const getAvatarFallback = (name: string) => {
  if (!name || name.length === 0) return { bg: "bg-gray-500", text: "text-white", char: "?" };
  const char = name.charAt(0).toUpperCase();
  const colors = [
    { bg: "bg-orange-500", text: "text-white" },
    { bg: "bg-blue-500", text: "text-white" },
    { bg: "bg-emerald-500", text: "text-white" },
    { bg: "bg-purple-500", text: "text-white" },
    { bg: "bg-pink-500", text: "text-white" },
    { bg: "bg-rose-500", text: "text-white" },
    { bg: "bg-indigo-500", text: "text-white" },
    { bg: "bg-teal-500", text: "text-white" },
    { bg: "bg-cyan-500", text: "text-white" },
    { bg: "bg-amber-500", text: "text-white" },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = colors[Math.abs(hash) % colors.length];
  return { ...color, char };
};

export const getAvatarColor = (name: string) => {
  const fallback = getAvatarFallback(name);
  return `${fallback.bg} ${fallback.text}`;
};
