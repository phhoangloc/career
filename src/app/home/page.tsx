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
  const [news, setNews] = useState<any>()

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
  const getNews = async (a: string) => {
    const result = await NoUserAuthen.getItem(a, "", "", "", "", "", undefined, 1)
    if (result.success) {
      setNews(result.data[0])
    } else {
      setNews([])
    }
  }
  useEffect(() => {
    getAllInterview("interview")
    getFacility("facility")
    getNews("news")
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
  console.log(data)
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
          <ButtonWeb name="業界を知る" bg="#fdefcc" icon={<KeyboardArrowRightIcon style={{ width: "40px", height: "40px", padding: "5px", boxSizing: "border-box" }} />} onClick={() => toPage.push("/home#j")} />
          <ButtonWeb name="仕事を探す" bg="#e6f7ff" icon={<KeyboardArrowRightIcon style={{ width: "40px", height: "40px", padding: "5px", boxSizing: "border-box" }} />} onClick={() => toPage.push("/home#i")} />
        </div>
      </div>
      <div className="about" style={{ paddingTop: "10%", background: "#fceecc" }} id="j">
        <div className="title">
          <h2>News</h2>
          <h1>ニュース</h1>
          <div className="title_button">
            <ButtonWeb name="施設⼀覧" bg="white" icon={<KeyboardArrowRightIcon style={{ height: "30px", width: "30px", margin: "5px 5px 5px auto" }} />}
              onClick={() => toPage.push("/home/news")} />
          </div>
        </div>
        <div className='content_news'>

          <h2>{news?.name}</h2>
          <div className='category'>
            {
              news?.category ? news.category?.map((item: any, index: number) => <p key={index} style={{ margin: "0px 5px 0px 0px" }}>{item.name}</p>) : null
            }
          </div>
          <div className='text dangerousBox' dangerouslySetInnerHTML={{ __html: news?.content }} />
        </div>

        <div className="buttons">
          <ButtonWeb name="施設を知る" bg="white" icon={<KeyboardArrowRightIcon style={{ width: "40px", height: "40px", padding: "5px", boxSizing: "border-box" }} />} onClick={() => toPage.push("/home#f")} />
          <ButtonWeb name="先輩たちの声" bg="#e6f7ff" icon={<KeyboardArrowRightIcon style={{ width: "40px", height: "40px", padding: "5px", boxSizing: "border-box" }} />} onClick={() => toPage.push("/home#h")} />
        </div>
      </div>
      <div className="about" style={{ background: "white", paddingTop: "10%" }} id="j">
        <div className="title">
          <h2>Industry  introduction</h2>
          <h1>業界紹介</h1>
        </div>
        <p className="about_text">
          手話を学んだ人が就職できる主な場所は、次のようなとおりです。<br></br>
          自治体などの行政機関、福祉関連の施設、手話通訳派遣センター、聴覚障がい者団体、社会福祉協議会、聴覚障がい者情報提供施設、自治体などでの手話講師、手話通訳士は、聴覚障がい者のコミュニケーションを支える仕事なので、聴覚障がい者が誰かと話したり、誰かの話を聞いたりといった状況が発生するあらゆる場所で仕事をすることになります。<br></br>
          手話通訳士として働くには、手話通訳士試験に合格し、社会福祉法人聴力障害者情報文化センターに登録する必要があります。受験資格は20歳以上で、3年程度の手話通訳経験を有することが受験の目安になっています。<br></br>
          また、手話技能検定は就職（職業）のための資格ではないため、合格＝就職というわけではありませんが、ホテルやデパート、航空会社などのサービス業や、医療・福祉関係などでは手話を使ったサービスを行っている企業もあります。</p>
        <div className="buttons">
          <ButtonWeb name="施設を知る" bg="#fdefcc" icon={<KeyboardArrowRightIcon style={{ width: "40px", height: "40px", padding: "5px", boxSizing: "border-box" }} />} onClick={() => toPage.push("/home#f")} />
          <ButtonWeb name="先輩たちの声" bg="#e6f7ff" icon={<KeyboardArrowRightIcon style={{ width: "40px", height: "40px", padding: "5px", boxSizing: "border-box" }} />} onClick={() => toPage.push("/home#h")} />
        </div>
      </div>
      <div className="div_items" id="f">
        <div className="title">
          <h2> Facility introduction</h2>
          <h1>施設紹介</h1>
          <div className="title_button">
            <ButtonWeb name="施設⼀覧" bg="white" icon={<KeyboardArrowRightIcon style={{ height: "30px", width: "30px", margin: "5px 5px 5px auto" }} />}
              onClick={() => toPage.push("/home/facility")} />
          </div>
        </div>
        <div className="items" >
          <div className="item" >
            <div className="cover">
              {facility[0]?.image?.name ?
                <Image src={process.env.FTP_URL + "img/career/" + facility[0]?.image?.name} fill style={{ objectFit: "cover", cursor: "pointer" }} alt="home" onClick={() => toPage.push("/home/facility/" + facility[0].slug)} /> :
                <Image src={"/img/home.jpg"} fill style={{ objectFit: "cover" }} alt="home" />}</div>
            <div className="item_title">
              <h3>{facility[0]?.contenttitle}</h3>
              <h4>{facility[0]?.name}</h4>
              <div className="contentTitle" dangerouslySetInnerHTML={{ __html: extractStringBetween(facility[0]?.content, "<h3>", "</h3>") ? extractStringBetween(facility[0]?.content, "<h3>", "</h3>") : "---" }}></div>
              <div className="tag">
                <p>{facility[0]?.location}</p>
                <KeyboardArrowRightIcon onClick={() => toPage.push("/home/facility/" + facility[0]?.slug)} />
              </div>
            </div>
          </div>
          <div className="item" >
            <div className="cover">
              {facility[1]?.image?.name ?
                <Image src={process.env.FTP_URL + "img/career/" + facility[1]?.image?.name} fill style={{ objectFit: "cover", cursor: "pointer" }} alt="home" onClick={() => toPage.push("/home/facility/" + facility[1].slug)} /> :
                <Image src={"/img/home.jpg"} fill style={{ objectFit: "cover" }} alt="home" />}
            </div>
            <div className="item_title">
              <h3>{facility[1]?.contenttitle ? facility[1]?.contenttitle : "---"}</h3>
              <h4>{facility[1]?.name}</h4>
              <div className="contentTitle" dangerouslySetInnerHTML={{ __html: extractStringBetween(facility[1]?.content, "<h3>", "</h3>") ? extractStringBetween(facility[0]?.content, "<h3>", "</h3>") : "---" }}></div>
              <div className="tag">
                <p>{facility[1]?.location}</p>
                <KeyboardArrowRightIcon onClick={() => toPage.push("/home/facility/" + facility[1].slug)} />
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="div_items div_items_bg_none" id="h">
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
            <div className="cover" style={{ height: "inherit" }}>

              {data[1]?.video?.length ? <iframe style={{ width: "100%", aspectRatio: 1.5 }} src={"https://www.youtube.com/embed/" + data[1]?.video} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe> :
                <div style={{ width: "100%", height: "100%", background: "#444", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", maxHeight: "300px" }}> NO VIDEO</div>}
            </div>

            <div className="item_title">
              <h3>{data[1]?.contenttitle}</h3>
              <h4>{data[1]?.name}</h4>
              <h4>{data[1]?.workplace?.name}</h4>
              <div className="tag">
                <p>{data[1]?.workplace?.location}</p>
                <KeyboardArrowRightIcon onClick={() => toPage.push("/home/interview/" + data[1].slug)} />
              </div>
            </div>
          </div>
          <div className="item">
            <div className="cover" style={{ height: "inherit" }}>
              {data[0]?.video?.length ? <iframe style={{ width: "100%", aspectRatio: 1.5 }} src={"https://www.youtube.com/embed/" + data[0]?.video} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe> :
                <div style={{ width: "100%", height: "100%", background: "#444", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", maxHeight: "300px" }}> NO VIDEO</div>}
            </div>
            <div className="item_title">
              <h3>{data[0]?.contenttitle}</h3>
              <h4>{data[0]?.name}</h4>
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
