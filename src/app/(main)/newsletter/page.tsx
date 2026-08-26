import { Metadata } from "next";
import { NewsletterListScreen } from "./_pages";

export const metadata: Metadata = {
  title: "Quản Lý Bản Tin & Newsletter | VIFC Admin",
  description: "Quản lý các ấn phẩm bản tin On-Chainpass, cấu hình đăng ký qua Lu.ma",
};

export default function NewsletterPage() {
  return <NewsletterListScreen />;
}
