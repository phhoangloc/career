'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
type Props = {}

const Footer = (props: Props) => {
    const toPage = useRouter()
    return (
        <div className='footer'>
            <div className='column'>
                <h4 onClick={() => toPage.push("/home#j")}>業界を知る</h4>
                <p onClick={() => toPage.push("/home#f")}>施設紹介</p>
                <p onClick={() => toPage.push("/home#h")}>先輩たちの声</p>
            </div>
            <div className='column'>
                <h4 onClick={() => toPage.push("/home/search/n/a/b/s/c")}>仕事を探す</h4>
                {/* <p>施設で探す</p> */}
                {/* <p>職種で探す</p> */}
                {/* <p>雇用形態で探す</p> */}
                {/* <p>エリアで探す</p> */}
            </div>
            <div className='column'>
                <h4 onClick={() => toPage.push("/home/facility")}>施設一覧</h4>
            </div>
            <div className='column'>
                <h4 onClick={() => toPage.push("/home/news")}>ニュース</h4>
            </div>
            <div className='column'>
                <h4 onClick={() => toPage.push("/home/contact")}>お問い合わせ</h4>
            </div>
            <div className="top_button">
                <a href="#">トップ<br></br>へ</a>
            </div>
        </div>
    )
}

export default Footer