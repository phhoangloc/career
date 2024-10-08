import Header from "@/component/header";
import SearchTool from "@/component/searchTool";
import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import "../style/global.css"
import '../style/global_copy.css'
import '../style/global_input.css'
import '../style/component.css'
import '../style/theme.css'
import DecideModal from "@/component/modal/decide.modal";
import NoticeModal from "@/component/modal/notice.modal";
import Script from "next/script";

const inter = Zen_Kaku_Gothic_New({ subsets: ["latin"], weight: ["300", "400", "500", "700", "900"] });

export const metadata: Metadata = {
  title: "若年層モデル事業就職サイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " scrollbar"}>
        <DecideModal />
        <NoticeModal />
        {children}
      </body>
    </html>
  );
}
