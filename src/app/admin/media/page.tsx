'use client'
import React, { useState, useEffect } from 'react'
import Button from '@/component/input/button'
import UploadButton from '@/component/input/uploadButton'
import store from '@/redux/store'
import { UserAuthen } from '@/api/UserAuthen'
import Image from 'next/image'
type Props = {}

const Page = (props: Props) => {

    const [loading, setLoading] = useState<boolean>(false)

    const [currentUser, setCurrentUser] = useState<any>(store.getState().user)

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
                // setRefresh(n => n + 1)
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
        currentUser.position && getMedia(currentUser.position, "image", "", undefined, undefined)
    }, [currentUser.position])

    console.log(data)
    return (
        <div style={{ minHeight: "calc(100vh - 70px)", width: "100%", margin: "auto 10px" }}>
            <div style={{ width: "max-content", margin: "0" }}>
                <UploadButton
                    icon={<Button name='新規' onClick={() => { }} />}
                    func={(e) => getFile(e)}
                />
            </div>
            <div>
                {
                    data.map((item, index) => <div key={index}>
                        <div style={{ width: "100%", aspectRatio: 2, position: "relative" }}><Image quality={100} src={process.env.FTP_URL + "upload/" + item.name} fill alt="" style={{ objectFit: "cover" }} /></div>
                        <div>{item.name}</div>
                    </div>)
                }
            </div>
        </div>
    )
}

export default Page