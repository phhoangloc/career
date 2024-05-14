import React from 'react'
import Data from '@/data/data'
import Image from 'next/image'
type Props = {
    params: { slug: string }
}

const Page = ({ params }: Props) => {
    const newData = Data.filter(item => item.slug === params.slug)[0]
    return (
        <div className='detailPage'>
            <div className="detail">
                <div className='image'>
                    <Image src={newData.image} width={500} height={500} style={{ width: "100%", height: "auto" }} alt='cover' />
                </div>
                <div className='content'>
                    <h2>{newData.name}</h2>
                    <li>{newData.workplaces}</li>
                    <li>{newData.worktypes}</li>
                    <li>{newData.location}</li>
                    <div className='text' dangerouslySetInnerHTML={{ __html: newData.contain[0].all }} />
                    <div className='text' dangerouslySetInnerHTML={{ __html: newData.subject[0].all }} />
                    <div className='text' dangerouslySetInnerHTML={{ __html: newData.contain[0].all }} />
                    <div className='text' dangerouslySetInnerHTML={{ __html: newData.subject[0].all }} />
                    <div className='text' dangerouslySetInnerHTML={{ __html: newData.contain[0].all }} />
                    <div className='text' dangerouslySetInnerHTML={{ __html: newData.subject[0].all }} />
                </div>

            </div>
        </div>
    )
}

export default Page