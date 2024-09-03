'use client'
import React, { useEffect, useState } from 'react'
import Data from '@/data/data'
import Image from 'next/image'
import { NoUserAuthen } from '@/api/NoUserAuthen'
import { useRouter } from 'next/navigation'
type Props = {
    params: { slug: string }
}

const Page = ({ params }: Props) => {

    const [newData, setNewData] = useState<any>({})
    const demo = params.slug[1]

    const getItem = async (a: string, s: string,) => {
        const result = await NoUserAuthen.getOneItem(a, s)
        if (result.success) {
            setNewData(result.data[0])
        }
    }

    useEffect(() => {
        getItem("news", params.slug)
    }, [])

    const toPage = useRouter()
    return (
        newData ?
            <div className='detailPage'>
                <div className='breadcum'>
                    <h4 onClick={() => toPage.push("/home")}>ホーム</h4>
                    <h4>/</h4>
                    <h4 onClick={() => toPage.push("/home/news")}>ニュース</h4>
                </div>
                <div className="detail">
                    <div className='content_news'>
                        <h2>{newData.name}</h2>
                        <div className='category'>
                            {
                                newData?.category ? newData.category?.map((item: any, index: number) => <p key={index} style={{ margin: "0px 5px 0px 0px" }}>{item.name}</p>) : null
                            }
                        </div>
                        <div className='text dangerousBox' dangerouslySetInnerHTML={{ __html: newData.content }} />
                    </div>
                </div>
            </div> : null
    )
}

export default Page