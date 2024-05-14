'use client'
import SearchTool from "@/component/searchTool";
import Data from "@/data/data";
import Image from "next/image";
import { useRouter } from "next/navigation"

export default function Home() {

  const data = Data.slice(0, 4);

  const toPage = useRouter()

  return (
    <main>
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
                    <h4>{item.name} . {item.location}</h4>
                    <p>職場: {item.location}</p>
                  </div>
                </div>)
            }
          </div>
        </div>
        <SearchTool />
      </div>
    </main>
  );
}
