'use client'
import { NoUserAuthen } from "@/api/NoUserAuthen";
import ButtonWeb from "@/component/tool/button";
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Image from "next/image";
import SearchTool from "@/component/searchTool";
import '../../style/grid.css'
export default function Home() {

  const [data, setdata] = useState<any[]>([])
  const [facility, setFacility] = useState<any[]>([])

  const [hover, setHover] = useState<boolean>(false)
  const [coverItem, setCovetItem] = useState<number>(0)


  const getAllInterview = async (a: string) => {
    const result = await NoUserAuthen.getItem(a, "", "", "", "", "", undefined, 2)
    if (result.success) {
      setdata(result.data)
    } else {
      setdata([])
    }
  }
  const getFacility = async (a: string) => {
    const result = await NoUserAuthen.getItem(a, "", "", "", "", "", undefined, 2)
    if (result.success) {
      setFacility(result.data)
    } else {
      setFacility([])
    }
  }
  useEffect(() => {
    getAllInterview("interview")
    getFacility("facility")
  }, [])

  const toPage = useRouter()
  const onHandleHover = () => {
    setHover(true)
  }
  const sloganRef: any = useRef()

  const doc = facility[0]?.content

  function extractStringBetween(text: string, start: string, end: string) {
    const startIndex = text?.indexOf(start) + start.length;
    const endIndex = text?.indexOf(end, startIndex);

    if (startIndex >= start.length && endIndex > startIndex) {
      return text.substring(startIndex, endIndex);
    } else {
      return "";
    }
  }

  return (
    <div className="contain_V2 scrollbar">
      <div className="cover">
        <div className={`cover_left ${hover ? "cover_hover" : ""}`}
          onClick={() => { onHandleHover(), setCovetItem(1) }}
          onMouseEnter={() => { onHandleHover(), setCovetItem(1) }}
          onMouseLeave={() => { setCovetItem(0) }}
        >
        </div>
        <div className={`cover_right ${hover ? "cover_hover" : ""}`}
          onClick={() => { onHandleHover(), setCovetItem(2) }}
          onMouseEnter={() => { onHandleHover(), setCovetItem(2) }}
          onMouseLeave={() => { setCovetItem(0) }}>

        </div>
        <div className={`cover_title ${hover && coverItem === 1 && "cover_title_hover_left"} `}
          onClick={() => toPage.push("/home/interview/" + data[0]?.slug)}>
          <h3>{data[0]?.contenttitle}</h3>
          <h4>{data[0]?.name ? data[0]?.name + "/2024年 採用/" + data[0]?.workplace?.location : ""}</h4>
        </div>
        <div className={`cover_title cover_title_right ${hover && coverItem === 2 && "cover_title_hover"} `}
          onClick={() => toPage.push("/home/interview/" + data[1]?.slug)}>
          <h3>{data[1]?.contenttitle}</h3>
          <h4>{data[1]?.name ? data[0]?.name + "/2024年 採用/" + data[1]?.workplace?.location : ""}</h4>
        </div>
      </div>
      <div ref={sloganRef} className={`slogan`} onClick={() => { onHandleHover() }} onMouseEnter={() => { onHandleHover() }}>
        <div className="slogan_box">
          <h2>手話を活かして
            <br></br>働くということ。
          </h2>
        </div>
      </div>
      <div className="about">
        <p>
          手話を通じてコミュニケーションの架け橋となる仲間を探しています。<br></br>

          あなたの手話スキルを活かし、誰もが理解し合える環境づくりに貢献

          しませんか?
        </p>
        <div className="buttons">
          <ButtonWeb name="業界を知る" bg="#fdefcc" icon={<KeyboardArrowRightIcon style={{ width: "40px", height: "40px", padding: "5px", boxSizing: "border-box" }} />} onClick={() => toPage.push("/home#f")} />
          <ButtonWeb name="仕事を探す" bg="#e6f7ff" icon={<KeyboardArrowRightIcon style={{ width: "40px", height: "40px", padding: "5px", boxSizing: "border-box" }} />} onClick={() => toPage.push("/home#i")} />
        </div>
      </div>
      <div className="div_items" id="f">
        <div className="title">
          <h2> Facility introduction</h2>
          <h1>施設紹介</h1>
          <div className="title_button">
            <ButtonWeb name="インタビュー ⼀覧" bg="white" icon={<KeyboardArrowRightIcon style={{ height: "30px", width: "30px", margin: "5px 5px 5px auto" }} />}
              onClick={() => toPage.push("/home/facility")} />
          </div>
        </div>
        <div className="items" >
          <div className="item" >
            <div className="cover">
              {facility[0]?.image?.name ?
                <Image src={process.env.FTP_URL + "img/career/" + facility[0]?.image?.name} fill style={{ objectFit: "cover" }} alt="home" /> :
                <Image src={"/img/home.jpg"} fill style={{ objectFit: "cover" }} alt="home" />}</div>
            <div className="item_title">
              <h3>{facility[0]?.contenttitle}</h3>
              <h4>{facility[0]?.name}</h4>
              <div className="contentTitle" dangerouslySetInnerHTML={{ __html: extractStringBetween(facility[0]?.content, "<h3>", "</h3>") }}></div>
              <div className="tag">
                <p>{facility[0]?.location}</p>
                <KeyboardArrowRightIcon onClick={() => toPage.push("/home/facility/" + facility[0]?.slug)} />
              </div>
            </div>
          </div>
          <div className="item" >
            <div className="cover">
              {facility[1]?.image?.name ?
                <Image src={process.env.FTP_URL + "img/career/" + facility[1]?.image?.name} fill style={{ objectFit: "cover" }} alt="home" /> :
                <Image src={"/img/home.jpg"} fill style={{ objectFit: "cover" }} alt="home" />}
            </div>
            <div className="item_title">
              <h3>{facility[1]?.contenttitle}</h3>
              <h4>{facility[1]?.name}</h4>
              <div className="contentTitle" dangerouslySetInnerHTML={{ __html: extractStringBetween(facility[1]?.content, "<h3>", "</h3>") }}></div>
              <div className="tag">
                <p>{facility[1]?.location}</p>
                <KeyboardArrowRightIcon onClick={() => toPage.push("/home/facility/" + facility[1].slug)} />
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="div_items div_items_bg_none">
        <div className="title">
          <h2>Interview</h2>
          <h1>先輩たちの声 </h1>
          <div className="title_button">
            <ButtonWeb name="インタビュー ⼀覧" bg="white" icon={<KeyboardArrowRightIcon style={{ height: "30px", width: "30px", margin: "5px 5px 5px auto" }} />}
              onClick={() => toPage.push("/home/interview")} />
          </div>
        </div>
        <div className="items">
          <div className="item">
            <div className="cover"><Image src={process.env.FTP_URL + "img/career/" + data[1]?.image.name} fill style={{ objectFit: "cover" }} alt="home" /></div>
            {/* <div className="cover"><Image src={"/img/example.jpg"} fill style={{ objectFit: "cover" }} alt="home" /></div> */}
            <div className="item_title">
              <h3>{data[1]?.contenttitle}</h3>
              <h4>{data[1]?.name} / 2024年 採用 </h4>
              <h4>{data[1]?.workplace?.name}</h4>
              <div className="tag">
                <p>{data[1]?.workplace?.location}</p>
                <KeyboardArrowRightIcon onClick={() => toPage.push("/home/interview/" + data[1].slug)} />
              </div>
            </div>
          </div>
          <div className="item">
            <div className="cover"><Image src={process.env.FTP_URL + "img/career/" + data[0]?.image.name} fill style={{ objectFit: "cover" }} alt="home" /></div>
            {/* <div className="cover"><Image src={"/img/example.jpg"} fill style={{ objectFit: "cover" }} alt="home" /></div> */}
            <div className="item_title">
              <h3>{data[0]?.contenttitle}</h3>
              <h4>{data[0]?.name} / 2024年 採用 </h4>
              <h4>{data[0]?.workplace?.name}</h4>
              <div className="tag">
                <p>{data[0]?.workplace?.location}</p>

                <KeyboardArrowRightIcon onClick={() => toPage.push("/home/interview/" + data[0].slug)} />
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="div_items div_items_bg_blue" id="i">
        <SearchTool />
      </div>
    </div>
  );
}
