'use client'
import React, { useState, useEffect } from 'react'
import store from '@/redux/store'
import { UserAuthen } from '@/api/UserAuthen'
import { useRouter } from 'next/navigation'
import Button from '@/component/input/button'
import Input from '@/component/input/input'
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

    const body = {
        username, email, active
    }

    const getOnePost = async (p: string, a: string, id: string) => {
        const result = await UserAuthen.getOneUserbyId(p, a, id)

        if (result.success && result.data[0]?._id) {

            setUsername(result.data[0].username)
            setPassword(result.data[0].password)
            setEmail(result.data[0].email)
            setAtive(result.data[0].active)
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
            toPage.push("/admin/user")
        }
    }
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

                <div style={{ display: "flex", margin: "10px 0", width: "210px", justifyContent: "space-between" }}>

                    <Button name='保存' onClick={() => UpdatePost(body)} disable={!savable} />
                    {/* <Button name="プレビュー" onClick={() => UpdatePostDemo(body)} /> */}
                </div>
            </div>
        </div>
    )
}

export default Page