'use client'
import React, { useEffect, useState } from 'react'
import store from '@/redux/store'
import { useRouter } from 'next/navigation'

import Input from '../input/input'
import Button from '../input/button'

import { NoUserAuthen } from '@/api/NoUserAuthen'
import { setRefresh } from '@/redux/reducer/RefreshReduce'

type Props = {
    archive: string
}
const Login = ({ archive }: Props) => {

    const [currentTheme, setCurrentTheme] = useState<boolean>(store.getState().theme)

    const update = () => {
        store.subscribe(() => setCurrentTheme(store.getState().theme))
    }

    useEffect(() => {
        update()
    })

    const toPage = useRouter()

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const login = async (data: { username: string, password: string }) => {
        console.log(data)
        const result = await NoUserAuthen.login(data)
        console.log(result)
        if (result.success) {
            // store.dispatch(setNotice({ success: result.success, msg: result.message, open: true }))
            // setTimeout(() => {
            //     store.dispatch(setNotice({ success: result.success, msg: "", open: false }))
            // }, 3000)
            localStorage.token = "bearer " + result.result
            store.dispatch(setRefresh())
            toPage.push("/" + archive)
        } else {
            // store.dispatch(setNotice({ success: result.success, msg: result.message, open: true }))
            // setTimeout(() => {
            //     store.dispatch(setNotice({ success: result.success, msg: "", open: false }))
            // }, 3000)
        }
    }

    return (
        <div className={` ${currentTheme ? "light1" : "dark1"} box-shadow-0 display-flex flex-direction-column justify-content-center text-align-center`}
            style={{ width: "calc(100% - 10px)", maxWidth: "375px", margin: "0px auto 0px  auto", borderRadius: "5px", height: "calc(100% - 0px)", padding: "50px" }}>
            <h2>Log In</h2>
            <Input name="username" value={username} onChange={(e => setUsername(e))} />
            <Input name="password" type='password' value={password} onChange={(e => setPassword(e))} />
            <div style={{ width: "max-content", margin: "25px auto 5px" }}><Button name="Log In" onClick={() => login({ username, password })} /></div>
            <p style={{ fontSize: "0.9rem", cursor: "pointer" }} className="link" onClick={() => toPage.push("signup")}>sign up</p>

        </div>
    )
}

export default Login