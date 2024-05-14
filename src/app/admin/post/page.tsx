'use client'
import React, { useState, useEffect } from 'react'
import store from '@/redux/store'
import { UserAuthen } from '@/api/UserAuthen'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import Button from '@/component/input/button';
type Props = {}

const Page = (props: Props) => {

    const [currentUser, setCurrentUser] = useState<any>(store.getState().user)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    })

    const [refresh, setRefresh] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)

    const toPage = useRouter()
    const [data, setData] = useState<any[]>([])
    const [search, setSearch] = useState<string>("")
    const [skip, setSkip] = useState<number>(5)
    const [limit, setLimit] = useState<number>(10)

    const [selectId, setSelectId] = useState<string[]>([])

    const getPost = async (p: string, a: string, s: string, sk: number, li: number) => {
        const result = await UserAuthen.getItem(p, a, s, sk, li)
        if (result.success) {
            setData(result.data)
            setLoading(false)
        } else {
            setData([])
            setLoading(false)
        }
    }
    useEffect(() => {
        currentUser.position && getPost(currentUser.position, "post", search, skip, limit)
    }, [refresh, currentUser.position, search, skip])

    const deletePost = async (id: string) => {
        const result = await UserAuthen.deleteItem(currentUser.position, "post", id)
        setRefresh(n => n + 1)
    }

    const deleteAllPost = async (array: string[]) => {
        array.forEach(item => {
            deletePost(item)
            setSelectId(p => p.filter(i => i != item))
            setRefresh(n => n + 1)
        })
    }
    return (
        <div style={{ height: "100vh", width: "90%", margin: "auto" }}>
            <div style={{ width: "max-content", margin: "0" }}>
                <Button name='新規' onClick={() => toPage.push("post/new")} />
            </div>
            <div className='flexbox' style={{ height: "40px" }}>
                <div style={{ width: "40px" }}>{selectId.length ?
                    <DeleteIcon style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "5px" }} onClick={() => deleteAllPost(selectId)} /> : null}
                </div>
                <div style={{ textAlign: "center", width: "calc(100% - 100px)", height: "100%", lineHeight: "50px", fontWeight: "bold" }}>タイトル</div>
                <div style={{ width: "40px" }}></div>
            </div>


            {data.length ? data.map((item, index) =>
                <div key={index} className='flexbox'
                    style={{ cursor: "pointer", height: "40px" }}>
                    <div style={{ width: "40px" }}>
                        {selectId.includes(item._id) ?
                            <CheckBoxOutlinedIcon style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "5px" }}
                                onClick={() => setSelectId(p => p.filter(i => i != item._id))} /> :
                            <CheckBoxOutlineBlankIcon style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "5px" }}
                                onClick={() => setSelectId(p => [...p, item._id])} />}
                    </div>
                    <div style={{ width: "100%", height: "100%", lineHeight: "50px" }}><p onClick={() => toPage.push("post/" + item.slug)}>{item.title}</p></div>
                    <div style={{ width: "50px" }}><DeleteIcon style={{ width: "100%", height: "100%", boxSizing: "border-box", padding: "5px" }}
                        onClick={() => deletePost(item._id)} /></div>
                </div>) :
                <div className='flexbox'>
                    <div style={{ width: "50px" }}></div>
                    <div style={{ width: "100%", textAlign: "center" }}>{loading ? <p>少々お待ちください。</p> : <p>ポストがありません。</p>}</div>
                    <div style={{ width: "50px" }}></div>
                </div>
            }

        </div >
    )
}

export default Page