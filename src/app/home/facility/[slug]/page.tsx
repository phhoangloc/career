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
                <div className='breadcum'>
                    <h4 onClick={() => toPage.push("/home")}>ホーム</h4>
                    <h4>/</h4>
                    <h4 onClick={() => toPage.push("/home/facility")}>施設一覧</h4>
                </div>

                <div style={{ maxWidth: "992px", margin: "50px auto 0" }}>
                    <div className='title_facility'>
                        <p>施設紹介</p>
                    </div>
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
                                        <div className='altImage dp-flex fd-col jc-center ta-center'><h1>NO IMAGE</h1></div>
                                    }
                                </div>
                            </div>
                            <h3><span>〒{formatPostNo(newData.postno)}</span> </h3>
                            <h3>{newData.address}</h3>
                            <h3>{newData.address.split("　")?.[1] ? newData.address.split("　")?.[1] : " "}</h3>
                            <div className='social_icon'>
                                <Link style={{ display: "flex" }} href={newData.homepage} target='_blank'><HomeIcon /><p onMouseEnter={(e) => e.currentTarget.style.color = "#006699"} onMouseLeave={(e) => e.currentTarget.style.color = "inherit"} style={{ lineHeight: "45px" }}>{newData.homepage}</p></Link>
                                {/* <Image src={"/img/twitterx-50.png"} width={30} height={30} alt='x' />
                                <InstagramIcon />
                                <YouTubeIcon /> */}
                            </div>
                            <div className='dangerousBox' dangerouslySetInnerHTML={{ __html: newData.map ? newData.map : null }} />
                        </div>

                    </div>
                    <div className='content'>
                        <div className='dangerousBox' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(newData.content) }} />
                    </div>
                    <div className="content">
                        <div className='altImage dp-flex fd-col jc-center ta-center'><h1>NO VIDEO</h1></div>
                    </div>
                </div>



            </div > :
            <div className='detailPage facilityPage'></div>
    )
}

export default Page