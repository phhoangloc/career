'use client'
import SearchTool from "@/component/searchTool";
import Interview from "@/data/interview";
import Image from "next/image";
import { useRouter } from "next/navigation"

export default function Home() {

  const data = Interview.slice(0, 4);

  const toPage = useRouter()

  return (
    <div className="contain">
      <div className="containRight">
        <div className="coverPicture">
          <div className="slogan">
            <h2>手話で働こう</h2>
            <p>あなたを待っている人がいます。</p>
          </div>
        </div>
        <div className="grid_box items">
          {
            data.map((item, index) =>
              <div key={index} className="grid_child xs6 xl3 item" onClick={() => toPage.push("/home/" + item.archive + "/" + item.slug)}>
                <div className="cover" style={{ position: "relative" }}>
                  <Image src={item.image} fill
                    style={{
                      objectFit: 'cover',
                    }}
                    alt="cover" />
                </div>
                <div className="text">
                  <p className="content_text">{item.content}</p>
                  <p>{item.location} {item.workplaces}<span>事業所</span></p>
                  <p>{item.worktypes}</p>
                  <h4>{item.name} <span>2024年採用</span></h4>
                </div>
              </div>)
          }
        </div>
      </div>
      <SearchTool />
    </div>
  );
}
