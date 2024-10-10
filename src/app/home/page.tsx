'use client'
import { NoUserAuthen } from "@/api/NoUserAuthen";
import ButtonWeb from "@/component/tool/button";
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Image from "next/image";
import SearchTool from "@/component/searchTool";
import '../../style/grid.css'
import moment from "moment";
import { japanPrefectures, japanRegions } from "@/lib/area";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';

export default function Home() {

  const [data, setdata] = useState<any[]>([])
  const [facility, setFacility] = useState<any[]>([])
  const [news, setNews] = useState<any[]>([])

  const [hover, setHover] = useState<boolean>(false)
  const [coverItem, setCovetItem] = useState<number>(0)

  const [_i, set_i] = useState<number>(-1)
  const [_location, set_location] = useState<string>("")
  const [_area, set_area] = useState<string>("")
  const [_areaModel, set_areaModel] = useState<boolean>(true)

  const getAllInterview = async (a: string) => {
    const result = await NoUserAuthen.getItem(a, "", "", "", "", "", undefined, 2)
    if (result.success) {
      setdata(result.data)
    } else {
      setdata([])
    }
  }
  const getFacility = async (a: string) => {
    const result = await NoUserAuthen.getItem(a, "", "", "", "1", "", undefined, 2)
    if (result.success) {
      setFacility(result.data)
    } else {
      setFacility([])
    }
  }
  const getNews = async (a: string) => {
    const result = await NoUserAuthen.getItem(a, "", "", "", "", "", undefined, 5)
    if (result.success) {
      setNews(result.data)
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
          手話を通じてコミュニケーションの架け橋となる仲間を探しています。
          <br></br>
          <br></br>
          あなたの手話スキルを活かし、誰もが理解し合える環境づくりに貢献しませんか?
        </p>
        <div className="buttons">
          <ButtonWeb name="業界を知る" bg="#F6CA1C" color="#594a36" icon={<KeyboardArrowRightIcon style={{ width: "40px", height: "40px", padding: "5px", boxSizing: "border-box" }} />} onClick={() => toPage.push("/home#j")} />
          <ButtonWeb name="仕事を探す" bg="#53B5E1" color="white" icon={<KeyboardArrowRightIcon style={{ width: "40px", height: "40px", padding: "5px", boxSizing: "border-box", color: "white" }} />} onClick={() => toPage.push("/home#i")} />
        </div>
      </div>
      <div className="about" style={{ paddingTop: "10%", background: "white" }}>
        <div className="title">
          <h2>News</h2>
          <div className="grid_box"><h1>ニュース</h1> <Image style={{ marginTop: "5px" }} src={"/icon/icon1.png"} width={40} height={40} alt="icon1" /></div>
        </div>
        <div className='content_news scrollbar-none'>
          {news.length ? news.map((n, index) =>
            <div key={index}>
              <h3>{moment(n?.createDate).format("YYYY.MM.DD")}</h3>
              <h3>{n?.name}</h3>
              <div className='text dangerousBox' dangerouslySetInnerHTML={{ __html: n?.content }} />
            </div>
          ) : null}
        </div>
        <div style={{ width: "90%", margin: "auto", maxWidth: "1200px" }}>
          <div style={{ width: "max-content", margin: "0 0 0 auto" }}>
            <ButtonWeb name="ニュース⼀覧" bg="#FFFDD6" icon={<KeyboardArrowRightIcon style={{ height: "30px", width: "30px", margin: "5px 5px 5px auto" }} />}
              onClick={() => toPage.push("/home/news")} />
          </div>
        </div>
      </div>
      <div className="about" style={{ background: "#FFFDD6", paddingTop: "10%" }} id="j">
        <div className="title">
          <h2>Industry  introduction</h2>
          <div className="grid_box"><h1>業界紹介</h1> <Image style={{ marginTop: "5px" }} src={"/icon/icon6.png"} width={40} height={40} alt="icon6" /></div>
        </div>
        <p className="about_text">
          手話を学び、仕事にするということは聴覚に障害のある方々とのコミュニケーションをサポートするだけでなく、全ての人々が平等に情報やサービスにアクセスできる社会を築くために欠かせない存在です。<br></br>
          <br></br>
          言語の壁を超え、心をつなぐ手段として、手話は重要なコミュニケーションの形を提供していきます。<br></br>
          <br></br>
          手話を使った通訳や指導だけでなく、サービス業、医療、教育、エンターテインメントなど、さまざまな分野で手話の活用が広がり続けています。手話の需要は今後さらに高まっていくでしょう。
          <br></br>
          <br></br>
          <b>活躍する場所</b><br></br>
          ・障がい者施設、老人福祉施設などの社会福祉施設<br></br>
          ・行政機関、医療機関などの公共サービス<br></br>
          ・接客・案内などのサービス業
        </p>
        <div className="buttons" style={{ maxWidth: "768px" }}>
          <ButtonWeb name="施設を探す" bg="#F6CA1C" color="#594a36" icon={<KeyboardArrowRightIcon style={{ width: "40px", height: "40px", padding: "5px", boxSizing: "border-box" }} />} onClick={() => toPage.push("/home#f")} />
          <ButtonWeb name="先輩たちの声を聞いてみる" bg="#e68a01" color="white" icon={<KeyboardArrowRightIcon style={{ width: "40px", height: "40px", padding: "5px", boxSizing: "border-box" }} />} onClick={() => toPage.push("/home#h")} />
        </div>
      </div>
      <div className="div_items" id="f">
        <div className="title">
          <h2> Facility Search</h2>
          <div className="grid_box"><h1>施設を探す</h1> <Image style={{ marginTop: "5px" }} src={"/icon/icon5.png"} width={40} height={40} alt="icon5" /></div>
          <div className="grid_box">
            <div className='selectbox xs12 md6 lg8  '>
              <KeyboardArrowDownIcon style={{ position: "absolute", right: "20px", top: "25px" }} onClick={() => set_areaModel(false)} />
              {_areaModel ?
                <>
                  <select onClick={() => set_areaModel(false)}>
                    <option value={undefined}>{_location || _area || "エリア"}</option>
                  </select>
                </>
                : <div style={{ height: "60px" }}></div>}
              <div className={`area ${_areaModel ? "area_none" : ""}`}>
                <div className='flexbox' style={{ background: "white", height: "60px" }}>
                  <h3 style={{ height: "100%", lineHeight: "70px", padding: "0 5px" }}>エリア</h3>
                  <CancelOutlinedIcon onClick={() => { set_areaModel(true), set_location(""), set_area("") }} />
                </div>
                <div className='flexbox'>
                  <div className='area_titles'>
                    {japanRegions.map((item, index) =>
                      <div className={`area_title ${index === _i ? "area_title_select" : ""}`} key={index} onClick={() => { set_i(index), set_area(item.region) }}>
                        {item.region}
                      </div>
                    )}
                  </div>
                  <div className='area_children'>
                    <h4 style={{ textAlign: "center", height: "30px", lineHeight: "40px" }}>{japanRegions[_i]?.region}</h4>
                    <div className='area_title' >
                      {japanRegions[_i]?.prefectures.map((item, index) =>
                        <p key={index}>{_location === item.name ?
                          <CheckBoxOutlinedIcon onClick={() => set_location("")} /> :
                          <CheckBoxOutlineBlankOutlinedIcon onClick={() => { set_location(item.name), set_areaModel(true) }} />}
                          {item.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ width: "100px", height: "60px", display: "flex", flexDirection: "column", justifyContent: "center", background: "#e68a01", borderRadius: "5px", color: "white", textAlign: "center", margin: "5px", fontWeight: "bold", cursor: "pointer" }} onClick={() => { set_areaModel(true), toPage.push(`/home/facility?area=${_area}&&location=${_location}`) }} >検索</div>
          </div>
        </div>
        <div style={{ height: "100px " }}></div>
        <div className="title">
          <h2> Facility introduction</h2>
          <div className="grid_box"><h1>施設紹介</h1> <Image style={{ marginTop: "5px" }} src={"/icon/icon4.png"} width={40} height={40} alt="icon4" /></div>
          <div className="title_button">
            <ButtonWeb name="施設⼀覧" bg="white" icon={<KeyboardArrowRightIcon style={{ height: "30px", width: "30px", margin: "5px 5px 5px auto" }} />}
              onClick={() => toPage.push("/home/facility")} />
          </div>

        </div>

        <div style={{ display: "flex", margin: "50px auto", width: "90%", maxWidth: "1200px" }}><Image style={{ marginTop: "5px" }} src={"/icon/pickup.png"} width={60} height={60} alt="pickup" /><h1 style={{ lineHeight: "60px" }}>PICK UP</h1></div>
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
                <p style={{ backgroundColor: "#FFFDD6" }}>{facility[0]?.location}</p>
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
                <p style={{ backgroundColor: "#FFFDD6" }}>{facility[1]?.location}</p>
                <KeyboardArrowRightIcon onClick={() => toPage.push("/home/facility/" + facility[1].slug)} />
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="div_items" style={{ background: "#FFFDD6" }} id="h">
        <div className="title">
          <h2>Interview</h2>
          <div className="grid_box"><h1>先輩たちの声</h1> <Image src={"/icon/icon3.png"} width={40} height={40} alt="icon3" /></div>
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
