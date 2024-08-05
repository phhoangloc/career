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
        currentUser.position && getPost(currentUser.position, "facility", search, page * limit, limit)
        currentUser.position && getPost_v2(currentUser.position, "facility", search, (page + 1) * limit, limit)
    }, [refresh, currentUser.position, search, page])

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
        <div style={{ height: "calc(100vh - 60px)", width: "100%", padding: "0 10px" }}>
            <div style={{ width: "max-content", margin: "0" }}>
                <Button name='新規' onClick={() => toPage.push("facility/new")} />
            </div>
            <div className='flexbox' style={{ height: "40px" }}>
                <div style={{ width: "40px" }}>{selectId.length ?
                    <DeleteIcon style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "5px" }} onClick={() => store.dispatch(setAlert({ open: true, msg: "この投稿を削除してもよろしいですか?", value: false }))} /> : null}
                </div>
                <div style={{ textAlign: "center", width: "calc(100% - 100px)", height: "100%", lineHeight: "50px", fontWeight: "bold" }}>施設一覧</div>
                <div style={{ width: "40px" }}></div>
            </div>


            {data.length ? data.map((item, index) =>
                <div key={index} className='flexbox hover-background-color-128-15p hover-boder-radius-5px hover-opacity-1'
                    style={{ cursor: "pointer", height: "40px" }}>
                    <div style={{ width: "40px" }}>
                        {selectId.includes(item._id) ?
                            <CheckBoxOutlinedIcon style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "5px" }}
                                onClick={() => setSelectId(p => p.filter(i => i != item._id))} /> :
                            <CheckBoxOutlineBlankIcon style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "5px" }}
                                onClick={() => setSelectId(p => [...p, item._id])} />}
                    </div>
                    <div style={{ width: "100%", height: "100%", lineHeight: "50px" }}><p onClick={() => toPage.push("facility/" + item.slug)}>{item.name}</p></div>
                    <div style={{ width: "50px" }}><DeleteIcon style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "5px" }}
                        onClick={() => (setId(item._id), store.dispatch(setAlert({ open: true, msg: "この投稿を削除してもよろしいですか?", value: false })))} /></div>
                </div>) :
                <div className='flexbox'>
                    <div style={{ width: "50px" }}></div>
                    <div style={{ width: "100%", textAlign: "center" }}>{loading ? <p>少々お待ちください。</p> : <p>{notice ? notice : "施設一覧がありません。"}</p>}</div>
                    <div style={{ width: "50px" }}></div>
                </div>
            }

            {
                data.length ? <Pagination page={page} next={() => setPage(p => p + 1)} prev={() => setPage(p => p - 1)} end={end} /> : null
            }
        </div >
    )

}

export default Page