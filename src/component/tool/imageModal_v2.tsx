'use client'
import React, { useState, useEffect } from 'react'
import UploadButton from '@/component/input/uploadButton'
import store from '@/redux/store'
import { UserAuthen } from '@/api/UserAuthen'
import Image from 'next/image'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PendingIcon from '@mui/icons-material/Pending';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

type Props = {
    modalOpen?: boolean
    onCanel?: () => void
    onImages?: (arr: any[]) => void
}

const ImageModal = ({ modalOpen, onCanel, onImages }: Props) => {

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
            setLoading(true)
            const result = currentUser.position && await UserAuthen.uploadFile(currentUser.position, file, "pic")
            if (result) {
                setLoading(false)
                setRefresh(n => n + 1)
            }
        }
    }

    const [data, setData] = useState<any[]>([])
    const getMedia = async (p: string, genre: string) => {
        const result = await UserAuthen.getItem(p, genre, "", undefined, undefined)
        if (result.success) {
            setData(result.data)
        } else {
            setData([])
        }
    }

    useEffect(() => {
        currentUser.position && getMedia(currentUser.position, "pic")
    }, [currentUser.position, refresh])


    const [selectImageId, setSelectImageId] = useState<string>("")
    const [selectImageIdArr, setSelectImageIdArr] = useState<any[]>([])

    return (
        <div className='bg-drop of-auto ps-f h100h w100w zi-5 top-0px le-0px pd-5px fd-col jc-center'
            style={{ display: modalOpen ? "flex" : "none" }}>
            <div style={{ maxWidth: "1200px", margin: "auto", width: "100%" }}>
                <div className='bglv1 ps-re dp-flex jc-end'>
                    <CloseIcon className="svg30px" onClick={() => onCanel && onCanel()} />
                </div>
                <div className='grid_box bglv1 mh-500px of-auto scrollbar-none'>
                    {
                        data.map((item, index) =>
                            <div key={index} className='xs4 sm3 md2 grid_child pd-5px br-5px zi-3  ' >
                                <div className='ps-re aspect-1 w100p of-hidden cs-p br-5px trss-1-4 bglv1' style={{
                                    opacity: loading ? "0.25" : selectImageIdArr.length ? selectImageIdArr.some(obj => obj.id === item._id) ? 1 : 0.5 : selectImageId.toString() === item._id.toString() ? 1 : 0.5,
                                    transform: selectImageIdArr.length ? selectImageIdArr.some(obj => obj.id === item._id) ? "scaleY(.95)" : "scaleY(1)" : selectImageId.toString() === item._id.toString() ? "scaleY(.95)" : "scaleY(1)",
                                }}>
                                    <Image quality={100} src={process.env.FTP_URL + "img/career/" + item.name} fill alt=""
                                        style={{
                                            objectFit: "cover",
                                            transition: "all 0.25s",
                                        }}
                                        onClick={(e) => {
                                            const src = { id: item._id, src: e.currentTarget.src }
                                            // src && setSelectImageIdArr(arr => arr.some(obj => obj.id === item._id) ? arr.filter(a => a.id !== item._id) : [...arr, src])
                                            src && setSelectImageIdArr([src])
                                            setSelectImageId("")
                                        }} />
                                </div>
                                <div className='h0px trss-1-2' style={{
                                    borderBottom: "3px solid",
                                    margin: "auto",
                                    width:
                                        selectImageIdArr.length ?
                                            selectImageIdArr.some(obj => obj.id === item._id) ? "100%" : "0px"
                                            : selectImageId.toString() === item._id.toString() ? "100%" : "0px"
                                }}></div>
                            </div>
                        )
                    }
                </div>
                <div className='bglv1 dp-flex jc-space' >
                    {loading ?
                        <UploadButton
                            icon={<PendingIcon className='svg30px' />}
                            func={(e) => { }}
                        />
                        : <UploadButton
                            icon={<AddPhotoAlternateIcon className='svg30px' />}
                            func={(e) => getFile(e)}
                        />}
                    {selectImageIdArr.length ?
                        <CheckIcon className="svg30px" onClick={() => { onImages && onImages(selectImageIdArr); setSelectImageId(""), setSelectImageIdArr([]) }} /> : null
                    }
                </div>
            </div>
        </div>
    )
}

export default ImageModal