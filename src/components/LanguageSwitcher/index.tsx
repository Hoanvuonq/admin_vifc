"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const locales = [
  { code: 'vi', label: 'Tiếng Việt', display: 'VN', flag: 'https://flagcdn.com/w80/vn.png' },
  { code: 'en-us', label: 'English (US)', display: 'US', flag: 'https://flagcdn.com/w80/us.png' },
  { code: 'en-gb', label: 'English (UK)', display: 'UK', flag: 'https://flagcdn.com/w80/gb.png' },
  { code: 'ja', label: '日本語', display: 'JP', flag: 'https://flagcdn.com/w80/jp.png' },
  { code: 'ko', label: '한국어', display: 'KR', flag: 'https://flagcdn.com/w80/kr.png' },
  { code: 'zh', label: '中文', display: 'SG', flag: 'https://flagcdn.com/w80/sg.png' },
  { code: 'fr', label: 'Français', display: 'FR', flag: 'https://flagcdn.com/w80/fr.png' },
  { code: 'th', label: 'ไทย', display: 'TH', flag: 'https://flagcdn.com/w80/th.png' },
  { code: 'lo', label: 'ລາວ', display: 'LA', flag: 'https://flagcdn.com/w80/la.png' },
  { code: 'km', label: 'ភាសាខ្មែរ', display: 'KH', flag: 'https://flagcdn.com/w80/kh.png' },
  { code: 'au', label: 'English (AU)', display: 'AU', flag: 'https://flagcdn.com/w80/au.png' },
];

export const LanguageSwitcher = ({
  className,
  fullWidth,
  dropdownPosition = "bottom",
  buttonClassName,
  dropdownClassName
}: {
  className?: string,
  fullWidth?: boolean,
  dropdownPosition?: "top" | "bottom",
  buttonClassName?: string,
  dropdownClassName?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocaleCode, setCurrentLocaleCode] = useState('vi');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = locales.find(lang => lang.code === currentLocaleCode) || locales[0];

  const handleSetLocale = (localeCode: string) => {
    setCurrentLocaleCode(localeCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div
      className={cn("relative text-[11px] my-1 font-bold", className)}
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2.5 px-3 py-1.5 rounded-2xl transition-all active:scale-95 focus:outline-none",
          "bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm hover:border-orange-200 hover:bg-white group cursor-pointer",
          fullWidth && "w-full justify-between",
          isOpen && "ring-2 ring-orange-500/10 border-orange-200",
          buttonClassName
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-3.5 relative overflow-hidden rounded-sm shadow-xs border border-slate-100">
            <img
              src={currentLang.flag}
              alt={currentLang.display}
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all"
            />
          </div>
          <div className="flex flex-col items-start leading-none gap-0.5">
            <span className="text-gray-600 group-hover:text-gray-900 tracking-wider">
              {currentLang.display}
            </span>
          </div>
        </div>
        <ChevronDown
          size={12}
          className={cn(
            "text-gray-600 transition-transform duration-300",
            isOpen ? "rotate-180 text-orange-500" : "rotate-0"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropdownPosition === "top" ? -10 : 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropdownPosition === "top" ? -5 : 5, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute right-0 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden",
              dropdownPosition === "top" ? "bottom-full mb-2" : "top-full mt-2",
              fullWidth ? "w-full" : "w-52",
              dropdownClassName
            )}
          >
            <div className="px-4 py-2 text-[9px] font-bold text-gray-600 uppercase mb-1 border-b border-slate-50">
              Quốc gia / Ngôn ngữ
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {locales.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSetLocale(lang.code)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-all relative group",
                    currentLocaleCode === lang.code
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
                  )}
                >
                  <div className="w-6 h-4 relative overflow-hidden rounded-xs shadow-sm border border-slate-100 shrink-0">
                    <img src={lang.flag} alt={lang.label} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between flex-1 truncate gap-2">
                    <span className="font-bold truncate">{lang.label}</span>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-md font-bold transition-colors",
                      currentLocaleCode === lang.code
                        ? "bg-orange-100 text-orange-600"
                        : "bg-slate-100 text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-600"
                    )}>
                      {lang.display}
                    </span>
                  </div>

                  {currentLocaleCode === lang.code && (
                    <motion.div
                      layoutId="active-lang"
                      className="absolute left-0 w-1 h-2/3 bg-orange-500 rounded-r-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};