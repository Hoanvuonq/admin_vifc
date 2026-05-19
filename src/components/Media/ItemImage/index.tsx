"use client";

import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/url";
import { Zap } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MediaLightbox } from "../MediaLightbox";

interface ItemImageProps {
  path?: string | null;
  productName?: string;
  className?: string;
  size?: "thumb" | "orig" | "medium" | "large";
  isPreview?: boolean;
}

export const ItemImage: React.FC<ItemImageProps> = React.memo(({
  path,
  productName,
  className = "w-20 h-20",
  size = "thumb",
  isPreview = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [viewIndex, setViewIndex] = useState<number | null>(null);
  const prevPathRef = useRef<string | null | undefined>(path);

  useEffect(() => {
    if (prevPathRef.current !== path) {
      setIsLoading(true);
      setIsError(false);
      prevPathRef.current = path;
    }
  }, [path]);

  const mediaUrl = useMemo(() => {
    if (!path || path === "N/A") return "";
    return toPublicUrl(path.replace("*", size));
  }, [path, size]);

  const isVideo = useMemo(() => {
    if (!mediaUrl) return false;
    const lowerPath = mediaUrl.toLowerCase();
    return (
      lowerPath.includes(".mp4") ||
      lowerPath.includes(".webm") ||
      lowerPath.includes(".ogg") ||
      lowerPath.includes(".mov") ||
      lowerPath.includes("video")
    );
  }, [mediaUrl]);

  const mediaList = useMemo(() => {
    if (!path || path === "N/A") return [];
    return [{
      imagePath: path,
      name: productName || "CanoX Asset",
      type: isVideo ? "VIDEO" : "IMAGE"
    }];
  }, [path, productName, isVideo]);

  if (!mediaUrl || isError) {
    return (
      <div className={cn("relative flex items-center justify-center bg-gray-50 border border-gray-100 rounded-3xl overflow-hidden group shadow-inner", className)}>
        <Image
          src="/icon/package.png"
          alt="No Asset"
          fill
          className="object-contain p-4 transition-all duration-500 group-hover:scale-110"
        />
      </div>
    );
  }

  return (
    <>
      <div
        onClick={() => isPreview && setViewIndex(0)}
        className={cn(
          "relative overflow-hidden group bg-white p-1 rounded-[1.8rem] border border-gray-100 shadow-sm transition-all duration-500",
          isPreview && "cursor-zoom-in",
          className
        )}
      >
        <div className="relative cursor-pointer w-full h-full rounded-[1.4rem] overflow-hidden bg-gray-50 shadow-inner">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-50">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              <Zap size={14} className="text-orange-500 fill-orange-500 opacity-20" />
            </div>
          )}

          {isVideo ? (
            <video
              src={mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setIsError(true);
              }}
              className={cn(
                "w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110",
                isLoading ? "opacity-0 scale-110" : "opacity-100 scale-100"
              )}
            />
          ) : (
            <Image
              src={mediaUrl}
              alt={productName || "CanoX Asset"}
              fill
              priority={false}
              unoptimized
              className={cn(
                "object-cover transition-all duration-700 ease-out group-hover:scale-110",
                isLoading ? "opacity-0 scale-110" : "opacity-100 scale-100"
              )}
              onLoadingComplete={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setIsError(true);
              }}
              sizes="150px"
            />
          )}

          <div className="absolute inset-0 bg-linear-to-tr from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </div>

      {isPreview && (
        <MediaLightbox
          mediaList={mediaList}
          currentIndex={viewIndex}
          onChangeIndex={setViewIndex}
          onClose={() => setViewIndex(null)}
        />
      )}
    </>
  );
});
