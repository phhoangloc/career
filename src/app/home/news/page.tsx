'use client'
import React, { useEffect, useState } from 'react'
// import Data from '@/data/data'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
// import SearchTool from '@/component/searchTool'
import SearchIcon from '@mui/icons-material/Search';
// import '../../../../style/grid.css'
import { NoUserAuthen } from '../../../api/NoUserAuthen'
import Button from '../../../component/input/button'
import Pagination from '../../../component/tool/pagination'
import moment from 'moment'
type Props = {}

const Page = ({ }: Props) => {

    const [newData, setNewData] = useState<any[]>([])

    const [page, setPage] = useState<number>(0)
    const [limit, setLimit] = useState<number>(10)
    const [end, setEnd] = useState<boolean>(true)
    const [number, setNumber] = useState<number>(0)
    const getItem = async (a: string, s: string, wp: string, wt: string, ws: string, lo: string, skip: number, limit: number) => {
        const result = await NoUserAuthen.getItem(a, s, wp, wt, ws, lo, skip, limit)
        if (result.success) {
            setNewData(result.data)
        }
    }
    const getItemPlus = async (a: string, s: string, wp: string, wt: string, ws: string, lo: string, skip: number, limit: number) => {
        const result = await NoUserAuthen.getItem(a, s, wp, wt, ws, lo, skip, limit)
        if (result.success && result.data.length) {
            setEnd(false)
        } else {
            setEnd(true)
        }
    }
    useEffect(() => {
        getItem("news", "", "", "", "", "", page * limit, limit)
        getItemPlus("news", "", "", "", "", "", (page + 1) * limit, limit)
    }, [])

    const toPage = useRouter()


    console.log(newData)
    return (
        <div className='archivePage'>
            <div className="div_items">
                <div className="title">
                    <h2>News</h2>
                    <h1>ニュース</h1>
                </div>
                <div className="items" >

                    {
                        newData?.length ? newData.map((n, index) =>
                            <div key={index} style={{ padding: "20px 5px", borderBottom: "1px dashed #aaa", cursor: "pointer" }} onClick={() => toPage.push('/home/news/' + n.slug)}>
                                <h2>{n.name}</h2>
                                <p>{moment(n.createDate).format("YYYY/MM/DD")}</p>
                            </div>) : null
                    }
                </div >
                <div style={{ marginTop: "50px" }}>
                    <Pagination next={() => setPage(p => p + 1)} prev={() => setPage(p => p - 1)} end={end} page={page} />
                </div>
            </div >
        </div >
    )
}

export default Page