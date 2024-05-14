import React from 'react'

type Props = {}

const Footer = (props: Props) => {
    return (
        <div className='footer'>

            <div className='column'>
                <h4>仕事を探す</h4>
                <li>施設で探す</li>
                <li>職種で探す</li>
                <li>エリアで探す</li>
            </div>
            <div className='column'>
                <h4>業界を知る</h4>
                <li>インタビュー</li>
                <li>インタビュー</li>
                <li>インタビュー</li>
            </div>
            <div className='column'>
                <h4>施設の方へ</h4>
            </div>
            <div className='column'>
                <h4>お知らせ</h4>
            </div>
        </div>
    )
}

export default Footer