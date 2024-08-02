'use client'
import React, { useEffect, useState } from 'react'
import Data from '@/data/data'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import SearchTool from '@/component/searchTool'
import SearchIcon from '@mui/icons-material/Search';
import '../../../../style/grid.css'
import { NoUserAuthen } from '@/api/NoUserAuthen'
type Props = {
    params: { slug: string[] }
}

const Page = ({ params }: Props) => {


    const bodySearch = {
        wp: decodeURIComponent(params.slug[0]) === "a" ? "" : decodeURIComponent(params.slug[0]),
        wt: decodeURIComponent(params.slug[1]) === "b" ? "" : decodeURIComponent(params.slug[1]),
        ws: decodeURIComponent(params.slug[2]) === "s" ? "" : decodeURIComponent(params.slug[2]),
        lo: decodeURIComponent(params.slug[3]) === "c" ? [""] : decodeURIComponent(params.slug[3]).split(",")
    }

    const [newData, setNewData] = useState<any[]>([])
    const filter = (a: string, b: string, s: string, c: string) => {
        var resultA = a !== "a" ? Data.filter(item => item.workplaces === a) : Data
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
            setNewData(result.data)
        }
    }

    useEffect(() => {
        bodySearch.lo.forEach(l => {
            getItem("post", "", bodySearch.wp, bodySearch.wt, bodySearch.ws, l, page * limit, limit)
        });
    }, [])

    const toPage = useRouter()

    const [searchModal, setSearchModal] = useState<boolean>(false)

    const uniqueArray = Array.from(new Set(newData.map(obj => JSON.stringify(obj)))).map(str => JSON.parse(str));


    return (
        <div className='searchPage'>
            <div className="div_items div_items_bg_blue">
                <SearchTool />
            </div>
            <div className={`searchPage_max ${searchModal ? "searchPage_max_open" : ""}`}>
                <div className='result_div'>
                    <div className='title'>
                        <h1>検索結果</h1>
                        <div className='button_Search'>
                            <SearchIcon onClick={() => setSearchModal(true)} />
                        </div>
                    </div>
                    {newData.length ?
                        uniqueArray.map((item, index) =>
                            <div key={index} className='item flexbox' style={{ cursor: "pointer" }} onClick={() => toPage.push("/home/" + item.archive + "/" + item.slug)}>
                                <div className='image' style={{
                                    position: "relative",
                                }}>
                                    <Image src={process.env.FTP_URL + "img/career/" + item.image.name} fill
                                        style={{
                                            objectFit: 'cover',
                                        }}
                                        alt="cover" />
                                </div>
                                <div className='content'>
                                    <h4>{item.title}・{item.location}</h4>
                                    <li>{item.workplace.name}</li>
                                    <li>{item.worktype}</li>
                                    <li>{item.workstatus}</li>
                                    <li>{item.location}</li>
                                </div>
                            </div>
                        ) :
                        <div>
                            <h2 style={{ textAlign: "center" }}>結果がありません。</h2>
                        </div>}
                </div>
            </div>
        </div>
    )
}

export default Page