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
    const [image, setImage] = useState<string>("")

    const [imagePreview, setImagePreview] = useState<string>("")
    const getItem = async (a: string, s: string,) => {
        const result = await NoUserAuthen.getOneItem(a, s)
        if (result.success) {
            setNewData(result.data[0])
            setImage(result.data[0].image)
        }
    }

    useEffect(() => {
        getItem("post", params.slug)
    }, [])

    // const newData = Data.filter(item => item.slug === params.slug)[0]
    const GetPicturePreview = async (id: string) => {
        const result = await NoUserAuthen.getPicById(id)
        console.log(result)
        if (result.success) {
            setImagePreview(result.data[0].name)
        }
    }

    useEffect(() => {
        image && GetPicturePreview(image)
    }, [image])

    return (
        <div className='detailPage'>
            <div className="detail">
                <div className='image'>
                    <Image src={process.env.FTP_URL + "upload/" + imagePreview} width={500} height={500} style={{ width: "100%", height: "auto" }} alt='cover' />
                </div>
                <div className='content'>
                    <h2>{newData.title}</h2>
                    <li>{newData.workplace}</li>
                    <li>{newData.worktype}</li>
                    <li>{newData.location}</li>
                    <div className='text' dangerouslySetInnerHTML={{ __html: newData.content }} />
                </div>

            </div>
        </div>
    )
}

export default Page