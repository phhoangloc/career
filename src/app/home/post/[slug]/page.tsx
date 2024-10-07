'use client'
import React, { useEffect, useState } from 'react'
import DOMPurify from 'dompurify';
import Data from '@/data/data'
import Image from 'next/image'
import { NoUserAuthen } from '@/api/NoUserAuthen'
import { useRouter } from 'next/navigation';
import moment from 'moment';
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

    const toPage = useRouter()

    return (
        newData ?
            <div className='detailPage '>
                <div className='breadcum'>
                    <h4 onClick={() => toPage.push("/home")}>ホーム</h4>
                    <h4>/</h4>
                    <h4 onClick={() => toPage.back()}>仕事を探す</h4>
                </div>
                <div className="detail">
                    <div className='image'>
                        <Image src={process.env.FTP_URL + "img/career/" + newData?.image?.name} width={500} height={500} style={{ width: "100%", height: "auto" }} alt='cover' />
                    </div>
                    <h2 className='ta-center mg-100px-auto'><span>{newData.contenttitle}</span><br></br>{newData.title}</h2>
                    <div className="detail_apply apply" >
                        <div className='apply_item'><h4>職種</h4><p>{newData.worktype}</p></div>
                        <div className='apply_item'><h4>勤務地</h4><p>{newData?.workplace?.name}<br></br><span>〒{newData?.workplace?.postno}</span> <br></br><span>{newData?.workplace?.address}</span></p></div>
                        <div className='apply_item'><h4>勤務時間</h4><p>{newData.worktime}</p></div>
                        <div className='apply_item'><h4>雇⽤形態</h4><p>{newData.workstatus}</p></div>
                        <div className='apply_item'><h4>給与</h4><p>{newData.worksalary}</p></div>
                        <div className='apply_item'><h4>休⽇休暇</h4><p>{newData.workbenefit}</p></div>
                        <div className='apply_item'><h4>掲載日</h4><p>{moment(newData.startDate).format("YYYY年/MM月/DD日")}</p></div>
                        <div className='apply_item'><h4>掲載終了日</h4><p>{moment(newData.endDate).format("YYYY年/MM月/DD日")}</p></div>
                    </div>

                    <p className='button'><a href={`mailto:${newData.contact}?subject=仕事に応募します。&body=この仕事を応募したいです。よろしくお願いいたします。`}>応募はこちらから</a></p>

                    <div className='title_facility'> <p>詳細</p></div>
                    <div className='w90p mw-768px mg-auto bor-1px br-5px pd-5p' style={{ borderColor: "#006699" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(newData.content) }} />
                    <p className='button'><a href={`mailto:${newData.contact}?subject=仕事に応募します。&body=この仕事を応募したいです。よろしくお願いいたします。`}>応募はこちらから</a></p>

                </div>
            </div > : null
    )
}

export default Page