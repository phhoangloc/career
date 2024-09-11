'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import store from '@/redux/store'
import Input from '../input/input'
import Button from '../input/button'
import { NoUserAuthen } from '@/api/NoUserAuthen'
import { setNotice } from '@/redux/reducer/noticeReducer'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { japanPrefectures, japanRegions } from '@/lib/area'
japanRegions
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
    const [facilities, setFacilities] = useState<string[]>([])

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
    const signup = async (body: { username: string, password: string, email: string, facilities: string[] }) => {
        const result = await NoUserAuthen.signup(body)

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
    const [fmodal, setfmodal] = useState<boolean>(false)

    const [facility, setFacility] = useState<any[]>([])
    const [search, setSearch] = useState<string>("")
    const [location, setLocation] = useState<string>("")
    const [area, setArea] = useState<string>("")

    const getFacility = async () => {
        const result = await NoUserAuthen.getItem("facility", search, "", "", "", location, undefined, undefined, area,)
        if (result.success) {
            setFacility(result.data)
        }
    }
    useEffect(() => {
        getFacility()
    }, [search, area, location])
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
            <div style={{ position: "relative", height: "50px", lineHeight: "40px", border: "1px solid #aaa", borderRadius: "5px", fontSize: "90%", textAlign: "left", padding: "5px" }}>
                <div>事業所</div>
                <ArrowDropDownIcon style={{ position: "absolute", right: "5px", top: "15px", zIndex: 1 }} onClick={() => setfmodal(!fmodal)} />
                <div style={{ position: "absolute", left: "0px", top: "0px", height: fmodal ? "400px" : "0px", width: "100%", background: "white", border: fmodal ? "1px solid #aaa" : "none", overflow: "hidden", }}>
                    <div className="" style={{ width: "100%" }}>
                        <div style={{ width: "100%", height: "400px" }}>
                            <div className='dp-flex'><h4 style={{ height: "40px", lineHeight: "50px", padding: "0 5px" }}>事業所</h4><input placeholder='施設で検索' style={{ height: "20px", margin: " auto 5px" }} onChange={(e) => setSearch(e.target.value)} /></div>
                            <div className='dp-flex'>
                                <select style={{ width: "100px", height: "30px", margin: "0 5px" }} onChange={(e) => setLocation(e.target.value)}>
                                    <option value="">都道府県</option>
                                    {japanPrefectures.map((p, index) => <option key={index}>{p.name}</option>)}
                                </select>
                                <select style={{ height: "30px", margin: "0 5px" }} onChange={(e) => setArea(e.target.value)}>
                                    <option value="">エリア</option>
                                    {japanRegions.map((r, index) => <option key={index}>{r.region}</option>)}
                                </select>
                            </div>
                            {facility?.length ?
                                <div className='scrollbar-none' style={{ height: "calc(100% - 80px)", overflow: "auto", background: "whitesmoke", padding: "0 5px", marginTop: "10px" }}>
                                    {
                                        facility.map((item: any, index: number) =>
                                            <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                                <input type='checkbox' onChange={() => { setFacilities((f) => f.includes(item._id) ? [...f.filter(fi => fi !== item._id)] : [...f, item._id]) }} ></input>
                                                <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{item.name}</p>
                                            </div>
                                        )
                                    }
                                </div>
                                :
                                null
                            }
                        </div>
                    </div>

                </div>
            </div>
            <div style={{ width: "max-content", margin: "25px auto 5px" }}>
                <Button onClick={() => signup({ username, password, email, facilities })} name="登録" disable={isError} />
            </div>
            <p style={{ cursor: "pointer", fontSize: "0.9rem" }} className='link' onClick={() => toPage.push("/login")}>ログイン</p>
        </div>
    )
}

export default Signup