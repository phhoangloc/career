'use client'
import React, { useEffect, useState } from 'react'
import Data from '@/data/data'
import Image from 'next/image'
import { NoUserAuthen } from '@/api/NoUserAuthen'
import DOMPurify from 'dompurify'
import { useRouter } from 'next/navigation'
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

    const toPage = useRouter()

    const [newData, setNewData] = useState<any>({})
    const demo = params.slug[1]

    const getItem = async (a: string, s: string,) => {

        const result = await NoUserAuthen.getOneItem(a, s)
        if (result.success) {
            setNewData(result.data[0])
        }
    }

    useEffect(() => {
        getItem("interview", params.slug)
    }, [])

    return (
        newData._id ?
            <div className='detailPage'>
                <div className='breadcum'>
                    <h4 onClick={() => toPage.push("/home")}>ホーム</h4>
                    <h4>/</h4>
                    <h4 onClick={() => toPage.push("/home/interview")}>インタビュー</h4>
                </div>
                <div className="detail">

                    <h2 style={{ textAlign: "center" }}>{newData.contenttitle}</h2>
                    <h2 style={{ textAlign: "center", opacity: 0.75, marginBottom: "50px" }}>{newData.name}</h2>
                    <div className='image'>
                        <Image src={process.env.FTP_URL + "img/career/" + newData?.image?.name} width={500} height={500} style={{ width: "100%", height: "auto" }} alt='cover' />
                    </div>
                    <div className='content' style={{ maxWidth: "768px", margin: "50px auto", }}>
                        <h2 style={{ color: "#444", fontSize: "1.5rem" }}>{newData.workplace.name}</h2>
                        <h3 style={{ color: "#444", }}><span>〒{formatPostNo(newData.workplace.postno)}</span> </h3>
                        <h3 style={{ color: "#444", fontSize: "1.15rem" }}>{newData.workplace.address}</h3>
                        <h3 style={{ color: "#444", fontSize: "1.15rem" }}>{newData.workplace?.address?.split("　")[1] ? newData.workplace.address.split("　")[1] : " "}</h3>
                        <div style={{ color: "#444" }} className='text dangerousBox' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(newData.content) }} />
                    </div>
                    <div className="content" style={{ maxWidth: "768px", margin: "50px auto", }}>
                        <div style={{ height: "300px", background: "#888", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}><h1>NO VIDEO</h1></div>
                    </div>
                </div>
            </div> : <div className='detailPage'></div>
    )
}

export default Page