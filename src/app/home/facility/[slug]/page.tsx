'use client'
import React, { useEffect, useState } from 'react'
import Data from '@/data/data'
import Image from 'next/image'
import { NoUserAuthen } from '@/api/NoUserAuthen'
import HomeIcon from '@mui/icons-material/Home';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Button from '@/component/input/button'
type Props = {
    params: { slug: string }
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

    return (
        newData ?
            <div className='detailPage facilityPage'>
                <div className='title_facility'>
                    <p>事業概要</p>
                </div>
                <div className="detail">

                    <div className='content'>
                        <div className='content_title'>
                            <h2>{newData.name}</h2>
                            <h3><span>〒{newData.postno}</span> <br></br>{newData.address}</h3>
                            <div className='social_icon'>
                                <HomeIcon />
                                <Image src={"/img/twitterx-50.png"} width={30} height={30} alt='x' />
                                <InstagramIcon />
                                <YouTubeIcon />
                            </div>
                        </div>
                        <div className='image_box'>
                            <div className='image'>
                                <Image src={process.env.FTP_URL + "upload/" + newData?.image?.name} width={500} height={500} style={{ width: "100%", height: "auto" }} alt='cover' />
                                <PlayArrowIcon />
                            </div>
                            <div className='image'>
                                <Image src={process.env.FTP_URL + "upload/" + newData?.image?.name} width={500} height={500} style={{ width: "100%", height: "auto" }} alt='cover' />
                                <PlayArrowIcon />
                            </div>
                        </div>
                    </div>
                    <div className='content_content' style={{ marginTop: "15px" }}>
                        <h4>{newData.contenttitle}</h4>
                        <div className='dangerousBox' dangerouslySetInnerHTML={{ __html: newData.content }} />
                    </div>

                </div>
                <div className='title_facility'>
                    <p>募集要項</p>
                </div>
                <div className="detail apply">
                    <div style={{ display: "flex" }}><h4>仕事内容</h4><p>・⼿話通訳業務<br></br>本文本文本文本文本文本文本文本文</p></div>
                    <div style={{ display: "flex" }}><h4>応募資格</h4><p>本文本文本文本文本文本文本文本文<br></br>本文本文本文本文本文本文本文本文</p></div>
                    <div style={{ display: "flex" }}><h4>雇⽤形態</h4><p>正社員</p></div>
                    <div style={{ display: "flex" }}><h4>勤務地</h4><p><span>〒{newData.postno}</span> <br></br>{newData.address}</p></div>
                    <div style={{ display: "flex" }}><h4>勤務時間</h4><p>00：00〜00：00（実働0時間）</p></div>
                    <div style={{ display: "flex" }}><h4>給与</h4><p>⽉給00万円＋各種⼿当</p></div>
                    <div style={{ display: "flex" }}><h4>休⽇休暇</h4><p>年間休⽇000⽇／完全週休2⽇制（⼟・⽇）</p></div>
                    <p className='button'>応募はこちらから</p>
                </div>
            </div > : null
    )
}

export default Page