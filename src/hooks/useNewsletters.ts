"use client";

import { useEffect, useState, useCallback } from "react";
import { NewsletterItem, CreateNewsletterPayload } from "@/types/newsletter";
import { toast } from "@/providers/ToastProvider";

const STORAGE_KEY = "admin_newsletter_publications_v1";

const INITIAL_NEWSLETTERS: NewsletterItem[] = [
  {
    id: "nl-01",
    title: "Recap các hoạt động tại SURF Đà Nẵng",
    subtitle: "Tổng hợp các phiên thảo luận và định hướng hợp tác hệ sinh thái đổi mới sáng tạo",
    banner: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80",
    description: "Recap toàn bộ chuỗi hoạt động tại sự kiện SURF Đà Nẵng: Kết nối các quỹ đầu tư, doanh nghiệp khởi nghiệp và chuyên gia công nghệ hàng đầu.",
    location: "Da Nang Innovation Hub",
    date: "17/05/2026",
    status: "active",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "nl-02",
    title: "Institutional Web3 Briefing — Khung Pháp Lý VIFC & Cơ Hội Doanh Nghiệp FinTech",
    subtitle: "Cập nhật chính sách trung tâm tài chính quốc tế và các sandbox mới",
    banner: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80",
    description: "Bản tin chuyên sâu phân tích lộ trình triển khai trung tâm tài chính quốc tế VIFC, cơ chế cấp phép quỹ tài sản số và tác động tới dòng vốn FDI vào Việt Nam.",
    location: "HCMC, Viet Nam",
    date: "20/08/2026",
    status: "active",
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "nl-03",
    title: "Crypto Venture Weekly — Xu Hướng Đầu Tư AI Agents & DePIN Mới Nổi",
    subtitle: "Dữ liệu gọi vốn của các startup Series A/B nổi bật tại Châu Á",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    description: "Tổng hợp các thương vụ đầu tư công nghệ nổi bật tuần qua, đánh giá định giá các giao thức hạ tầng AI Agents và phân tích cơ hội co-invest cho các nhà đầu tư.",
    location: "Hanoi, Viet Nam",
    date: "14/08/2026",
    status: "active",
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    updated_at: new Date().toISOString(),
  },
];


export const useNewsletters = () => {
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNewsletters(parsed);
          setIsLoading(false);
          return;
        }
      }
      setNewsletters(INITIAL_NEWSLETTERS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NEWSLETTERS));
    } catch {
      setNewsletters(INITIAL_NEWSLETTERS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveNewsletters = (items: NewsletterItem[]) => {
    setNewsletters(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  };

  const createNewsletter = useCallback(
    async (payload: CreateNewsletterPayload) => {
      const newItem: NewsletterItem = {
        id: "nl-" + Date.now(),
        title: payload.title,
        subtitle: payload.subtitle || "",
        banner: payload.banner || payload.image || "/admin/card-event-01.png",
        image: payload.banner || payload.image || "/admin/card-event-01.png",
        description: payload.description,
        location: payload.location || "HCMC, Viet Nam",
        date: payload.date || new Date().toLocaleDateString("vi-VN"),
        status: payload.status || "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const updated = [newItem, ...newsletters];
      saveNewsletters(updated);
      toast.success("Khởi tạo ấn phẩm bản tin mới thành công!");
      return newItem;
    },
    [newsletters]
  );

  const updateNewsletter = useCallback(
    async (id: string, payload: Partial<CreateNewsletterPayload>) => {
      const updated = newsletters.map((item) => {
        if (item.id === id) {
          const bannerUrl = payload.banner || payload.image || item.banner || item.image;
          return {
            ...item,
            ...payload,
            banner: bannerUrl,
            image: bannerUrl,
            updated_at: new Date().toISOString(),
          };
        }
        return item;
      });

      saveNewsletters(updated);
      toast.success("Cập nhật bản tin thành công!");
    },
    [newsletters]
  );

  const deleteNewsletter = useCallback(
    async (id: string) => {
      const updated = newsletters.filter((item) => item.id !== id);
      saveNewsletters(updated);
      toast.success("Đã xóa bản tin khỏi danh sách.");
    },
    [newsletters]
  );

  const toggleNewsletterStatus = useCallback(
    async (id: string) => {
      const target = newsletters.find((n) => n.id === id);
      if (!target) return;
      const nextStatus = target.status === "active" ? "inactive" : "active";

      const updated = newsletters.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: nextStatus,
            updated_at: new Date().toISOString(),
          };
        }
        return item;
      });

      saveNewsletters(updated);
      toast.info(
        `Đã chuyển trạng thái bản tin sang ${
          nextStatus === "active" ? "ĐANG PHÁT HÀNH" : "TẠM ẨN"
        }.`
      );
    },
    [newsletters]
  );

  return {
    newsletters,
    isLoading,
    createNewsletter,
    updateNewsletter,
    deleteNewsletter,
    toggleNewsletterStatus,
    stats: {
      total: newsletters.length,
      active: newsletters.filter((n) => n.status === "active").length,
      hasLuma: newsletters.filter((n) => Boolean(n.luma_url)).length,
    },
  };
};
