'use client'
import React, { useState, useEffect } from 'react'
import UploadPicturePreview from '@/component/input/uploadPicturePreview'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Input from '@/component/input/input';
import TextAreaTool from '@/component/input/textareaTool';
import Button from '@/component/input/button';
import { useRouter } from 'next/navigation';
import { UserAuthen } from '@/api/UserAuthen';
import store from '@/redux/store';
import ImageModal from '@/component/tool/imageModal';
type Props = {
    params: { slug: string }
}

const Page = ({ params }: Props) => {

    const [currentUser, setCurrentUser] = useState<any>(store.getState().user)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    })

    const [id, setId] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [slug, setSlug] = useState<string>("")
    const [address, setAddress] = useState<string>("")
    const [postno, setPostno] = useState<string>("")
    const [location, setLocation] = useState<string>("")
    const [wt, setWt] = useState<string>("")
    const [contenttitle, setcontenttilte] = useState<string>("")
    const [detail, setDetail] = useState<string>("もう少し事業内容をシェアしてください。")
    const [newdetail, setNewDetail] = useState<string>("")
    const [image, setImage] = useState<string>("")
    const [imagePreview, setImagePreview] = useState<string>("")

    const toPage = useRouter()
    const body = {
        name,
        slug,
        address,
        postno,
        location,
        worktype: wt,
        contenttitle,
        image: image || null,
        content: newdetail || detail
    }
    const getOnePost = async (p: string, a: string, s: string) => {
        const result = await UserAuthen.getOneItembySlug(p, a, s)

        if (result.success && result.data[0]._id) {

            setId(result.data[0]._id)
            setName(result.data[0].name)
            setSlug(result.data[0].slug)
            setAddress(result.data[0].address)
            setPostno(result.data[0].postno)
            setLocation(result.data[0].location)
            setWt(result.data[0].worktype)
            setcontenttilte(result.data[0].contenttitle)
            setDetail(result.data[0].content)
            setImage(result.data[0].image)
        }
    }
    useEffect(() => {
        currentUser.position && params.slug !== "new" && getOnePost(currentUser.position, "facility", params.slug)
    }, [currentUser.position, params.slug])

    const createPost = async (body: any) => {
        const result = await UserAuthen.createItem(currentUser.position, "facility", body)
        if (result.success) {
            toPage.push("./" + body.slug)
        }
    }
    const UpdatePost = async (body: any) => {
        const result = await UserAuthen.updateItem(currentUser.position, "facility", id, body)
        if (result.success) {
            toPage.push("./" + body.slug)
        }
    }

    const GetPicturePreview = async (p: string, id: string) => {
        const result = await UserAuthen.getPicById(p, id)
        if (result.success) {
            setImagePreview(result.data[0].name)
        }
    }

    useEffect(() => {
        image && GetPicturePreview(currentUser.position, image)
    }, [image])

    const [openModal, setOpenModal] = useState<boolean>(false)


    switch (params.slug) {
        case "new":
            return (
                <div className='grid_box scrollNone'>
                    <div className={`center xs12 md6 lg4 stickyBox`} style={{ height: "50vh", margin: "10px", borderRadius: "5px", top: "25%", textAlign: "center", overflow: "hidden", boxShadow: "0px 0px 10px #444" }}>
                        <UploadPicturePreview
                            icon={<AddPhotoAlternateIcon style={{ width: "100%", height: "100%" }} />}
                            src={`${imagePreview ? process.env.FTP_URL + "upload/" + imagePreview : "/img/defaultImg.jpg"}`}
                            size={30}
                            func={() => setOpenModal(true)}
                        />
                    </div>
                    <div className={`detailBox xs12 md6 lg8 `} style={{ overflowX: "hidden", margin: "0 10px", }}>
                        <Button name="戻る" onClick={() => toPage.back()} />
                        <Input name="名前" onChange={(e) => setName(e)} value={name} />
                        <Input name="スラグ" onChange={(e) => setSlug(e)} value={slug} />
                        <Input name="〒" onChange={(e) => setPostno(e)} value={postno} />
                        <Input name="住所" onChange={(e) => setAddress(e)} value={address} />
                        <Input name="職種" onChange={(e) => setWt(e)} value={wt} />
                        <Input name="エリア" onChange={(e) => setLocation(e)} value={location} />
                        <Input name="冒頭" onChange={(e) => setcontenttilte(e)} value={contenttitle} />
                        <TextAreaTool name='事業内容' onChange={(e) => setNewDetail(e)} value={detail} />
                        <Button name='create' onClick={() => createPost(body)} />
                    </div>
                    <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onSubmit={(id) => { setOpenModal(false), setImage(id) }} />
                </div>
            )

    }
    return (
        <div className='grid_box scrollNone'>
            <div className={`center xs12 md6 lg4 stickyBox`} style={{ height: "50vh", margin: "10px", borderRadius: "5px", top: "25%", textAlign: "center", overflow: "hidden", boxShadow: "0px 0px 10px #444" }}>
                <UploadPicturePreview
                    icon={<AddPhotoAlternateIcon style={{ width: "100%", height: "100%" }} />}
                    src={`${imagePreview ? process.env.FTP_URL + "upload/" + imagePreview : "/img/defaultImg.jpg"}`}
                    size={30}
                    func={() => setOpenModal(true)}
                />
            </div>
            <div className={`detailBox xs12 md6 lg8 `} style={{ overflowX: "hidden", margin: "0 10px", }}>
                <Button name="戻る" onClick={() => toPage.back()} />
                <Input name="名前" onChange={(e) => setName(e)} value={name} />
                <Input name="スラグ" onChange={(e) => setSlug(e)} value={slug} />
                <Input name="〒" onChange={(e) => setPostno(e)} value={postno} />
                <Input name="住所" onChange={(e) => setAddress(e)} value={address} />
                <Input name="職種" onChange={(e) => setWt(e)} value={wt} />
                <Input name="エリア" onChange={(e) => setLocation(e)} value={location} />
                <Input name="冒頭" onChange={(e) => setcontenttilte(e)} value={contenttitle} />
                <TextAreaTool name='事業内容' onChange={(e) => setNewDetail(e)} value={detail} />
                <Button name='save' onClick={() => UpdatePost(body)} />

            </div>
            <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onSubmit={(id) => { setOpenModal(false), setImage(id) }} />
        </div>
    )
}

export default Page