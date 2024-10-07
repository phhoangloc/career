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
import { AlertType } from '@/redux/reducer/alertReducer';
import { setAlert } from '@/redux/reducer/alertReducer';
import Input from '@/component/input/input';
import AddIcon from '@mui/icons-material/Add';
import LabelIcon from '@mui/icons-material/Label';
import { japanPrefectures, japanRegions } from '@/lib/area';
import SwapVertIcon from '@mui/icons-material/SwapVert';
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

    const [id, setId] = useState<string>("")

    const toPage = useRouter()
    const [data, setData] = useState<any[]>([])
    const [search, setSearch] = useState<string>("")
    const [page, setPage] = useState<number>(0)
    const [limit, setLimit] = useState<number>(20)
    const [end, setEnd] = useState<boolean>(false)

    const [selectId, setSelectId] = useState<string[]>([])

    const [__location, set__location] = useState<string>("")
    const [__area, set__area] = useState<string>("")
    const [__sort, set__sort] = useState<number>(1)

    const getPost = async (p: string, a: string, s: string, sk: number, li: number, lo: string, area: string, sort: number) => {
        const result = await UserAuthen.getItem(p, a, s, sk, li, lo, area, sort)
        if (result.success) {
            setData(result.data)
            setLoading(false)
        } else {
            setData([])
            setNotice(result.message)
            setLoading(false)
        }
    }
    const getPost_v2 = async (p: string, a: string, s: string, sk: number, li: number, lo: string, area: string, sort: number) => {
        const result = await UserAuthen.getItem(p, a, s, sk, li, lo, area, sort)
        if (result.success) {
            setEnd(result.data.length ? false : true)
        }
    }

    useEffect(() => {
        currentUser.position && getPost(currentUser.position, "facility", search, 0, 0, __location, __area, __sort)
        // currentUser.position && getPost_v2(currentUser.position, "facility", search, (page + 1) * limit, limit)
    }, [refresh, currentUser.position, search, page, __location, __area, __sort])

    const deletePost = async (id: string) => {
        const result = await UserAuthen.deleteItem(currentUser.position, "facility", id)
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
                    <h2 style={{ textAlign: "center", width: "calc(100% - 100px)", height: "100%", lineHeight: "50px", fontWeight: "bold" }}>施設一覧</h2>
                    <div style={{ width: "40px" }}></div>
                </div>
                <div style={{ width: "max-content", margin: "0", display: "flex" }}>
                    {selectId.length ?
                        <div style={{ display: "flex", height: "40px", width: "100px", background: "#006699", color: "white", borderRadius: "5px", cursor: "pointer", marginRight: "5px" }} onClick={() => store.dispatch(setAlert({ open: true, msg: "この投稿を削除してもよろしいですか?", value: false }))}>
                            <DeleteIcon style={{ width: "40px", height: "40px", boxSizing: "border-box", padding: "7.5px" }} />
                            <p style={{ height: "40px", lineHeight: "50px", textAlign: "center" }} >削除</p>
                        </div> : null}
                    {currentUser.position === "admin" && <div style={{ display: "flex", height: "40px", width: "100px", background: "#006699", color: "white", borderRadius: "5px", cursor: "pointer" }} onClick={() => toPage.push("facility/new")}>
                        <AddIcon style={{ width: "40px", height: "40px", boxSizing: "border-box", padding: "7.5px" }} />
                        <p style={{ height: "40px", lineHeight: "50px", textAlign: "center" }} >新規</p>
                    </div>}
                    <SwapVertIcon style={{ width: "40px", height: "40px", padding: "8px", boxSizing: "border-box", background: "#006699", color: "white", marginLeft: "5px", borderRadius: "5px" }} onClick={() => set__sort(__sort !== -1 ? -1 : 1)} />
                    <div className="xs12 lg7">
                        <div style={{ width: "100%", height: "max-content" }}>
                            <div className='dp-flex'>
                                <select style={{ width: "100px", height: "40px", margin: "0 5px" }} onChange={(e) => set__location(e.target.value)}>
                                    <option value="">都道府県</option>
                                    {japanPrefectures.map((p, index) => <option key={index}>{p.name}</option>)}
                                </select>
                                <select style={{ height: "40px", margin: "0 5px" }} onChange={(e) => set__area(e.target.value)}>
                                    <option value="">エリア</option>
                                    {japanRegions.map((r, index) => <option key={index}>{r.region}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='dp-flex'>
                    <Input name="施設の検索" onChange={(e) => setSearch(e)} value={search} />
                </div>
                {data.length ? data.slice(page * limit, (page * limit) + limit).map((item, index) =>
                    <div key={index} className='flexbox hover-background-color-128-15p hover-boder-radius-5px hover-opacity-1 bg-even'
                        style={{ cursor: "pointer", height: "40px" }}>
                        <div style={{ width: "40px" }}>
                            {currentUser.position === "admin" ? selectId.includes(item._id) ?
                                <CheckBoxOutlinedIcon style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "5px" }}
                                    onClick={() => setSelectId(p => p.filter(i => i != item._id))} /> :
                                <CheckBoxOutlineBlankIcon style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "5px" }}
                                    onClick={() => setSelectId(p => [...p, item._id])} /> : <LabelIcon style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "5px" }} />}
                        </div>
                        <div style={{ width: "100%", height: "100%", lineHeight: "50px" }}><p onClick={() => toPage.push("facility/" + item.slug)}>{item.name}</p></div>
                        <div style={{ width: "50px" }}>{currentUser.position === "admin" && <DeleteIcon style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "5px" }}
                            onClick={() => (setId(item._id), store.dispatch(setAlert({ open: true, msg: "この投稿を削除してもよろしいですか?", value: false })))} />}</div>
                    </div>) :
                    <div className='flexbox'>
                        <div style={{ width: "50px" }}></div>
                        <div style={{ width: "100%", textAlign: "center" }}>{loading ? <p>少々お待ちください。</p> : <p>{notice ? notice : "施設一覧がありません。"}</p>}</div>
                        <div style={{ width: "50px" }}></div>
                    </div>
                }

                {
                    data.length ? <Pagination page={page} next={() => setPage(p => p + 1)} prev={() => setPage(p => p - 1)} end={data[(page + 1) * limit]?._id ? false : true} onClick={(p) => setPage(p)} /> : null
                }
            </div >
        </div >
    )

}

export default Page