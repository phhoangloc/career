'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NoUserAuthen } from '@/api/NoUserAuthen'
import Image from 'next/image'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Pagination from '@/component/tool/pagination'
import { japanRegions } from '@/lib/area'
const formatPostNo = (input: string) => {
    if (input) {
        const digits = input.replace(/\D/g, '');

        if (digits.length === 7) {
            return digits.replace(/(\d{3})(\d{4})/, '$1-$2');
        }
    }
}

type Props = {}

const Page = (props: Props) => {
    const [refresh, setRefresh] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)
    const [notice, setNotice] = useState<string>("")

    const [id, setId] = useState<string>("")

    const toPage = useRouter()
    const [allData, setAllData] = useState<any[]>([])
    const [data, setData] = useState<any[]>([])
    const [search, setSearch] = useState<string>("")
    const [area, setArea] = useState<string>("")
    const [location, setLocation] = useState<string>("")
    const [page, setPage] = useState<number>(0)
    const [limit, setLimit] = useState<number>(18)
    const [end, setEnd] = useState<boolean>(false)
    const [endPlusOne, setEndPlusOne] = useState<boolean>(false)

    const [selectId, setSelectId] = useState<string[]>([])

    const getPost = async (a: string, s: string, sk: number, li: number, area: string, lo: string) => {
        const result = await NoUserAuthen.getItem(a, s, "", "", "", lo, sk, li, area)
        if (result.success) {
            setData(result.data)
            setLoading(false)
        } else {
            setData([])
            setNotice(result.message)
            setLoading(false)
        }
    }
    const getPost_v2 = async (a: string, s: string, sk: number, li: number, area: string, lo: string) => {
        const result = await NoUserAuthen.getItem(a, s, "", "", "", lo, sk, li, area)
        if (result.success) {
            setEnd(result.data.length ? false : true)
        }
    }
    const getPost_v3 = async (a: string, s: string, sk: number, li: number, area: string, lo: string) => {
        const result = await NoUserAuthen.getItem(a, s, "", "", "", lo, sk, li, area)
        if (result.success) {
            setEndPlusOne(result.data.length ? true : false)
        }
    }
    useEffect(() => {
        getPost("interview", search, page * limit, limit, area, location)
        getPost_v2("interview", search, (page + 1) * limit, limit, area, location)
        getPost_v3("interview", search, (page + 2) * limit, limit, area, location)
    }, [refresh, search, page, area, location])


    const getAllPost = async (a: string,) => {
        const result = await NoUserAuthen.getItem(a, "", "", "", "", "", undefined, undefined,)
        if (result.success) {
            setAllData(result.data)
        } else {
            setAllData([])
            setNotice(result.message)
        }
    }
    useEffect(() => {
        getAllPost("interview")
    }, [])

    return (
        <div className='archivePage'>
            <div className="div_items">
                <div className="title">
                    <h2>Interview</h2>
                    <h1>先輩たちの声</h1>
                </div>

                <div className="items grid_box" >
                    {
                        loading ? <p>Loading...</p> :
                            data?.length ? data?.map((d: any, index: number) =>
                                <div key={index} className='item xs12 md6'>
                                    <div className="item_frame "  >
                                        <div className="cover" onClick={() => toPage.push("/home/interview/" + d?.slug)}>
                                            {d?.image?.name ?
                                                <Image src={process.env.FTP_URL + "img/career/" + d?.image?.name} width={500} height={500} style={{ width: "auto", height: "100%" }} alt="home" /> :
                                                <Image src={"/img/home.jpg"} fill style={{ objectFit: "cover" }} alt="home" />}</div>
                                        <div className="item_title">
                                            <h3 style={{ marginBottom: "5px" }}>{d?.name}</h3>
                                            <h3 style={{ opacity: "0.75" }}>{d?.workplace?.name}</h3>
                                            <h4 style={{ opacity: "0.75" }}>{d?.workplace?.address?.split("　")[0]}</h4>
                                            <p style={{ opacity: "0.75" }}>{d?.workplace?.address?.split("　")[1] ? d.workplace.address.split("　")[1] : "---"}</p>
                                            <p style={{ marginTop: "10px" }}><i>{d.contenttitle}</i></p>
                                            <div className="tag">
                                                {d?.workplace?.location ? <p onClick={() => { setPage(0), setLocation(""); setArea(d?.area) }}>{d?.workplace?.location}</p> : ""}
                                                {/* <p onClick={() => { setPage(0), setLocation(d?.location) }}>{d?.location}</p> */}
                                                <KeyboardArrowRightIcon onClick={() => toPage.push("/home/interview/" + d?.slug)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>) : null
                    }

                </div>
                <Pagination page={page} next={() => { toPage.push("#"), setPage(p => p + 1) }} prev={() => { toPage.push("#"), setPage(p => p - 1) }} end={end} onClick={(p) => { toPage.push("#"), setPage(p) }} end2={endPlusOne} />
            </div>
        </div>
    )
}

export default Page