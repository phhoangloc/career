'use client'
import React, { useEffect, useState } from 'react'
import DOMPurify from 'dompurify';
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
            <div className='detailPage facilityPage'>
                <div className="detail">
                    <div className='image'>
                        <Image src={process.env.FTP_URL + "img/career/" + newData?.image?.name} width={500} height={500} style={{ width: "100%", height: "auto" }} alt='cover' />
                    </div>
                    <h2 className='ta-center mg-100px-auto'>{newData.title}</h2>
                    <div className="detail apply" >
                        <div style={{ display: "flex" }}><h4>仕事内容</h4><p>{newData.worktype}<br></br>{newData.contenttitle}</p></div>
                        <div style={{ display: "flex" }}><h4>応募資格</h4><p>本文本文本文本文本文本文本文本文<br></br>本文本文本文本文本文本文本文本文</p></div>
                        <div style={{ display: "flex" }}><h4>雇⽤形態</h4><p>{newData.workstatus}</p></div>
                        <div style={{ display: "flex" }}><h4>勤務地</h4><p><span>{newData?.workplace?.name}</span><br></br><span>〒{newData?.workplace?.postno}</span> <br></br>{newData?.workplace?.address}</p></div>
                        <div style={{ display: "flex" }}><h4>勤務時間</h4><p>{newData.worktime}</p></div>
                        <div style={{ display: "flex" }}><h4>給与</h4><p>{newData.worksalary}</p></div>
                        <div style={{ display: "flex" }}><h4>休⽇休暇</h4><p>{newData.workbenefit}</p></div>
                        <p className='button'>応募はこちらから</p>
                    </div>

                    <div className='title_facility'> <p>詳細</p></div>
                    <div className='w90p mw-768px mg-auto bor-1px br-5px pd-5p' style={{ borderColor: "#006699" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(newData.content) }} />
                </div>
            </div> : null
    )
}

export default Page