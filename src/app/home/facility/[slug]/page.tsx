'use client'
import React, { useEffect, useState } from 'react'
import Data from '@/data/data'
import Image from 'next/image'
import { NoUserAuthen } from '@/api/NoUserAuthen'
import HomeIcon from '@mui/icons-material/Home';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
type Props = {
    params: { slug: string }
}

const Page = ({ params }: Props) => {

    const [newData, setNewData] = useState<any>({})

    const getItem = async (a: string, s: string,) => {

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
                        <div className='image'>
                            <Image src={process.env.FTP_URL + "upload/" + newData?.image?.name} width={500} height={500} style={{ width: "100%", height: "auto" }} alt='cover' />
                            <Image src={process.env.FTP_URL + "upload/" + newData?.image?.name} width={500} height={500} style={{ width: "100%", height: "auto" }} alt='cover' />
                        </div>
                    </div>
                    <div className='content_content' style={{ marginTop: "15px" }}>
                        <h4>{newData.contenttitle}</h4>
                        <div className='dangerousBox' dangerouslySetInnerHTML={{ __html: newData.content }} />
                    </div>

                </div>
            </div > : null
    )
}

export default Page