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
import Button from "@/component/input/button";
export default function Home() {

  const [data, setdata] = useState<any[]>([])
  const [facility, setFacility] = useState<any[]>([])
  const [news, setNews] = useState<any[]>([])

  const [hover, setHover] = useState<boolean>(false)
  const [coverItem, setCovetItem] = useState<number>(0)

  const [_i, set_i] = useState<number>(-1)
  const [_location, set_location] = useState<string>("")
  const [_area, set_area] = useState<string>("")
  const [_areaModel, set_areaModel] = useState<boolean>(false)

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
          <h1>ニュース</h1>
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
          <h1>業界紹介</h1>
        </div>
        <p className="about_text">
          手話を学んだ人が就職できる主な場所は、次のようなとおりです。<br></br>
          自治体などの行政機関、福祉関連の施設、手話通訳派遣センター、聴覚障がい者団体、社会福祉協議会、聴覚障がい者情報提供施設、自治体などでの手話講師、手話通訳士は、聴覚障がい者のコミュニケーションを支える仕事なので、聴覚障がい者が誰かと話したり、誰かの話を聞いたりといった状況が発生するあらゆる場所で仕事をすることになります。<br></br>
          手話通訳士として働くには、手話通訳士試験に合格し、社会福祉法人聴力障害者情報文化センターに登録する必要があります。受験資格は20歳以上で、3年程度の手話通訳経験を有することが受験の目安になっています。<br></br>
          また、手話技能検定は就職（職業）のための資格ではないため、合格＝就職というわけではありませんが、ホテルやデパート、航空会社などのサービス業や、医療・福祉関係などでは手話を使ったサービスを行っている企業もあります。</p>
        <div className="buttons" style={{ maxWidth: "768px" }}>
          <ButtonWeb name="施設を探す" bg="#F6CA1C" color="#594a36" icon={<KeyboardArrowRightIcon style={{ width: "40px", height: "40px", padding: "5px", boxSizing: "border-box" }} />} onClick={() => toPage.push("/home#f")} />
          <ButtonWeb name="先輩たちの声を聞いてみる" bg="#e68a01" color="white" icon={<KeyboardArrowRightIcon style={{ width: "40px", height: "40px", padding: "5px", boxSizing: "border-box" }} />} onClick={() => toPage.push("/home#h")} />
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
          {/* <div className="xs12 lg7">
            <div style={{ width: "100%", height: "max-content" }}>
              <div className='dp-flex'>
                <select style={{ width: "100px", height: "40px", margin: "0 5px" }} onChange={(e) => set_location(e.target.value)}>
                  <option value="">都道府県</option>
                  {japanPrefectures.map((p, index) => <option key={index}>{p.name}</option>)}
                </select>
                <select style={{ width: "100px", height: "40px", margin: "0 5px" }} onChange={(e) => set_area(e.target.value)}>
                  <option value="">エリア</option>
                  {japanRegions.map((r, index) => <option key={index}>{r.region}</option>)}
                </select>
                <button style={{ width: "100px", background: "white", cursor: "pointer" }} onClick={() => toPage.push(`/home/facility?area=${_area}&&location=${_location}`)}>検索</button>
              </div>
            </div>
          </div> */}
          <div className='selectbox xs12 md6 lg8  '>
            <KeyboardArrowDownIcon style={{ position: "absolute", right: "20px", top: "25px" }} onClick={() => set_areaModel(false)} />
            {_areaModel ?
              <>
                <select onClick={() => set_areaModel(false)}>
                  <option value={undefined}>エリア</option>
                </select>
                {/* {lo.map((item, index) => <li style={{ fontWeight: "normal", fontSize: "1rem", lineHeight: 1.5, marginTop: "10px" }} key={index}>{item}</li>)} */}
                {/* {body.lo.map((item: any, index: number) => <li style={{ fontWeight: "normal", fontSize: "1rem", lineHeight: 1.5, marginTop: "10px" }} key={index}>{item}</li>)} */}
              </>
              : null}
            <div className={`area ${_areaModel ? "area_none" : ""}`}>
              <div className='flexbox' style={{ background: "white", height: "60px" }}>
                <h3 style={{ height: "100%", lineHeight: "70px", padding: "0 5px" }}>エリア</h3>
                <CancelOutlinedIcon onClick={() => { set_areaModel(true) }} />
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
                        <CheckBoxOutlineBlankOutlinedIcon onClick={() => set_location(item.name)} />}
                        {item.name}</p>
                    )}
                  </div>
                  <div style={{ position: "absolute", bottom: "5px", right: "5px", width: "max-content", height: "max-content" }}><Button name="検索" onClick={() => { set_areaModel(false), toPage.push(`/home/facility?area=${_area}&&location=${_location}`) }} /></div>
                </div>
              </div>
            </div>
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
