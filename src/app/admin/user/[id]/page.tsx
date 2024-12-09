'use client'
import React, { useState, useEffect } from 'react'
import store from '@/redux/store'
import { UserAuthen } from '@/api/UserAuthen'
import { useRouter } from 'next/navigation'
import Button from '@/component/input/button'
import Input from '@/component/input/input'
import { setRefresh } from '@/redux/reducer/RefreshReduce'
import { NoUserAuthen } from '@/api/NoUserAuthen'
import { japanRegions } from '@/lib/area'
import { japanPrefectures } from '@/lib/area'
type Props = {
    params: { id: string }
}

const Page = ({ params }: Props) => {

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
    const [position, setPosition] = useState<boolean>(false)
    const [plan, setPlan] = useState<number>(0)
    const [facilitiesId, setFacilitiesId] = useState<string[]>([])

    const body = {
        username, email, active, position, plan, facilities: facilitiesId
    }

    const getOnePost = async (p: string, a: string, id: string) => {
        const result = await UserAuthen.getOneUserbyId(p, a, id)
        if (result.success && result.data[0]?._id) {
            setUsername(result.data[0].username)
            setPassword(result.data[0].password)
            setEmail(result.data[0].email)
            setAtive(result.data[0].active)
            setPosition(result.data[0].position)
            setPlan(result.data[0].plan)
            setFacilitiesId(result.data[0].facilities.map((item: any) => item._id))
        }
    }

    useEffect(() => {
        currentUser.position && params.id && getOnePost(currentUser.position, "user", params.id)
    }, [currentUser.position, params.id])

    const toPage = useRouter()

    const UpdatePost = async (body: any) => {
        setSaving(true)

        const result = await UserAuthen.updateItem(currentUser.position, "user", params.id, body)
        if (result.success) {
            setSaving(true)
            toPage.push("/admin")
            store.dispatch(setRefresh())
        }
    }

    const [isAllFacility, setIsAllFacility] = useState<boolean>(true)
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

    useEffect(() => {
        if (facilitiesId.length === 0) {
            setPlan(0)
        }
        if (facilitiesId.length > 0) {
            setPlan(1)
        }
        if (facilitiesId.length >= 5) {
            setPlan(2)
        }
    }, [facilitiesId])
    return (
        <div className=' scrollNone mw1200px-grid-reverse'>
            <div className={`scrollbar-none`} style={{ maxWidth: "992px", padding: "0 10px", margin: "auto", height: "calc(100vh - 60px)", overflow: "auto" }}>
                <Button name="戻る" onClick={() => toPage.back()} />
                <Input name="ユーザーネーム" onChange={(e) => { setSavable(true); setUsername(e) }} value={username} />
                <Input type='password' name="パスワード" onChange={(e) => { setSavable(true); setPassword(e) }} value={password} disabled={true} />
                <Input name="eメール" onChange={(e) => { setSavable(true); setEmail(e) }} value={email} />
                <div className='dp-flex' style={{ height: "40px", lineHeight: "50px" }}>
                    <p>active</p>
                    <input type='checkbox' checked={active} style={{ margin: "0 10px" }} onChange={() => { setSavable(true), setAtive(!active) }}></input>
                </div>
                <div>
                    <div className='dp-flex' >
                        <h3 style={{ height: "40px", lineHeight: "50px" }}>資格の有無</h3>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        {
                            [{ name: "投稿者", position: "user" }, { name: "管理者", position: "admin" }].map((item: any, index: number) =>
                                <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                    <input type='radio' checked={(item.position === position)} onChange={() => { setPosition(item.position), setSavable(true) }} ></input>
                                    <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{item.name}</p>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div>
                    <div className='dp-flex' >
                        <h3 style={{ height: "40px", lineHeight: "50px" }}>プラン</h3>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        {
                            [{ name: "利用なし", plan: 0 }, { name: "エコノミー", plan: 1 }, { name: "スタンダード", plan: 2 }].map((item: any, index: number) =>
                                <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                    <input type='radio' checked={(item.plan === plan)} onChange={() => { setPlan(item.plan), setSavable(true) }} ></input>
                                    <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{item.name}</p>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="xs12 lg7">
                    <div style={{ width: "100%", height: "400px" }}>
                        <div className='dp-flex'><h4 style={{ height: "40px", lineHeight: "50px" }}>事業所</h4><input placeholder='施設で検索' style={{ height: "20px", margin: " auto 5px" }} onChange={(e) => setSearch(e.target.value)} /></div>
                        <div className='dp-flex'>
                            <select style={{ height: "30px", margin: "0 5px" }} onChange={(e) => setIsAllFacility(e.target.value === "すべて" ? true : false)}>
                                {[{ name: "すべて" }, { name: "登録した" }].map((r, index) => <option key={index}>{r.name}</option>)}
                            </select>
                            <select style={{ height: "30px", margin: "0 5px" }} onChange={(e) => setArea(e.target.value)}>
                                <option value="">エリア</option>
                                {japanRegions.map((r, index) => <option key={index}>{r.region}</option>)}
                            </select>
                            <select style={{ width: "100px", height: "30px", margin: "0 5px" }} onChange={(e) => setLocation(e.target.value)}>
                                <option value="">都道府県</option>
                                {japanPrefectures.map((p, index) => <option key={index}>{p.name}</option>)}
                            </select>
                        </div>
                        {isAllFacility ?
                            facility?.length ?
                                <div className='scrollbar-none' style={{ height: "calc(100% - 80px)", overflow: "auto", background: "whitesmoke", padding: "0 5px", marginTop: "10px" }}>
                                    {
                                        facility.map((item: any, index: number) =>
                                            <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                                <input type='checkbox' checked={facilitiesId.includes(item._id)} onChange={() => { setFacilitiesId(f => f.includes(item._id) ? f.filter(id => id !== item._id) : [...f, item._id]), setSavable(true) }}></input>
                                                <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{item.name}</p>
                                            </div>
                                        )}
                                </div>
                                :
                                null :
                            facility?.length ?
                                <div className='scrollbar-none' style={{ height: "calc(100% - 80px)", overflow: "auto", background: "whitesmoke", padding: "0 5px", marginTop: "10px" }}>
                                    {
                                        facility.map((item: any, index: number) =>
                                            facilitiesId.includes(item._id) ? <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                                <input type='checkbox' checked={facilitiesId.includes(item._id)} onChange={() => { setFacilitiesId(f => f.includes(item._id) ? f.filter(id => id !== item._id) : [...f, item._id]), setSavable(true) }}></input>
                                                <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{item.name}</p>
                                            </div> : null
                                        )}
                                </div>
                                :
                                null
                        }
                    </div>
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