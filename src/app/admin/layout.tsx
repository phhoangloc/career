
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
                name: "メディア",
                child: [
                  { name: "メディア一覧", link: "/admin/media", }
                ]
              },
              {
                name: "ポスト",
                child: [
                  { name: "ポスト一覧", link: "/admin/post", },
                  { name: "新規ポスト", link: "/admin/post/new", }
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
                position: "admin",
                name: "施設",
                child: [
                  { name: "施設一覧", link: "/admin/facility", },
                  { name: "新規施設", link: "/admin/facility/new", }
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
