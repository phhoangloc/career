'use client'
import React, { useState, useEffect } from 'react'
import store from '@/redux/store'
import Button from '@/component/input/button'
import { useRouter } from 'next/navigation'
const Page = () => {
    return (
        <div className=' display-flex justify-content-center flex-direction-column text-align-center' style={{ minHeight: "calc(100vh - 70px)" }}>
            <h2>こんにちは！</h2>
            <h1>SHIFTの管理ページです。</h1>
        </div>
    )
}

export default Page