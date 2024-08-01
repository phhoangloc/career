'use client'
import React, { useEffect, useState } from 'react'
import Data from '@/data/data'
import Image from 'next/image'
import { NoUserAuthen } from '@/api/NoUserAuthen'
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
        getItem("post", params.slug)
    }, [])

    return (
        newData ?
            <div className='detailPage'>
                <div className="detail">
                    <div className='image'>
                        <Image src={process.env.FTP_URL + "img/career/" + newData?.image?.name} width={500} height={500} style={{ width: "100%", height: "auto" }} alt='cover' />
                    </div>
                    <div className='content'>
                        <h2>{newData.title}</h2>
                        <li>{newData.workplace}</li>
                        <li>{newData.worktype}</li>
                        <li>{newData.location}</li>
                        <div className='text dangerousBox' dangerouslySetInnerHTML={{ __html: newData.content }} />
                    </div>

                </div>
            </div> : null
    )
}

export default Page