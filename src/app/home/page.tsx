'use client'
import { NoUserAuthen } from "@/api/NoUserAuthen";
import SearchTool from "@/component/searchTool";
import Interview from "@/data/interview";
import Image from "next/image";
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react";

export default function Home() {

  const [data, setdata] = useState<any[]>([])
  const getItem = async () => {
    await NoUserAuthen.getItem("image", "", "", "", "", "", undefined, undefined)
    const result = await NoUserAuthen.getInterview()
    if (result.success) {
      setdata(result.data)
    } else {
      setdata([])
    }
  }

  useEffect(() => {
    getItem()
  }, [])

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
            data.slice(0, 3).map((item, index) =>
              <div key={index} className="grid_child xs12 sm4 md12 lg4 item" onClick={() => toPage.push("/home/" + item.archive + "/" + item.slug)}>
                <div className="cover" style={{ position: "relative" }}>
                  <Image src={process.env.FTP_URL + "upload/" + item.image.name} fill
                    style={{
                      objectFit: 'cover',
                    }}
                    alt="cover" />
                </div>
                <div className="text">
                  <p className="content_text" dangerouslySetInnerHTML={{ __html: item.content }}></p>
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
