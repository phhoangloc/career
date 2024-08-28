'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NoUserAuthen } from '@/api/NoUserAuthen'
import Image from 'next/image'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Pagination from '@/component/tool/pagination'
import { formatPostNo } from './[slug]/page'

type Props = {}

const Page = (props: Props) => {
    const [refresh, setRefresh] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)
    const [notice, setNotice] = useState<string>("")

    const [id, setId] = useState<string>("")

    const toPage = useRouter()
    const [data, setData] = useState<any[]>([])
    const [search, setSearch] = useState<string>("")
    const [page, setPage] = useState<number>(0)
    const [limit, setLimit] = useState<number>(18)
    const [end, setEnd] = useState<boolean>(false)

    const [selectId, setSelectId] = useState<string[]>([])

    const getPost = async (a: string, s: string, sk: number, li: number) => {
        const result = await NoUserAuthen.getItem(a, s, "", "", "", "", sk, li)
        if (result.success) {
            setData(result.data)
            setLoading(false)
        } else {
            setData([])
            setNotice(result.message)
            setLoading(false)
        }
    }
    const getPost_v2 = async (a: string, s: string, sk: number, li: number) => {
        const result = await NoUserAuthen.getItem(a, s, "", "", "", "", sk, li)
        if (result.success) {
            setEnd(result.data.length ? false : true)
        }
    }

    useEffect(() => {
        getPost("facility", search, page * limit, limit)
        getPost_v2("facility", search, (page + 1) * limit, limit)
    }, [refresh, search, page])

    return (
        <div className='archivePage'>
            <div className="div_items" id="f">
                <div className="title">
                    <h2> Facility introduction</h2>
                    <h1>施設紹介</h1>
                </div>

                <div className="items grid_box" >
                    {
                        loading ? <p>Loading...</p> :
                            data?.length ? data?.map((d: any, index: number) =>
                                <div key={index} className='item xs12 md6'>
                                    <div className="item_frame " onClick={() => toPage.push("/home/facility/" + d?.slug)} >
                                        <div className="cover">
                                            {d?.image?.name ?
                                                <Image src={process.env.FTP_URL + "img/career/" + d?.image?.name} width={500} height={500} style={{ width: "auto", height: "100%" }} alt="home" /> :
                                                <Image src={"/img/home.jpg"} fill style={{ objectFit: "cover" }} alt="home" />}</div>
                                        <div className="item_title">
                                            <h3>{d.name}</h3>
                                            <p>〒{formatPostNo(d.postno)}</p>
                                            <p>{d.address.split("　")[0]}</p>
                                            <p>{d.address.split("　")?.[1] ? d.address.split("　")?.[1] : "---"}</p>
                                            <div className="tag">
                                                <p>{d?.location}</p>
                                                <KeyboardArrowRightIcon />
                                            </div>
                                        </div>
                                    </div>
                                </div>) : null
                    }

                </div>
                <Pagination page={page} next={() => { toPage.push("#"), setPage(p => p + 1) }} prev={() => { toPage.push("#"), setPage(p => p - 1) }} end={end} />
            </div>
        </div>
    )
}

export default Page