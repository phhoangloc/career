'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { NoUserAuthen } from '@/api/NoUserAuthen'
import HomeIcon from '@mui/icons-material/Home';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useRouter } from 'next/navigation';
import DOMPurify from 'dompurify';
import Link from 'next/link';
type Props = {
    params: { slug: string }
}
const formatPostNo = (input: string) => {
    if (input) {
        const digits = input.replace(/\D/g, '');

        if (digits.length === 7) {
            return digits.replace(/(\d{3})(\d{4})/, '$1-$2');
        }
    }
}
const Page = ({ params }: Props) => {

    const [newData, setNewData] = useState<any>({})

    const getItem = async (a: string, s: string,) => {
        await NoUserAuthen.getItem("image", "", "", "", "", "", undefined, undefined)
        const result = await NoUserAuthen.getOneItem(a, s)
        if (result.success) {
            setNewData(result.data[0])
        }
    }

    useEffect(() => {
        getItem("facility", params.slug)
    }, [])

    const toPage = useRouter()



    return (
        newData._id ?
            <div className='detailPage facilityPage'>
                <div className="detail">
                    <div className='breadcum'>
                        <h4 onClick={() => toPage.push("/home")}>home</h4>
                        <h4>/</h4>
                        <h4 onClick={() => toPage.push("/home/facility")}>facility</h4>
                    </div>
                </div>
                {newData.work.length ?
                    <>
                        <div className='title_facility'>
                            <p>募集要項</p>
                        </div>
                        {
                            newData.work.map((wo: any, index: number) =>
                                <div className="detail apply" key={index}>
                                    <div style={{ display: "flex" }}><h4>仕事内容</h4><p>{wo.worktype}<br></br>{wo.contenttitle}</p></div>
                                    <div style={{ display: "flex" }}><h4>応募資格</h4><p>本文本文本文本文本文本文本文本文<br></br>本文本文本文本文本文本文本文本文</p></div>
                                    <div style={{ display: "flex" }}><h4>雇⽤形態</h4><p>{wo.workstatus}</p></div>
                                    <div style={{ display: "flex" }}><h4>勤務地</h4><p><span>〒{newData.postno}</span> <br></br>{newData.address}</p></div>
                                    <div style={{ display: "flex" }}><h4>勤務時間</h4><p>{wo.worktime}</p></div>
                                    <div style={{ display: "flex" }}><h4>給与</h4><p>{wo.worksalary}</p></div>
                                    <div style={{ display: "flex" }}><h4>休⽇休暇</h4><p>{wo.workbenefit}</p></div>
                                    <p className='button'>応募はこちらから</p>
                                </div>
                            )
                        }
                    </> : null
                }

                <div className='title_facility'>
                    <p>施設紹介</p>
                </div>
                <div className="detail">

                    <div className='content'>
                        <div className='content_title'>
                            <h2>{newData.contenttitle}</h2>
                            <h1>{newData.name}</h1>
                            <div className='image_box'>
                                <div className='image'>
                                    {newData.image?.name ?
                                        <Image src={process.env.FTP_URL + "img/career/" + newData?.image?.name} width={500} height={500} style={{ width: "100%", height: "auto" }} alt="home" /> :
                                        <div className='altImage'></div>
                                    }
                                </div>
                            </div>
                            <h3><span>〒{formatPostNo(newData.postno)}</span> </h3>
                            <h3>{newData.address}</h3>
                            {/* <h3>{newData.address.split("　")?.[1] ? newData.address.split("　")?.[1] : "---"}</h3> */}
                            <div className='social_icon'>
                                <Link href={newData.homepage} target='_blank'><HomeIcon /></Link>
                                {/* <Image src={"/img/twitterx-50.png"} width={30} height={30} alt='x' />
                                <InstagramIcon />
                                <YouTubeIcon /> */}
                            </div>
                        </div>

                    </div>
                    <div className='content'>
                        <div className='dangerousBox' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(newData.content) }} />
                    </div>
                    <div className="content">
                        <div className='altImage'></div>
                    </div>
                </div>



            </div > :
            <div className='detailPage facilityPage'></div>
    )
}

export default Page