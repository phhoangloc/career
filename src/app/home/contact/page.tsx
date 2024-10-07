'use client'
import Input from '@/component/input/input'
import TextAreaTool from '@/component/input/textareaTool'
import TextAreaTool_v2 from '@/component/input/textareaTool_v2'
import Button from '@/component/input/button'
import React, { useState } from 'react'

type Props = {}

const Page = (props: Props) => {

    const [name, setname] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [content, setContent] = useState<string>("")
    return (
        <div className='min-height-100vh dp-flex fd-col jc-center'>

            <div className="contact">
                <h1 style={{ textAlign: "center", marginBottom: "25px" }}>お問い合わせ</h1>
                <Input name="名前" onChange={(v) => setname(v)} value={name} />
                <Input name="eメール" onChange={(v) => setEmail(v)} value={email} />
                <TextAreaTool_v2 value={content} onChange={(e) => setContent(e)} />
                <Button name="送信" onClick={() => alert("お問い合わせは送信されました。応答が届きましたら、ボイスメールをご確認ください。")} />
            </div>
        </div>
    )
}

export default Page