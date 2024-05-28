'use client'
import React, { useState, useEffect } from 'react'
import Button from '@/component/input/button'
import UploadButton from '@/component/input/uploadButton'
import store from '@/redux/store'
import { UserAuthen } from '@/api/UserAuthen'
import Image from 'next/image'
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
const Page = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [copy, setCopy] = useState<boolean>(false)
    const [i, setI] = useState<number>(-1)

    const [currentUser, setCurrentUser] = useState<any>(store.getState().user)
    const [refresh, setRefresh] = useState<number>(0)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    })
    const getFile = async (e: any) => {
        var files = e.target.files;
        const file: File = files[0]
        var reader: any = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async function () {
            // create && create(reader.result, file)
            setLoading(true)
            const result = currentUser.position && await UserAuthen.uploadFile(currentUser.position, file, "pic")
            if (result) {
                setLoading(false)
                setRefresh(n => n + 1)
            }
        }
    }

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
        currentUser.position && getMedia(currentUser.position, "pic", "", undefined, undefined)
    }, [currentUser.position, refresh])

    const deleteImage = async (p: string, a: string, id: string) => {
        setLoading(true)
        const result = await UserAuthen.deleteItem(p, a, id)
        if (result.success) {
            setLoading(false)
            setRefresh(n => n + 1)
        }
    }


    return (
        <div style={{ minHeight: "calc(100vh - 70px)", width: "100%", margin: "auto 10px" }}>
            <div style={{ width: "max-content", margin: "0 10px" }}>
                {loading ?
                    <UploadButton
                        icon={<Button name='。。。' onClick={() => { }} />}
                        func={(e) => { }}
                    />
                    : <UploadButton
                        icon={<Button name='新規' onClick={() => { }} />}
                        func={(e) => getFile(e)}
                    />}
            </div>
            <div className='grid_box'>
                {
                    data.map((item, index) =>
                        <div key={index} className='xs6 sm4 md3 lg2 grid_child' >
                            <div style={{ width: "100%", aspectRatio: 1, position: "relative", borderRadius: "5px", overflow: "hidden", opacity: loading ? "0.25" : 1 }}>
                                <Image quality={100} src={process.env.FTP_URL + "upload/" + item.name} fill alt="" style={{ objectFit: "cover" }} />
                                <DeleteIcon
                                    onClick={() => { deleteImage(currentUser.position, "image", item._id) }}
                                    style={{ position: "absolute", zIndex: 1, background: "white", borderRadius: "5px", top: "5px", left: "5px", padding: "1px", color: "#006699" }} />
                            </div>
                            <div style={{ display: "flex", fontSize: "0.8rem" }}>
                                {copy && i === index ? <CheckIcon /> :
                                    <ContentCopyIcon onClick={() => { setCopy(true), setI(index), navigator.clipboard.writeText(process.env.FTP_URL + "upload/" + item.name) }} />}
                                <p style={{ textOverflow: "ellipsis", overflow: 'hidden', lineHeight: "32px" }}>{process.env.FTP_URL + "upload/" + item.name}</p>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )


}

export default Page