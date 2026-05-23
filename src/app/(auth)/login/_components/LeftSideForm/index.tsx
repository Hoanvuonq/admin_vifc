"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { AuthPanelType, FEATURE_COLORS, getAuthPanelData } from "../../_constants/future";
import { FeatureCard } from "../FeatureCard";
import { Logo } from "../Logo";

interface ILeftSideFormProps {
  type: AuthPanelType;
}

export const LeftSideForm: React.FC<ILeftSideFormProps> = ({ type }) => {
  const content = getAuthPanelData(type);
  const LogoIcon = content.logoIcon;
  const [randomColors, setRandomColors] = useState<any[]>([]);

  useEffect(() => {
    const shuffled = [...FEATURE_COLORS].sort(() => 0.5 - Math.random());
    setRandomColors(shuffled.slice(0, 4));
  }, []);

  return (
    <div className="hidden lg:flex w-full flex-col justify-center items-start relative overflow-hidden">

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl w-full relative z-10"
      >
        <div className="flex flex-col items-start gap-2">
          <Logo
            imgSrc="/icons/icon_sidebar2.png"
            imgWidth={160}
            className="mb-2"
          />

        </div>

        <div className="relative w-full aspect-square max-w-[660px] py-2">
          <div className="absolute inset-0 pointer-events-none z-0">
            <motion.div
              animate={{ x: [-600, 600], opacity: [0, 0.5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/3 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-blue-400/20 to-transparent blur-xs"
            />
            <motion.div
              animate={{ x: [600, -600], opacity: [0, 0.3, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 2 }}
              className="absolute top-2/3 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-purple-400/20 to-transparent blur-xs"
            />
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -40, 0],
                  x: [0, 20, 0],
                  scale: [1, 1.15, 1],
                  opacity: [0.1, 0.25, 0.1]
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 1.2
                }}
                className="absolute rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-[inset_0_0_30px_rgba(255,255,255,0.05)]"
                style={{
                  width: 40 + i * 20,
                  height: 40 + i * 20,
                  top: `${(i * 20) % 90}%`,
                  left: `${(i * 30) % 95}%`,
                }}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 grid-rows-6 gap-3 h-full relative z-10">
            {content.features.map((featureData, index) => {
              let gridClasses = "";
              if (index === 0) gridClasses = "row-span-2 col-start-1";
              if (index === 1) gridClasses = "row-span-4 col-start-2";
              if (index === 2) gridClasses = "row-span-4 col-start-1";
              if (index === 3) gridClasses = "row-span-2 col-start-2";

              const dynamicColors = randomColors[index] || {};

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  transition={{
                    delay: 0.3 + index * 0.15,
                    duration: 0.8,
                    ease: [0.23, 1, 0.32, 1]
                  }}
                  className={cn(gridClasses, "h-full")}
                >
                  <FeatureCard
                    {...featureData}
                    {...dynamicColors}
                    index={index}
                    className="h-full"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};