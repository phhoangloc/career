'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
type Props = {}

const Footer = (props: Props) => {
    const toPage = useRouter()
    return (
        <div className='footer'>
            <div className='column'>
                <h2>業界を知る</h2>
                {/* <p>施設紹介ー</p> */}
                {/* <p>インタビュー</p> */}
            </div>
            <div className='column'>
                <h2 onClick={() => toPage.push("/home/search/n/a/b/s/c")}>仕事を探す</h2>
                {/* <p>施設で探す</p> */}
                {/* <p>職種で探す</p> */}
                {/* <p>雇用形態で探す</p> */}
                {/* <p>エリアで探す</p> */}
            </div>
            <div className='column'>
                <h2 onClick={() => toPage.push("/home/facility")}>施設一覧</h2>
            </div>
            <div className='column'>
                <h2 onClick={() => toPage.push("/home/news")}>お知らせ</h2>
            </div>
        </div>
    )
}

export default Footer