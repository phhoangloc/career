'use client'
import React, { useState, useEffect } from 'react'
import Button from '@/component/input/button'
import UploadButton from '@/component/input/uploadButton'
import store from '@/redux/store'
import { UserAuthen } from '@/api/UserAuthen'
import Image from 'next/image'
import DeleteIcon from '@mui/icons-material/Delete';
type Props = {
    modalOpen?: boolean
    onCanel?: () => void
    onSubmit?: (id: string) => void
}

const ImageModal = ({ modalOpen, onCanel, onSubmit }: Props) => {

    const [loading, setLoading] = useState<boolean>(false)

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

    const [selectImageId, setSelectImageId] = useState<string>("")

    return (
        <div style={{ display: modalOpen ? "block" : "none", position: "fixed", height: "calc(100vh - 10px)", width: "calc(100vw - 10px)", background: "white", zIndex: 2, top: "0px", left: "0px", margin: "5px" }}>
            <div style={{ width: "max-content", margin: "10px" }}>
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
                            <div style={{
                                width: "100%",
                                aspectRatio: 1,
                                position: "relative",
                                borderRadius: "5px",
                                overflow: "hidden",
                                opacity: loading ? "0.25" : 1,
                                boxShadow: selectImageId.toString() === item._id.toString() ? "0px 0px 10px #888" : "0px 0px 1px  #888",
                                cursor: "pointer",
                            }}>
                                <Image quality={100} src={process.env.FTP_URL + "img/career/" + item.name} fill alt=""
                                    style={{
                                        objectFit: "cover",
                                        transition: "all 0.25s",
                                        transform: selectImageId.toString() === item._id.toString() ? "scale(1.025)" : "scale(1)",

                                    }} onClick={() => setSelectImageId(i => i.toString() !== item._id.toString() ? item._id : "")} />
                                <DeleteIcon
                                    onClick={() => { deleteImage(currentUser.position, "image", item._id) }}
                                    style={{ position: "absolute", zIndex: 1, background: "white", borderRadius: "5px", top: "5px", left: "5px", padding: "1px" }} />
                            </div>
                            <div style={{ width: "100%", textWrap: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {item.name}
                            </div>
                        </div>
                    )
                }
            </div>
            <div className='grid_box' style={{ width: "max-content", margin: "0" }} >
                <div style={{ width: "max-content", margin: "auto 5px" }}>
                    <Button name='キャンセル' onClick={() => onCanel && onCanel()} />
                </div>
                <div style={{ width: "max-content", margin: "auto 5px" }}>
                    <Button name='確認' onClick={() => onSubmit && onSubmit(selectImageId)} />

                </div>
            </div>
        </div >
    )
}

export default ImageModal