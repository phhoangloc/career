'use client'
import { NoUserAuthen } from "@/api/NoUserAuthen";
import ButtonWeb from "@/component/tool/button";
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Image from "next/image";
import SearchTool from "@/component/searchTool";
export default function Home() {

  const [data, setdata] = useState<any[]>([])
  const [coverInterview, setCoverInterview] = useState<any>({})

  const [hover, setHover] = useState<boolean>(false)
  const [coverItem, setCovetItem] = useState<number>(0)


  const getOneInterview = async (a: string, s: string) => {
    await NoUserAuthen.getItem("image", "", "", "", "", "", undefined, undefined)
    const result = await NoUserAuthen.getOneItem(a, s)
    if (result.success) {
      setCoverInterview(result.data[0])
    } else {
      setCoverInterview({})
    }
  }
  const getAllInterview = async (a: string) => {
    await NoUserAuthen.getItem("image", "", "", "", "", "", undefined, undefined)
    const result = await NoUserAuthen.getItem(a, "", "", "", "", "", undefined, undefined)
    if (result.success) {
      setdata(result.data)
    } else {
      setdata([])
    }
  }
  useEffect(() => {
    getOneInterview("interview", "0001")
    getAllInterview("interview")
  }, [])

  const toPage = useRouter()
  const onHandleHover = () => {
    setHover(true)
  }

  return (
    <div className="contain_V2 scrollbar">
      <div className="cover" onClick={() => { onHandleHover() }} onMouseEnter={() => { onHandleHover() }}>
        <div className={`cover_left ${hover ? coverItem === 2 ? "cover_dark_hover" : "cover_hover" : ""}`}
          onClick={() => { onHandleHover(), setCovetItem(1) }}
          onMouseEnter={() => { onHandleHover(), setCovetItem(1) }}>
        </div>
        <div className={`cover_right ${hover ? coverItem === 1 ? "cover_dark_hover" : "cover_hover" : ""}`}
          onClick={() => { setCovetItem(2) }}
          onMouseEnter={() => { setCovetItem(2) }}>
        </div>
        <div className={`cover_title ${hover && coverItem === 2 ? "cover_title_hover" : ""} `}>
          <h3>{coverInterview.contenttitle}</h3>
          <h4>{coverInterview.name}/2024年 採用/{coverInterview.location}/{coverInterview.workplace}</h4>
        </div>
      </div>
      <div className={`slogan ${hover ? "slogan_hover" : ""}`} onClick={() => { onHandleHover() }} onMouseEnter={() => { onHandleHover() }}>
        <h2>手話をつかって</h2>
        <h2>働くということ。</h2>
      </div>
      <div className="about">
        <p>
          手話を通じてコミュニケーションの架け橋となる仲間を探しています。<br></br>

          あなたの手話スキルを活かし、誰もが理解し合える環境づくりに貢献

          しませんか?
        </p>
        <div className="buttons">
          <ButtonWeb name="業界を知る" bg="#fdefcc" icon={<KeyboardArrowRightIcon style={{ width: "40px", height: "40px", padding: "5px", boxSizing: "border-box" }} />} />
          <ButtonWeb name="仕事を探す" bg="#e6f7ff" icon={<KeyboardArrowRightIcon style={{ width: "40px", height: "40px", padding: "5px", boxSizing: "border-box" }} />} />
        </div>
      </div>
      <div className="div_items">
        <div className="title">
          <h2> Facility introduction</h2>
          <h1>施設紹介</h1>
        </div>
        <div className="items">
          <div className="item">
            <div className="cover"><Image src={"/img/home.jpg"} fill style={{ objectFit: "cover" }} alt="home" /></div>
            <div className="item_title">
              <h3>⼿話に関する研究‧研修‧試験等をおこなっています</h3>
              <h4>社会福祉法⼈全国⼿話研修センター</h4>
              <div className="tag">
                <p>事業所</p>
                <p>京都府</p>
                <KeyboardArrowRightIcon />
              </div>
            </div>
          </div>
          <div className="item">
            <div className="cover"><Image src={"/img/home.jpg"} fill style={{ objectFit: "cover" }} alt="home" /></div>
            <div className="item_title">
              <h3>⼿話に関する研究‧研修‧試験等をおこなっています</h3>
              <h4>社会福祉法⼈全国⼿話研修センター</h4>
              <div className="tag">
                <p>事業所</p>
                <p>京都府</p>
                <KeyboardArrowRightIcon />
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="div_items div_items_bg_none">
        <div className="title">
          <h2>Interview</h2>
          <h1>| 先輩たちの声 </h1>
          <div className="title_button">
            <ButtonWeb name="インタビュー ⼀覧" bg="white" icon={<KeyboardArrowRightIcon style={{ height: "30px", width: "30px", margin: "5px auto" }} />}
              onClick={() => toPage.push("/home/inteview")} /></div>
        </div>
        <div className="items">
          <div className="item">
            <div className="cover"><Image src={process.env.FTP_URL + "upload/" + data[0]?.image.name} fill style={{ objectFit: "cover" }} alt="home" /></div>
            <div className="item_title">
              <h3>{data[0]?.contenttitle}</h3>
              <h4>{data[0]?.name} / 2024年 採用 / {data[0]?.location}/{data[0]?.workplace}</h4>
              <div className="tag">
                <p>{data[0]?.location}</p>
                <KeyboardArrowRightIcon />
              </div>
            </div>
          </div>
          <div className="item">
            <div className="cover"><Image src={process.env.FTP_URL + "upload/" + data[0]?.image.name} fill style={{ objectFit: "cover" }} alt="home" /></div>
            <div className="item_title">
              <h3>{data[0]?.contenttitle}</h3>
              <h4>{data[0]?.name} / 2024年 採用 / {data[0]?.location}/{data[0]?.workplace}</h4>
              <div className="tag">
                <p>{data[0]?.location}</p>
                <KeyboardArrowRightIcon />
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="div_items div_items_bg_blue">
        <SearchTool />
      </div>
    </div>
  );
}
