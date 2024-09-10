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
type Props = {
    params: { slug: string[] }
}

const Page = ({ params }: Props) => {


    const bodySearch = {
        s: decodeURIComponent(params.slug[0]) === "n" ? "" : decodeURIComponent(params.slug[0]),
        wp: decodeURIComponent(params.slug[1]) === "a" ? "" : decodeURIComponent(params.slug[1]),
        wt: decodeURIComponent(params.slug[2]) === "b" ? "" : decodeURIComponent(params.slug[2]),
        ws: decodeURIComponent(params.slug[3]) === "s" ? "" : decodeURIComponent(params.slug[3]),
        lo: decodeURIComponent(params.slug[4]) === "c" ? [""] : decodeURIComponent(params.slug[4]).split(",")
    }

    const [newData, setNewData] = useState<any[]>([])
    const filter = (a: string, b: string, s: string, c: string) => {
        var resultA = a !== "a" ? Data.filter(item => item.workplaces.name === a) : Data
        var resultB = b !== "b" ? resultA.filter(item => item.worktypes === b) : resultA
        var resultS = s !== "s" ? resultA.filter(item => item.workstatus === s) : resultB
        var result = c !== "c" ? resultS.filter(item => c.split(',').includes(item.location)) : resultS
        setNewData(result)

    }

    const [page, setPage] = useState<number>(0)
    const [limit, setLimit] = useState<number>(10)
    const [end, setEnd] = useState<boolean>(false)
    const [number, setNumber] = useState<number>(0)
    const getItem = async (a: string, s: string, wp: string, wt: string, ws: string, lo: string, skip: number, limit: number) => {
        const result = await NoUserAuthen.getItem(a, s, wp, wt, ws, lo, skip, limit)
        console.log(result)
        if (result.success) {
            setNewData(data => [...data, ...result.data])
        }
    }

    useEffect(() => {
        bodySearch.lo.forEach(l => {
            getItem("post", bodySearch.s, bodySearch.wp, bodySearch.wt, bodySearch.ws, l, page * limit, limit)
        });
    }, [])

    const toPage = useRouter()

    const uniqueArray = Array.from(new Set(newData.map(obj => JSON.stringify(obj)))).map(str => JSON.parse(str));


    return (
        <div className='searchPage'>
            <div className="div_items div_items_bg_blue">
                <SearchTool />
            </div>
            <div className='title'>
                <h1>検索結果</h1>
                <h2>--- {uniqueArray.length} ---</h2>
                <p style={{ height: "30px" }}></p>
            </div>

            <div className={`content`}>
                {newData.length ?
                    uniqueArray.map((item, index) =>
                        <div key={index} className='item'>
                            <div className="item-col">
                                <h2>{item.workplace?.name}</h2>
                                <h4>〒{item.workplace?.postno}</h4>
                                <h3>{item.workplace?.address.split("　")[0]}</h3>
                                <h3>{item.workplace?.address.split("　")[1] ? item.workplace?.address.split("　")[1] : ""}</h3>
                                <p>{item.workplace?.location}</p>
                                <div className='item-content'>
                                    <h3>{item.title}</h3>
                                    <p>{item.contenttitle}</p>
                                    <div style={{ paddingTop: "10px", margin: "10px 10px 0px 0px", borderTop: "1px solid #aaa" }}>
                                        <h4>職種：<span>{item.worktype}</span></h4>
                                        <h4>雇用形態：<span>{item.workstatus}</span></h4>
                                        <h4>通勤時間：<span>{item.worktime}</span></h4>
                                        <h4>有給休暇：<span>{item.workbenefit}</span></h4>
                                        <h4>月給：<span>{item.worksalary}</span></h4>
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