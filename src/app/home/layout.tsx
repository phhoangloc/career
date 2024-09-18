import Header from "@/component/header";
import type { Metadata } from "next";
import Footer from "@/component/footer";

export const metadata: Metadata = {
  title: "若年層モデル事業就職サイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
