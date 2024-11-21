
import type { Metadata } from "next";
import { Noto_Sans_Javanese } from "next/font/google";
import Provider from "@/redux/component/provider";
import LayoutRow from "@/component/layout/layoutRow";
import NaviLeft from "@/component/asset/naviLeft";
import Authen from "@/component/tool/Authen";

const inter = Noto_Sans_Javanese({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={inter.className}>
      <Provider>
        <LayoutRow
          naviLeftWitdh={"200px"}
          naviLef={
            <NaviLeft data={[
              {
                position: "admin",
                name: "ニュース",
                child: [
                  { name: "ニュース一覧", link: "/admin/news" },
                  { name: "新規ニュース", link: "/admin/news/news" },
                  { name: "カテゴリー", link: "/admin/category" }
                ]
              },
              {
                name: "求人情報",
                child: [
                  { name: "求人情報一覧", link: "/admin/post", },
                  { name: "新規求人情報", link: "/admin/post/new", },
                  { name: "職種", link: "/admin/worktype", }
                ]
              },
              {
                position: "admin",
                name: "施設情報",
                child: [
                  { name: "施設情報一覧", link: "/admin/facility", },
                  // { name: "新規施設情報", link: "/admin/facility/new", }
                ]
              },
              {
                position: "admin",
                name: "インタビュー",
                child: [
                  { name: "インタビュー一覧", link: "/admin/interview", },
                  { name: "新規インタビュー", link: "/admin/interview/new", }
                ]
              },
              {
                name: "メディア",
                child: [
                  { name: "メディア一覧", link: "/admin/media", }
                ]
              },

              {
                position: "admin",
                name: "ユーザー",
                child: [
                  { name: "インタビュー一覧", link: "/admin/user", },
                ]
              },
            ]}
              naviLeftWitdh='200px' />
          }
        >
          <div className='width-100p' style={{ minHeight: "calc(100vh - 60px)" }}>
            <Authen>
              {children}
            </Authen>
          </div>
        </LayoutRow >
      </Provider>
    </div>
  );
}
