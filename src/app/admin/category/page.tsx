'use client'
import React, { useState, useEffect } from 'react'
import AddIcon from '@mui/icons-material/Add';
import store from '@/redux/store'
import { UserAuthen } from '@/api/UserAuthen'
import DeleteIcon from '@mui/icons-material/Delete';
import { AlertType, setAlert } from '@/redux/reducer/alertReducer'
import { useRouter } from 'next/navigation'
import CategoryIcon from '@mui/icons-material/Category';
import Button from '@/component/input/button';
import CloseIcon from '@mui/icons-material/Close';
const Page = () => {

    const toPage = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [isNew, setIsNew] = useState<boolean>(false)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [name, setName] = useState<string>("")
    const [editName, setEditName] = useState<string>("")
    const [i, setI] = useState<number>(-1)

    const [refresh, setRefresh] = useState<number>(0)
    const [id, setId] = useState<string>("")

    const [currentUser, setCurrentUser] = useState<any>(store.getState().user)
    const [currentAlert, setCurrentAlert] = useState<AlertType>(store.getState().alert)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentAlert(store.getState().alert))
    }
    useEffect(() => {
        update()
    })


    const [data, setData] = useState<any[]>([])
    const getMedia = async (p: string, a: string, search: string, skip: number | undefined, limit: number | undefined) => {
        const result = await UserAuthen.getItem(p, a, search, skip, limit)
        if (result.success) {
            setData(result.data)
        } else {
            setData([])
        }
    }

    useEffect(() => {
        currentUser.position && getMedia(currentUser.position, "category", "", undefined, undefined)
    }, [currentUser.position, refresh])

    const deleteImage = async (p: string, a: string, id: string) => {
        setLoading(true)
        const result = await UserAuthen.deleteItem(p, a, id)
        if (result.success) {
            setLoading(false)
            setRefresh(n => n + 1)
        }
    }
    useEffect(() => {
        currentAlert.value && id && deleteImage(currentUser.position, "category", id)
    }, [currentAlert.value])

    const addCategory = async (body: any) => {

        const result = await UserAuthen.createItem(currentUser.position, "category", body)
        if (result.success) {
            setRefresh(n => n + 1)
            setIsNew(false)
            setName("")
        }
    }
    const updateCategory = async (id: string, body: any) => {

        const result = await UserAuthen.updateItem(currentUser.position, "category", id, body)
        if (result.success) {
            setRefresh(n => n + 1)
            setIsEdit(false)
            setEditName("")
        }
    }
    // console.log(data)

    return (
        <div style={{ minHeight: "calc(100vh - 70px)", width: "100%", maxWidth: "575px", margin: "5px" }}>
            <div className="dp-flex">
                {
                    isNew ?
                        <div style={{ display: "flex" }}>
                            <input style={{ borderRadius: "5px", fontSize: "1rem" }} placeholder='新規カテゴリー' onChange={(e) => { setName(e.target.value) }} />
                            <CloseIcon className='svg30px bg-main br-5px' onClick={() => setIsNew(false)} />
                        </div> :
                        null
                }
                <AddIcon className='svg30px bg-main br-5px' onClick={() => name && isNew ? addCategory({ name }) : setIsNew(true)} />
            </div>
            {data.length ? data.map((item, index) =>
                <div key={index} className='flexbox hover-background-color-128-15p hover-boder-radius-5px hover-opacity-1'
                    style={{ cursor: "pointer", height: "40px", margin: "5px 0", border: "1px solid #ddd", borderRadius: "5px" }}>
                    <CategoryIcon style={{ width: "40px", height: "40px", boxSizing: "border-box", padding: "5px" }} />
                    {isEdit && id === item._id ?
                        <input style={{ border: "none", fontSize: "1rem", width: "100%", background: "none" }} placeholder='カテゴリーを入力'
                            onFocus={(e) => e.currentTarget.style.outline = "none"}
                            onChange={(e) => { setEditName(e.target.value) }}
                            value={editName}
                            onBlur={() => editName && updateCategory(id, { name: editName })} /> :
                        <div style={{ width: "100%", height: "100%", lineHeight: "50px" }}>
                            <p onClick={() => { setId(item._id), setIsEdit(true), setEditName(item.name) }}>{item.name}</p>
                        </div>
                    }
                    <div style={{ width: "50px" }}>
                        <DeleteIcon
                            style={{ width: "40px", height: "40px", boxSizing: "border-box", padding: "5px" }}
                            onClick={() => (setId(item._id), store.dispatch(setAlert({ open: true, msg: "この投稿を削除してもよろしいですか?", value: false })))} /></div>
                </div>) :
                <div className='flexbox'>
                    <div style={{ width: "50px" }}></div>
                    <div style={{ width: "100%", textAlign: "center" }}>{loading ? <p>少々お待ちください。</p> : <p>{"カテゴリーがありません。"}</p>}</div>
                    <div style={{ width: "50px" }}></div>
                </div>
            }
        </div>
    )


}

export default Page