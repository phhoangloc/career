'use client'
import React, { useEffect, useState } from 'react'
import Data from '@/data/data'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import SearchTool from '@/component/searchTool'
import SearchIcon from '@mui/icons-material/Search';
import Button from '@/component/input/button'
type Props = {
    params: { slug: string[] }
}

const Page = ({ params }: Props) => {


    const bodySearch = {
        wp: decodeURIComponent(params.slug[0]),
        wt: decodeURIComponent(params.slug[1]),
        wst: decodeURIComponent(params.slug[2]),
        lo: decodeURIComponent(params.slug[3])
    }



    const [newData, setNewData] = useState<any[]>([])
    const filter = (a: string, b: string, s: string, c: string) => {
        var resultA = a !== "a" ? Data.filter(item => item.workplaces === a) : Data
        var resultB = b !== "b" ? resultA.filter(item => item.worktypes === b) : resultA
        var resultS = s !== "s" ? resultA.filter(item => item.workstatus === s) : resultB
        var result = c !== "c" ? resultS.filter(item => c.split(',').includes(item.location)) : resultS
        setNewData(result)

    }

    useEffect(() => {
        filter(bodySearch.wp, bodySearch.wt, bodySearch.wst, bodySearch.lo)
    }, [])

    const toPage = useRouter()

    const [searchModal, setSearchModal] = useState<boolean>(false)
    return (
        <div className='searchPage'>
            <div className={`searchPage_max ${searchModal ? "searchPage_max_open" : ""}`}>
                <div className='search_tool_div'>
                    <SearchTool />
                </div>
                <div className='result_div'>
                    <div className='title'>
                        <h1>検索結果</h1>
                        <div style={{ width: "max-content", margin: "0px auto 10px" }}>
                            <Button name='検索' onClick={() => setSearchModal(!searchModal)} />
                        </div>
                    </div>
                    {newData.length ?
                        newData.map((item, index) =>
                            <div key={index} className='item flexbox' style={{ cursor: "pointer" }} onClick={() => toPage.push("/home/" + item.archive + "/" + item.slug)}>
                                <div className='image' style={{
                                    position: "relative",
                                }}>
                                    <Image src={item.image} fill
                                        style={{
                                            objectFit: 'cover',
                                        }}
                                        alt="cover" />
                                </div>
                                <div className='content'>
                                    <h4>{item.name}・{item.location}</h4>
                                    <li>{item.workplaces}</li>
                                    <li>{item.worktypes}</li>
                                    <li>{item.location}</li>
                                    <p>{item.contain[0].sort}</p>
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