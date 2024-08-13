'use client'
import React, { useEffect, useState } from 'react'
import Data from '@/data/data'
import Image from 'next/image'
import { NoUserAuthen } from '@/api/NoUserAuthen'
import DOMPurify from 'dompurify'
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

    console.log(newData)
    return (
        newData ?
            <div className='detailPage'>
                <div className="detail">
                    <div className='content'>
                        <h2>{newData.name}</h2>
                        <div style={{ display: "flex" }}>
                            {
                                newData?.category ? newData.category?.map((item: any, index: number) => <p key={index} style={{ margin: "0px 5px 0px 0px" }}>{item.name}</p>) : null
                            }
                        </div>
                        <div className='text dangerousBox' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(newData.content) }} />
                    </div>
                </div>
            </div> : null
    )
}

export default Page