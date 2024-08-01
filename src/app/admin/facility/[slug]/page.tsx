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
import TextAreaTool_v2 from '@/component/input/textareaTool_v2';
import moment from 'moment';
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
    const [slug, setSlug] = useState<string>("ficility_" + moment(new Date()).format("YYYY_MM_DD"))
    const [address, setAddress] = useState<string>("")
    const [postno, setPostno] = useState<string>("")
    const [location, setLocation] = useState<string>("")
    const [wt, setWt] = useState<string>("")
    const [contenttitle, setcontenttilte] = useState<string>("")
    const [detail, setDetail] = useState<string>("もう少し事業内容をシェアしてください。")
    const [newdetail, setNewDetail] = useState<string>("")
    const [image, setImage] = useState<string>("")
    const [imagePreview, setImagePreview] = useState<string>("")

    const [change, setChange] = useState<number>(0)
    const [saving, setSaving] = useState<boolean>(false)
    const [savable, setSavable] = useState<boolean>(false)

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
        setSaving(true)
        const result = await UserAuthen.createItem(currentUser.position, "facility", body)
        if (result.success) {
            setSaving(false)
            toPage.push("/admin/facility")
        }
    }
    const UpdatePost = async (body: any) => {
        setSaving(true)
        const result = await UserAuthen.updateItem(currentUser.position, "facility", id, body)
        if (result.success) {
            setSaving(false)
            toPage.push("/admin/facility")
        }
    }
    const UpdatePostDemo = async (body: any) => {
        body.slug = body.slug + "_demo"
        const result = await UserAuthen.updateItem(currentUser.position, "facility", "66ab460cb494bfd095780b38", body)
        if (result) {
            window.open('/home/facility/' + body.slug, '_blank');
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


    useEffect(() => {
        change > 4 && setSavable(true)
    }, [change])

    console.log(change)
    switch (params.slug) {
        case "new":
            return (
                <div className='grid_box scrollNone mw1200px-grid-reverse'>
                    <div className={`xs12 xl4 `} style={{ padding: "10px" }} >
                        <div style={{ height: "50vh", borderRadius: "5px", top: "25%", textAlign: "center", overflow: "hidden", boxShadow: "0px 0px 10px #444" }}>
                            <UploadPicturePreview
                                icon={<AddPhotoAlternateIcon style={{ width: "100%", height: "100%" }} />}
                                src={`${imagePreview ? process.env.FTP_URL + "img/career/" + imagePreview : "/img/defaultImg.jpg"}`}
                                size={30}
                                func={() => setOpenModal(true)}
                            />
                        </div>
                    </div>
                    <div className={`detailBox xs12 xl8 scrollbar-none`} style={{ padding: "0 10px", height: "calc(100vh - 60px)", overflow: "auto" }}>
                        <Button name="戻る" onClick={() => toPage.back()} />
                        <Input name="名前" onChange={(e) => setName(e)} value={name} />
                        <Input name="スラグ" onChange={(e) => setSlug(e)} value={slug} />
                        <Input name="〒" onChange={(e) => setPostno(e)} value={postno} />
                        <Input name="住所" onChange={(e) => setAddress(e)} value={address} />
                        <Input name="職種" onChange={(e) => setWt(e)} value={wt} />
                        <Input name="エリア" onChange={(e) => setLocation(e)} value={location} />
                        <Input name="冒頭" onChange={(e) => setcontenttilte(e)} value={contenttitle} />
                        <TextAreaTool_v2 onChange={(e) => setNewDetail(e)} value={detail} />
                        <div style={{ display: "flex", margin: "10px 0" }}>
                            {saving ? <Button name='。。。' onClick={() => { }} /> : <Button name='作成' onClick={() => createPost(body)} disable={name && slug && image ? false : true} />}
                            <Button name="プレビュー" onClick={() => UpdatePostDemo(body)} />
                        </div>
                    </div>
                    <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onSubmit={(id) => { setOpenModal(false), setImage(id) }} />
                </div>
            )

    }
    return (
        <div className='grid_box scrollNone mw1200px-grid-reverse'>
            <div className={`xs12 xl4 `} style={{ padding: "10px" }} >
                <div style={{ height: "50vh", borderRadius: "5px", top: "25%", textAlign: "center", overflow: "hidden", boxShadow: "0px 0px 10px #444" }}>
                    <UploadPicturePreview
                        icon={<AddPhotoAlternateIcon style={{ width: "100%", height: "100%" }} />}
                        src={`${imagePreview ? process.env.FTP_URL + "img/career/" + imagePreview : "/img/defaultImg.jpg"}`}
                        size={30}
                        func={() => setOpenModal(true)}
                    />
                </div>
            </div>
            <div className={`detailBox xs12 xl8 scrollbar-none`} style={{ padding: "0 10px", height: "calc(100vh - 60px)", overflow: "auto" }}>
                <Button name="戻る" onClick={() => toPage.back()} />
                <Input name="名前" onChange={(e) => { setSavable(true); setName(e) }} value={name} />
                <Input name="スラグ" onChange={(e) => { setSavable(true); setSlug(e) }} value={slug} />
                <Input name="〒" onChange={(e) => { setSavable(true); setPostno(e) }} value={postno} />
                <Input name="住所" onChange={(e) => { setSavable(true); setAddress(e) }} value={address} />
                <Input name="職種" onChange={(e) => { setSavable(true); setWt(e) }} value={wt} />
                <Input name="エリア" onChange={(e) => { setSavable(true); setLocation(e) }} value={location} />
                <Input name="冒頭" onChange={(e) => { setSavable(true); setcontenttilte(e) }} value={contenttitle} />
                <TextAreaTool_v2 onChange={(e) => { setNewDetail(e); setChange(c => c + 1) }} value={detail} />
                <div style={{ display: "flex", margin: "10px 0" }}>
                    {saving ? <Button name='。。。' onClick={() => { }} /> : <Button name='保存' disable={!savable} onClick={() => UpdatePost(body)} />}
                    <Button name="プレビュー" onClick={() => UpdatePostDemo(body)} />
                </div>
            </div>
            <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onSubmit={(id) => { setOpenModal(false), setImage(id) }} />
        </div>
    )
}

export default Page