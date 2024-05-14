'use client'
import React, { useState, useEffect } from 'react'
import store from '@/redux/store'
import Button from '@/component/input/button'
import { useRouter } from 'next/navigation'
const Page = () => {

    const [currentUser, setCurrentUser] = useState<any>(store.getState().user)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    })

    const toPage = useRouter()


    if (currentUser._id) {
        return (
            <div>
                <h1>Admin</h1>
            </div>
        )
    }


    return (
        <div>
            <p className='width-max-content' style={{ margin: "auto" }} >you have to log in</p>
            <div className='width-max-content' style={{ margin: "auto" }}><Button name='Login' onClick={() => toPage.push("/login")} /></div>
        </div>
    )
}

export default Page