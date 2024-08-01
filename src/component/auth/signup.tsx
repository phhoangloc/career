'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import store from '@/redux/store'
import Input from '../input/input'
import Button from '../input/button'
import { NoUserAuthen } from '@/api/NoUserAuthen'
import { setNotice } from '@/redux/reducer/noticeReducer'
type Props = {
    archive: string
}
const Signup = ({ archive }: Props) => {
    const [currentTheme, setCurrentTheme] = useState<boolean>(store.getState().theme)
    const update = () => {
        store.subscribe(() => setCurrentTheme(store.getState().theme))
    }
    update()

    const toPage = useRouter()
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [email, setEmail] = useState<string>("")

    const [isError, setIsErrors] = useState<boolean>(true)

    const [Error, setErrors] = useState<{ username?: string, password?: string, email?: string }>({})

    useEffect(() => {
        validateForm && validateForm();
    }, [username, password, email]);

    const validateForm = async () => {
        let errors: { username?: string, password?: string, email?: string } = {}

        if (username.length != 0 && 6 > username.length) {
            errors.username = `ユーザー名は6文字以上である必要があります`

        }
        if (username) {
            const isusername = await fetch("/api/checkuser?username=" + username)
                .then((res) => res.json())
                .then((data) => data)
            if (isusername) { errors.username = "ユーザー名は既に存在します" }
        }
        if (!/\S+@\S+\.\S+/.test(email) && email.length != 0) {
            errors.email = '電子メールが無効です';
        }
        if (email) {
            const isEmail = await fetch("/api/checkuser?email=" + email)
                .then((res) => res.json())
                .then((data) => data)
            if (isEmail) { errors.email = "eメールは既に存在します" }
        }
        if (password.length != 0 && password.length < 6) {
            errors.password = `パスワードは6文字以上である必要があります`;
        }

        setIsErrors(Object.keys(errors).length || username === "" || password === "" || email === "" ? true : false);
        setErrors(errors)
    }
    const signup = async (body: { username: string, password: string, email: string }) => {
        const result = await NoUserAuthen.signup(body)
        console.log(result)
        if (result.success) {
            setUsername("")
            setPassword("")
            setEmail("")
            store.dispatch(setNotice({ success: result.success, msg: result.message, open: true }))
            setTimeout(() => {
                store.dispatch(setNotice({ success: result.success, msg: "", open: false }))
            }, 3000)
            toPage.push("/login")
        } else {
            store.dispatch(setNotice({ success: result.success, msg: result.message, open: true }))
            setTimeout(() => {
                store.dispatch(setNotice({ success: result.success, msg: "", open: false }))
            }, 3000)
        }
    }

    return (
        <div className={` ${currentTheme ? "light1" : "dark1"} box-shadow-0 display-flex flex-direction-column justify-content-center text-align-center`}
            style={{ width: "calc(100% - 10px)", maxWidth: "375px", margin: "0px auto 0px  auto", borderRadius: "5px", height: "calc(100% - 0px)", padding: "50px" }}>
            <h3>登録</h3>
            <Input name='ユーザー' value={username} onChange={(data) => setUsername(data)} />
            <p style={{ fontSize: "0.6rem", color: "red" }}>{Error.username}</p>
            <Input type='password' name='パスワード' value={password} onChange={(data) => setPassword(data)} />
            <p style={{ fontSize: "0.6rem", color: "red" }}>{Error.password}</p>
            <Input name='eメール' value={email} onChange={(data) => setEmail(data)} />
            <p style={{ fontSize: "0.6rem", color: "red" }}>{Error.email}</p>
            <div style={{ width: "max-content", margin: "25px auto 5px" }}>
                <Button onClick={() => signup({ username, password, email })} name="Sign up" disable={isError} />
            </div>
            <p style={{ cursor: "pointer", fontSize: "0.9rem" }} className='link' onClick={() => toPage.push("/login")}>log in</p>
        </div>
    )
}

export default Signup