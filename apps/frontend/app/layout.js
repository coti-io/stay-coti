import "../styles/globals.css";
import Web3Provider from "@/providers/web3-provider";
import AppProvider from "@/providers/app-provider";
import { Toaster } from "react-hot-toast";
import Nav from "@/components/nav";
import { queryClient } from "@/utils/query-client";
import api from "@/utils/api";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

// Prefetch the menu sections data
queryClient.prefetchQuery({
  queryKey: ["menuSections"],
  queryFn: async () => {
    const { data } = await api.get("/v1/sections?limit=10");
    return data;
  },
});

import { headers } from "next/headers";

export async function generateMetadata({ params, searchParams }, parent) {
  // Force dynamic rendering
  headers();

  const { data } = await api.get("/v1/meta");
  const metaData = data?.data?.metaData;
  return {
    title: metaData?.title || "COTI Community Hub – Share Ideas & Earn Rewards",
    description: metaData?.description || "Join the COTI-powered community hub!",
    openGraph: {
      title: metaData?.title || "COTI Community Hub – Share Ideas & Earn Rewards",
      description: metaData?.description || "Join the COTI-powered community hub!",
      type: "website",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://beta-stay.appscyclone.com",
      images: [
        {
          url: metaData?.previewImage?.url || `${process.env.NEXT_PUBLIC_SITE_URL}/images/preview-1.png`,
          width: 1200,
          height: 630,
          alt: metaData?.title || "COTI Community Hub",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaData?.title || "COTI Community Hub – Share Ideas & Earn Rewards",
      description: metaData?.description || "Join the COTI-powered community hub!",
      images: [metaData?.previewImage?.url || `${process.env.NEXT_PUBLIC_SITE_URL}/images/preview-1.png`],
    },
    icons: {
      icon: [{ url: "/images/favicon.ico" }],
      apple: [{ url: "/apple-touch-icon.png" }],
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="min-h-screen bg-gray-50">
        <Web3Provider>
          <AppProvider>
            <Nav />
            {children}
            <Toaster position="top-right" />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          </AppProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
