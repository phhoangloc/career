'use client'
import React from 'react'
import Button from '@/component/input/button'

type Props = {}

const Page = (props: Props) => {
    return (
        <div style={{ minHeight: "calc(100vh - 70px)", width: "90%", margin: "auto" }}>
            <div style={{ width: "max-content", margin: "0" }}>
                <Button name='新規' onClick={() => { console.log("upload image") }} />
            </div>
        </div>
    )
}

export default Page