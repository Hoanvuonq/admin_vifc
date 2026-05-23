import React from "react";
import { Wallet, Hexagon, ShieldCheck, Gem, Cpu } from "lucide-react";

export type AuthPanelType = "default";

interface ContentItem {
  title: string;
  description: string;
}

interface FeatureCardProps {
  icon?: React.ElementType;
  imageIcon?: string;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
  title: string;
  description: string;
}

interface PanelContent {
  welcome: ContentItem;
  logoIcon: React.ElementType;
  logoGradientFrom: string;
  logoGradientTo: string;
  brandColorFrom: string;
  brandColorTo: string;

  features: FeatureCardProps[];
}

export const AUTH_PANEL_DATA: Record<AuthPanelType, PanelContent> = {
  default: {
    welcome: {
      title: "Enter the Web3 Era 🚀",
      description:
        "Connect your wallet to explore the decentralized ecosystem and unlock exclusive digital assets.",
    },
    logoIcon: Hexagon,
    logoGradientFrom: "from-blue-400",
    logoGradientTo: "to-purple-500",
    brandColorFrom: "from-blue-500",
    brandColorTo: "to-purple-500",
    features: [
      {
        imageIcon: "/auth/icon_login04.png",
        iconColor: "text-blue-400",
        gradientFrom: "from-blue-400/40",
        gradientTo: "to-cyan-400/40",
        title: "Decentralized Finance",
        description: "Trade, stake, and earn yields securely",
      },
      {
        imageIcon: "/auth/icon_login04.png",
        iconColor: "text-orange-400",
        gradientFrom: "from-orange-400/40",
        gradientTo: "to-rose-400/40",
        title: "NFT Marketplace",
        description: "Discover unique digital collectibles",
      },
      {
        imageIcon: "/auth/icon_login04.png",
        iconColor: "text-purple-400",
        gradientFrom: "from-purple-500/40",
        gradientTo: "to-indigo-400/40",
        title: "Smart Contracts",
        description: "Automated, transparent, and trustless",
      },
      {
        imageIcon: "/auth/icon_login04.png",
        iconColor: "text-emerald-400",
        gradientFrom: "from-emerald-400/40",
        gradientTo: "to-teal-400/40",
        title: "Ultimate Security",
        description: "Cryptographic protection for your assets",
      },
    ],
  },
};

export const FEATURE_COLORS = [
  {
    gradientFrom: "from-blue-400/30",
    gradientTo: "to-cyan-400/30",
    iconColor: "text-blue-400",
  },
  {
    gradientFrom: "from-orange-400/30",
    gradientTo: "to-rose-400/30",
    iconColor: "text-orange-400",
  },
  {
    gradientFrom: "from-purple-500/30",
    gradientTo: "to-indigo-400/30",
    iconColor: "text-purple-400",
  },
  {
    gradientFrom: "from-emerald-400/30",
    gradientTo: "to-teal-400/30",
    iconColor: "text-emerald-400",
  },
  {
    gradientFrom: "from-pink-400/30",
    gradientTo: "to-rose-400/30",
    iconColor: "text-pink-400",
  },
  {
    gradientFrom: "from-amber-400/30",
    gradientTo: "to-yellow-400/30",
    iconColor: "text-amber-400",
  },
  {
    gradientFrom: "from-violet-500/30",
    gradientTo: "to-fuchsia-400/30",
    iconColor: "text-violet-400",
  },
  {
    gradientFrom: "from-sky-400/30",
    gradientTo: "to-blue-400/30",
    iconColor: "text-sky-400",
  },
  {
    gradientFrom: "from-lime-400/30",
    gradientTo: "to-green-400/30",
    iconColor: "text-lime-400",
  },
  {
    gradientFrom: "from-red-500/30",
    gradientTo: "to-orange-400/30",
    iconColor: "text-red-400",
  },
  {
    gradientFrom: "from-indigo-500/30",
    gradientTo: "to-purple-400/30",
    iconColor: "text-indigo-400",
  },
  {
    gradientFrom: "from-teal-400/30",
    gradientTo: "to-emerald-400/30",
    iconColor: "text-teal-400",
  },
  {
    gradientFrom: "from-fuchsia-500/30",
    gradientTo: "to-pink-400/30",
    iconColor: "text-fuchsia-400",
  },
  {
    gradientFrom: "from-cyan-400/30",
    gradientTo: "to-sky-400/30",
    iconColor: "text-cyan-400",
  },
  {
    gradientFrom: "from-yellow-400/30",
    gradientTo: "to-amber-400/30",
    iconColor: "text-yellow-400",
  },
  {
    gradientFrom: "from-rose-500/30",
    gradientTo: "to-pink-400/30",
    iconColor: "text-rose-400",
  },
  {
    gradientFrom: "from-blue-700/30",
    gradientTo: "to-indigo-400/30",
    iconColor: "text-blue-500",
  },
  {
    gradientFrom: "from-green-500/30",
    gradientTo: "to-lime-400/30",
    iconColor: "text-green-400",
  },
  {
    gradientFrom: "from-orange-500/30",
    gradientTo: "to-yellow-400/30",
    iconColor: "text-orange-500",
  },
  {
    gradientFrom: "from-purple-700/30",
    gradientTo: "to-violet-400/30",
    iconColor: "text-purple-500",
  },
  {
    gradientFrom: "from-pink-500/30",
    gradientTo: "to-fuchsia-400/30",
    iconColor: "text-pink-500",
  },
  {
    gradientFrom: "from-cyan-500/30",
    gradientTo: "to-teal-400/30",
    iconColor: "text-cyan-500",
  },
  {
    gradientFrom: "from-emerald-500/30",
    gradientTo: "to-lime-400/30",
    iconColor: "text-emerald-500",
  },
  {
    gradientFrom: "from-amber-500/30",
    gradientTo: "to-orange-400/30",
    iconColor: "text-amber-500",
  },
  {
    gradientFrom: "from-sky-500/30",
    gradientTo: "to-cyan-400/30",
    iconColor: "text-sky-500",
  },
  {
    gradientFrom: "from-indigo-700/30",
    gradientTo: "to-blue-500/30",
    iconColor: "text-indigo-500",
  },
  {
    gradientFrom: "from-violet-700/30",
    gradientTo: "to-purple-500/30",
    iconColor: "text-violet-500",
  },
  {
    gradientFrom: "from-rose-700/30",
    gradientTo: "to-red-500/30",
    iconColor: "text-rose-500",
  },
  {
    gradientFrom: "from-fuchsia-700/30",
    gradientTo: "to-pink-500/30",
    iconColor: "text-fuchsia-500",
  },
  {
    gradientFrom: "from-teal-500/30",
    gradientTo: "to-sky-400/30",
    iconColor: "text-teal-500",
  },
  {
    gradientFrom: "from-lime-500/30",
    gradientTo: "to-emerald-400/30",
    iconColor: "text-lime-500",
  },
  {
    gradientFrom: "from-blue-400/30",
    gradientTo: "to-indigo-300/30",
    iconColor: "text-blue-400",
  },
  {
    gradientFrom: "from-orange-400/30",
    gradientTo: "to-amber-300/30",
    iconColor: "text-orange-400",
  },
  {
    gradientFrom: "from-purple-400/30",
    gradientTo: "to-violet-300/30",
    iconColor: "text-purple-400",
  },
  {
    gradientFrom: "from-pink-400/30",
    gradientTo: "to-rose-300/30",
    iconColor: "text-pink-400",
  },
  {
    gradientFrom: "from-emerald-400/30",
    gradientTo: "to-teal-300/30",
    iconColor: "text-emerald-400",
  },
  {
    gradientFrom: "from-cyan-400/30",
    gradientTo: "to-sky-300/30",
    iconColor: "text-cyan-400",
  },
  {
    gradientFrom: "from-yellow-400/30",
    gradientTo: "to-orange-300/30",
    iconColor: "text-yellow-400",
  },
  {
    gradientFrom: "from-indigo-400/30",
    gradientTo: "to-blue-300/30",
    iconColor: "text-indigo-400",
  },
  {
    gradientFrom: "from-violet-400/30",
    gradientTo: "to-fuchsia-300/30",
    iconColor: "text-violet-400",
  },
];

export const getAuthPanelData = (type: string | undefined): PanelContent => {
  const panelType = type as AuthPanelType;

  if (panelType && AUTH_PANEL_DATA[panelType]) {
    return AUTH_PANEL_DATA[panelType];
  }

  return AUTH_PANEL_DATA["default"];
};
