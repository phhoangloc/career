'use client'
import React, { useState, useEffect } from 'react'
import store from '@/redux/store'
import { UserAuthen } from '@/api/UserAuthen'
import { useRouter } from 'next/navigation'
import Button from '@/component/input/button'
import Input from '@/component/input/input'
import { japanPrefectures } from '@/lib/area'
import { japanRegions } from '@/lib/area'
import { NoUserAuthen } from '@/api/NoUserAuthen'
import { setNotice } from '@/redux/reducer/noticeReducer'
const Page = () => {

    const [currentUser, setCurrentUser] = useState<any>(store.getState().user)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    })
    const [savable, setSavable] = useState<boolean>(false)
    const [saving, setSaving] = useState<boolean>(false)


    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [active, setAtive] = useState<boolean>(false)
    const [facilities, setFacilities] = useState<any[]>([])

    const body = {
        username, email, active, facilities
    }

    const getOnePost = async (p: string, a: string, id: string) => {
        const result = await UserAuthen.getOneUserbyId(p, a, id)
        console.log(result)
        if (result.success && result.data[0]?._id) {

            setUsername(result.data[0].username)
            setPassword(result.data[0].password)
            setEmail(result.data[0].email)
            setAtive(result.data[0].active)
            setFacilities(result.data[0].facilities)
        }
    }

    useEffect(() => {
        currentUser.position && currentUser._id && getOnePost(currentUser.position, "user", currentUser._id)
    }, [currentUser.position, currentUser._id])

    const toPage = useRouter()

    const UpdatePost = async (body: any) => {
        setSaving(true)

        const result = await UserAuthen.updateItem(currentUser.position, "user", currentUser._id, body)
        if (result.success) {
            setSaving(true)
            store.dispatch(setNotice({ open: true, success: true, msg: "アップデートができました。" }))
            setTimeout(() => {
                setSaving(false)
                store.dispatch(setNotice({ open: false, success: false, msg: "" }))
            }, 2000);
        }
    }
    const [facility, setFacility] = useState<any[]>([])
    const [search, setSearch] = useState<string>("")
    const [area, setArea] = useState<string>("")
    const [location, setLocation] = useState<string>("")

    const getFacility = async () => {
        const result = await NoUserAuthen.getItem("facility", search, "", "", "", location, undefined, undefined, area)
        if (result.success) {
            setFacility(result.data)
        }
    }

    useEffect(() => {
        getFacility()
    }, [search, area, location])


    return (
        <div className=' scrollNone mw1200px-grid-reverse'>
            <div className={`scrollbar-none`} style={{ maxWidth: "992px", padding: "0 10px", margin: "auto", height: "calc(100vh - 60px)", overflow: "auto" }}>
                <Button name="戻る" onClick={() => toPage.back()} />
                <Input name="ユーザーネーム" onChange={(e) => { setSavable(true); setUsername(e) }} value={username} />
                <Input type='password' name="パスワード" onChange={(e) => { setSavable(true); setPassword(e) }} value={password} disabled={true} />
                <Input name="eメール" onChange={(e) => { setSavable(true); setEmail(e) }} value={email} />
                <div className="grid_box">
                    <div className="xs12 lg5 of-hidden" style={{ marginBottom: "10px", maxHeight: "400px" }}>
                        <h4 style={{ height: "40px", lineHeight: "50px" }}>アイキャッチ</h4>
                        <div style={{ height: "calc(100% - 40px) ", aspectRatio: 1, borderRadius: "5px", margin: "0px auto 20px", boxShadow: "0px 0px 10px #444" }}>
                            NOIMAGE
                            {/* <UploadPicturePreview
                                        icon={<AddPhotoAlternateIcon style={{ width: "100%", height: "100%" }} />}
                                        src={`${imagePreview ? process.env.FTP_URL + "img/career/" + imagePreview : "/img/defaultImg.jpg"}`}
                                        size={30}
                                        func={() => { setOpenModal(true), setSavable(true) }}
                                    /> */}
                        </div>
                    </div>

                    <div className="xs12 lg7">
                        <div style={{ width: "100%", height: "400px" }}>
                            <div className='dp-flex'><h4 style={{ height: "40px", lineHeight: "50px" }}>事業所</h4><input placeholder='施設で検索' style={{ height: "20px", margin: " auto 5px" }} onChange={(e) => setSearch(e.target.value)} /></div>
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
                            <div className='scrollbar-none' style={{ height: "calc(100% - 80px)", overflow: "auto", background: "whitesmoke", padding: "0 5px", marginTop: "10px" }}>

                                {facility?.length ?
                                    facility.map((item: any, index: number) =>
                                        <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                            <input type='checkbox' checked={facilities.includes(item._id)} onChange={() => { setFacilities((f) => f.includes(item._id) ? [...f.filter(fi => fi !== item._id)] : [...f, item._id]), setSavable(true) }} ></input>
                                            <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{item.name}</p>
                                        </div>
                                    ) : null
                                }
                            </div>

                        </div>
                    </div>
                </div>
                <div className='dp-flex' style={{ height: "40px", lineHeight: "50px" }}>
                    <p>active</p>
                    <input type='checkbox' checked={active} style={{ margin: "0 10px" }} onChange={() => { setSavable(true), setAtive(!active) }}></input>
                </div>

                <div style={{ display: "flex", margin: "10px 0", width: "210px", justifyContent: "space-between" }}>

                    <Button name='保存' onClick={() => UpdatePost(body)} disable={!savable} />
                    {/* <Button name="プレビュー" onClick={() => UpdatePostDemo(body)} /> */}
                </div>
            </div>
        </div>
    )
}

export default Page