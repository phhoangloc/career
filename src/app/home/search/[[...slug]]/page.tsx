'use client'
import React, { useEffect, useState } from 'react'
import Data from '@/data/data'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import SearchTool from '@/component/searchTool'
import SearchIcon from '@mui/icons-material/Search';
import '../../../../style/grid.css'
import { NoUserAuthen } from '@/api/NoUserAuthen'
import Button from '@/component/input/button'
import Pagination from '@/component/tool/pagination'
import moment from 'moment'
import { jpyFormatter } from '@/lib/currency'
type Props = {
    params: { slug: string[] }
}

const Page = ({ params }: Props) => {

    const bodySearch = {
        s: decodeURIComponent(params.slug[0]) === "n" ? "" : decodeURIComponent(params.slug[0]),
        wp: decodeURIComponent(params.slug[1]) === "a" ? "" : decodeURIComponent(params.slug[1]),
        wt: decodeURIComponent(params.slug[2]) === "b" ? "" : decodeURIComponent(params.slug[2]),
        ws: decodeURIComponent(params.slug[3]) === "s" ? "" : decodeURIComponent(params.slug[3]),
        lo: decodeURIComponent(params.slug[4]) === "c" ? [""] : decodeURIComponent(params.slug[4]).split(","),
        lis: decodeURIComponent(params.slug[5]) === "lis" ? "" : decodeURIComponent(params.slug[5]),

    }

    const [newData, setNewData] = useState<any[]>([])
    const [newDataByStartDate, setNewDataByStartDate] = useState<any[]>([])

    const [page, setPage] = useState<number>(0)
    const [limit, setLimit] = useState<number>(10)
    const [end, setEnd] = useState<boolean>(false)
    const [number, setNumber] = useState<number>(0)
    const [_startDate, set_startDate] = useState<number>(0)
    const [_salary, set_salary] = useState<number>(0)

    const today = new Date()

    const getItem = async (a: string, s: string, wp: string, wt: string, ws: string, lo: string, skip: number, limit: number, lis: string, _startDate: number, salary: number) => {
        const result = await NoUserAuthen.getItem(a, s, wp, wt, ws, lo, skip, limit, undefined, undefined, lis, _startDate, 0, salary)
        if (result.success) {
            setNewData(data => [...data, ...result.data])
            // result.data.map((r: any) => {
            //     setNewData(data => [...data.filter(d => d._id !== r._id), r])
            // })

        }
    }

    useEffect(() => {
        bodySearch.lo.forEach(l => {
            getItem("post", bodySearch.s, bodySearch.wp, bodySearch.wt, bodySearch.ws, l, page * limit, limit, bodySearch.lis, _startDate, _salary)
        });
    }, [_startDate, _salary])

    const toPage = useRouter()

    const uniqueArray = Array.from(new Set(newData.map(obj => JSON.stringify(obj)))).map(str => JSON.parse(str))

    return (
        <div className='searchPage'>
            <div className="div_items div_items_bg_blue">
                <SearchTool body={bodySearch} />
            </div>
            <div className='title'>
                <h1>検索結果</h1>
                <h2>--- {uniqueArray.length} ---</h2>
                <p style={{ height: "30px" }}></p>
            </div>

            <div className={`content`}>
                <div style={{ display: "flex", gap: "4px" }}>

                    <select onChange={(e) => { setNewData([]), set_startDate(Number(e.currentTarget.value)) }} style={{ width: "150px", height: "40px", borderRadius: "5px" }}>
                        <option value={undefined}>{"掲載日"}</option>
                        <option value={1}>{"24時間以内"}</option>
                        <option value={3}>{"3日以内"}</option>
                        <option value={7}>{"7日以内"}</option>
                        <option value={14}>{"１４日以内"}</option>
                    </select>
                    <select onChange={(e) => { setNewData([]), set_salary(Number(e.currentTarget.value)) }} style={{ width: "150px", height: "40px", borderRadius: "5px" }}>
                        <option value={undefined}>{"月給"}</option>
                        <option value={10000}>{"10万~"}</option>
                        <option value={20000}>{"20万~"}</option>
                        <option value={30000}>{"30万~"}</option>
                        <option value={40000}>{"40万以上"}</option>
                    </select>
                </div>

                {uniqueArray.length ?
                    uniqueArray.map((item, index) =>
                        <div key={index} className='item'>
                            <div className="item-col">
                                <h3 style={{ fontSize: "90%", opacity: 1 }}><span style={{ fontSize: "75%", opacity: "0.5" }}>掲載日:</span>　{moment(item.startDate).format("YYYY年/MM月/DD日")}</h3>
                                <h3 style={{ fontSize: "90%", opacity: 1 }}><span style={{ fontSize: "75%", opacity: "0.5" }}>掲載終了日:</span>　{moment(item.endDate).format("YYYY年/MM月/DD日")}</h3>
                                <h2>{item.workplace?.name}</h2>
                                <h4>〒{item.workplace?.postno}</h4>
                                <h3>{item.workplace?.address.split("　")[0]}</h3>
                                <h3>{item.workplace?.address.split("　")[1] ? item.workplace?.address.split("　")[1] : ""}</h3>
                                <p>{item.workplace?.location}</p>
                                <div className='item-content'>
                                    <h3>{item.title}</h3>
                                    <p>{item.contenttitle}</p>
                                    <div style={{ paddingTop: "10px", margin: "10px 10px 0px 0px", borderTop: "1px solid #aaa" }}>
                                        <h4>職種：{item.worktype.split(",").map((wt: string, index: string) => <span style={{ display: "block", paddingLeft: "12px" }} key={index}>{wt}</span>)}</h4>
                                        <h4>雇用形態：{item.workstatus.split(",").map((wt: string, index: string) => <span style={{ display: "block", paddingLeft: "12px" }} key={index}>{wt}</span>)}</h4>
                                        <h4>通勤時間：<span>{item.worktime}</span></h4>
                                        <h4>有給休暇：<span>{item.workbenefit}</span></h4>
                                        <h4>月給：<span>{jpyFormatter.format(item.worksalary)}</span></h4>
                                    </div>
                                </div>
                            </div>
                            <div className="item-col item-img">
                                {item.workplace?.image?.name ?
                                    <Image src={process.env.FTP_URL + "img/career/" + item.workplace?.image?.name} fill style={{ objectFit: "cover" }} alt="home" /> :
                                    <Image src={"/img/home.jpg"} fill style={{ objectFit: "cover" }} alt="home" />}
                            </div>

                            <div className='button'>
                                <Button name='詳細を見る' onClick={() => toPage.push("/home/post/" + item.slug)} />
                            </div>
                        </div>
                    ) :
                    <div>
                        <h2 style={{ textAlign: "center" }}>結果がありません。</h2>
                    </div>}
            </div>

            <Pagination page={page} next={() => setPage(p => p + 1)} prev={() => setPage(p => p - 1)} end={true} />
        </div >
    )
}

export default Page