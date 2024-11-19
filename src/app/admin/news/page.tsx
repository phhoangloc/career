'use client'
import React, { useState, useEffect } from 'react'
import store from '@/redux/store'
import { UserAuthen } from '@/api/UserAuthen'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import Button from '@/component/input/button';
import Pagination from '@/component/tool/pagination';
import { AlertType, setAlert } from '@/redux/reducer/alertReducer';
import AddIcon from '@mui/icons-material/Add';
import Input from '@/component/input/input';
type Props = {}

const Page = (props: Props) => {

    const [currentUser, setCurrentUser] = useState<any>(store.getState().user)
    const [currentAlert, setCurrentAlert] = useState<AlertType>(store.getState().alert)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentAlert(store.getState().alert))
    }
    useEffect(() => {
        update()
    })

    const [refresh, setRefresh] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)
    const [notice, setNotice] = useState<string>("")

    const toPage = useRouter()

    const [id, setId] = useState<string>("")
    const [data, setData] = useState<any[]>([])
    const [search, setSearch] = useState<string>("")
    const [page, setPage] = useState<number>(0)
    const [limit, setLimit] = useState<number>(20)
    const [end, setEnd] = useState<boolean>(false)

    const [selectId, setSelectId] = useState<string[]>([])

    const getPost = async (p: string, a: string, s: string, sk: number, li: number) => {
        const result = await UserAuthen.getItem(p, a, s, sk, li)
        if (result.success) {
            setData(result.data)
            setLoading(false)
        } else {
            setData([])
            setNotice(result.message)
            setLoading(false)
        }
    }
    const getPost_v2 = async (p: string, a: string, s: string, sk: number, li: number) => {
        const result = await UserAuthen.getItem(p, a, s, sk, li)
        if (result.success) {
            setEnd(result.data.length ? false : true)
        }
    }

    useEffect(() => {
        currentUser.position && getPost(currentUser.position, "news", search, page * limit, limit)
        currentUser.position && getPost_v2(currentUser.position, "news", search, (page + 1) * limit, limit)
    }, [refresh, currentUser.position, search, page])

    const deletePost = async (id: string) => {
        const result = await UserAuthen.deleteItem(currentUser.position, "news", id)
        setRefresh(n => n + 1)
    }

    const deleteAllPost = async (array: string[]) => {
        array.forEach(item => {
            deletePost(item)
            setSelectId(p => p.filter(i => i != item))
            setRefresh(n => n + 1)
        })
    }

    useEffect(() => {
        currentAlert.value && id && deletePost(id)
        currentAlert.value && selectId.length && deleteAllPost(selectId)
    }, [currentAlert.value])

    useEffect(() => {
        currentAlert.open === false && setId("")
        currentAlert.open === false && setSelectId([])
    }, [currentAlert.open])

    return (
        <div className='scrollbar-none' style={{ height: "calc(100vh - 60px)", width: "100%", padding: "0 10px", overflow: "auto" }}>

            <div style={{ height: "calc(100vh - 60px)", width: "100%", padding: "5% 10% 0" }}>

                <div className='flexbox' style={{ height: "40px" }}>
                    <h2 style={{ textAlign: "center", width: "calc(100% - 100px)", height: "100%", lineHeight: "50px", fontWeight: "bold" }}>ニュース一覧</h2>
                    <div style={{ width: "40px" }}></div>
                </div>
                <div style={{ width: "max-content", margin: "0", display: "flex" }}>
                    {selectId.length ?
                        <div style={{ display: "flex", height: "40px", width: "100px", background: "#006699", color: "white", borderRadius: "5px", cursor: "pointer", marginRight: "5px" }} onClick={() => store.dispatch(setAlert({ open: true, msg: "この投稿を削除してもよろしいですか?", value: false }))}>
                            <DeleteIcon style={{ width: "40px", height: "40px", boxSizing: "border-box", padding: "7.5px" }} />
                            <p style={{ height: "40px", lineHeight: "50px", textAlign: "center" }} >削除</p>
                        </div> : null}
                    <div style={{ display: "flex", height: "40px", width: "100px", background: "#006699", color: "white", borderRadius: "5px", cursor: "pointer" }} onClick={() => toPage.push("news/new")}>
                        <AddIcon style={{ width: "40px", height: "40px", boxSizing: "border-box", padding: "7.5px" }} />
                        <p style={{ height: "40px", lineHeight: "50px", textAlign: "center" }} >新規</p>
                    </div>
                </div>
                <div className='dp-flex'>
                    <Input name="search" onChange={(e) => setSearch(e)} value={search} />
                </div>
                <div className='flexbox hover-background-color-128-15p hover-boder-radius-5px hover-opacity-1'
                    style={{ height: "40px", background: "#f0f0f0" }}>
                    <div style={{ width: "40px" }}>
                    </div>
                    <div style={{ height: "100%", lineHeight: "50px", opacity: 0.5, fontSize: "90%" }}>
                        タイトル
                    </div>
                </div>
                {data.length ? data.map((item, index) =>
                    <div key={index} className='flexbox hover-background-color-128-15p hover-boder-radius-5px hover-opacity-1 bg-even'
                        style={{ cursor: "pointer", height: "40px", margin: "5px 0", }}>
                        <div style={{ width: "40px" }}>
                            {selectId.includes(item._id) ?
                                <CheckBoxOutlinedIcon style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "5px" }}
                                    onClick={() => setSelectId(p => p.filter(i => i != item._id))} /> :
                                <CheckBoxOutlineBlankIcon style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "5px" }}
                                    onClick={() => setSelectId(p => [...p, item._id])} />}
                        </div>
                        <div style={{ width: "100%", height: "100%", lineHeight: "50px" }}><p onClick={() => toPage.push("news/" + item.slug)}>{item.name}</p></div>
                        <div style={{ width: "50px" }}><DeleteIcon style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "5px" }}
                            onClick={() => (setId(item._id), store.dispatch(setAlert({ open: true, msg: "この投稿を削除してもよろしいですか?", value: false })))} /></div>
                    </div>) :
                    <div className='flexbox'>
                        <div style={{ width: "50px" }}></div>
                        <div style={{ width: "100%", textAlign: "center" }}>{loading ? <p>少々お待ちください。</p> : <p>{notice ? notice : "ニュースがありません。"}</p>}</div>
                        <div style={{ width: "50px" }}></div>
                    </div>
                }

                {
                    data.length ? <Pagination page={page} next={() => setPage(p => p + 1)} prev={() => setPage(p => p - 1)} end={end} /> : null
                }
            </div >
        </div >
    )

}

export default Page