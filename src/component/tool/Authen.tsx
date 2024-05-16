'use client'
import React, { useState, useEffect } from "react"
import store from "@/redux/store"
import { useRouter } from "next/navigation"
import Button from "../input/button"
type Props = {
    children: React.ReactNode
}
const Authen = ({ children }: Props) => {

    const [currentUser, setCurrentUser] = useState<any>(store.getState().user)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    })

    const toPage = useRouter()

    if (currentUser._id) {
        return children
    }


    return (
        <div>
            <p className='width-max-content' style={{ margin: "auto" }} >you have to log in</p>
            <div className='width-max-content' style={{ margin: "auto" }}><Button name='Login' onClick={() => toPage.push("/login")} /></div>
        </div>
    )
}

export default Authen