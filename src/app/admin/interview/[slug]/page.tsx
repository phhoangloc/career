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
    const [slug, setSlug] = useState<string>("interview_" + moment(new Date()).format("YYYY_MM_DD"))
    const [workplace, setWorkplace] = useState<string>("")
    const [worktype, setWorktype] = useState<string>("")
    const [location, setLocation] = useState<string>("")
    const [contenttitle, setcontenttilte] = useState<string>("")
    const [detail, setDetail] = useState<string>("もう少し仕事内容をシェアしてください。")
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
        workplace,
        worktype,
        location,
        contenttitle,
        image,
        content: newdetail || detail
    }
    const getOnePost = async (p: string, a: string, s: string) => {
        const result = await UserAuthen.getOneItembySlug(p, a, s)

        if (result.success) {

            setId(result.data[0]._id)
            setName(result.data[0].name)
            setSlug(result.data[0].slug)
            setWorkplace(result.data[0].workplace)
            setWorktype(result.data[0].worktype)
            setLocation(result.data[0].location)
            setcontenttilte(result.data[0].contenttitle)
            setDetail(result.data[0].content)
            setImage(result.data[0].image)
        }
    }
    useEffect(() => {
        currentUser.position && params.slug !== "new" && getOnePost(currentUser.position, "interview", params.slug)
    }, [currentUser.position, params.slug])

    const createPost = async (slug: string, body: any) => {
        setSaving(true)
        const result = await UserAuthen.createItem(currentUser.position, "interview", body)
        if (result.success) {
            setSaving(false)
            toPage.push("/admin/interview")
        }
    }
    const UpdatePost = async (body: any) => {
        setSaving(true)

        const result = await UserAuthen.updateItem(currentUser.position, "interview", id, body)
        if (result.success) {
            setSaving(true)
            toPage.push("/admin/interview")
        }
    }

    const UpdatePostDemo = async (body: any) => {
        body.slug = body.slug + "_demo"
        const result = await UserAuthen.updateItem(currentUser.position, "interview", "66457e7f739bd93453266ed4", body)
        if (result) {
            window.open('/home/interview/' + body.slug, '_blank');
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


    switch (params.slug) {
        case "new":
            return (
                <div className='grid_box scrollNone mw1200px-grid-reverse'>
                    <div className={`xs12 lg6 xl4 `} style={{ padding: "10px" }} >
                        <div style={{ height: "400px", aspectRatio: 1, borderRadius: "5px", margin: "auto", boxShadow: "0px 0px 10px #444" }}>
                            <UploadPicturePreview
                                icon={<AddPhotoAlternateIcon style={{ width: "100%", height: "100%" }} />}
                                src={`${imagePreview ? process.env.FTP_URL + "img/career/" + imagePreview : "/img/defaultImg.jpg"}`}
                                size={30}
                                func={() => setOpenModal(true)}
                            />
                        </div>
                    </div>
                    <div className={`detailBox xs12 lg6 xl8 scrollbar-none`} style={{ padding: "0 10px", height: "calc(100vh - 60px)", overflow: "auto" }}>
                        <Button name="戻る" onClick={() => toPage.back()} />
                        <Input name="名前" onChange={(e) => setName(e)} value={name} />
                        <Input name="スラグ" onChange={(e) => setSlug(e)} value={slug} />
                        <Input name="事業所" onChange={(e) => setWorkplace(e)} value={workplace} />
                        <Input name="職種" onChange={(e) => setWorktype(e)} value={worktype} />
                        <Input name="エリア" onChange={(e) => setLocation(e)} value={location} />
                        <Input name="仕事内容タイトル" onChange={(e) => setcontenttilte(e)} value={contenttitle} />
                        <TextAreaTool_v2 onChange={(e) => { setNewDetail(e); setChange }} value={detail} />
                        <div style={{ display: "flex", margin: "10px 0" }}>
                            {saving ? <Button name='。。。' onClick={() => { }} /> : <Button name='作成' onClick={() => createPost(params.slug, body)} disable={name && slug && image ? false : true} />}
                            <Button name="プレビュー" onClick={() => UpdatePostDemo(body)} />
                        </div>
                    </div>
                    <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onSubmit={(id) => { setOpenModal(false), setImage(id) }} />
                </div>
            )

    }
    return (
        <div className='grid_box scrollNone mw1200px-grid-reverse'>
            <div className={`xs12 lg6 xl4 `} style={{ padding: "10px" }} >
                <div style={{ height: "400px", aspectRatio: 1, borderRadius: "5px", margin: "auto", boxShadow: "0px 0px 10px #444" }}>
                    <UploadPicturePreview
                        icon={<AddPhotoAlternateIcon style={{ width: "100%", height: "100%" }} />}
                        src={`${imagePreview ? process.env.FTP_URL + "img/career/" + imagePreview : "/img/defaultImg.jpg"}`}
                        size={30}
                        func={() => setOpenModal(true)}
                    />
                </div>
            </div>
            <div className={`detailBox xs12 lg6 xl8 scrollbar-none`} style={{ padding: "0 10px", height: "calc(100vh - 60px)", overflow: "auto" }}>
                <Button name="戻る" onClick={() => toPage.back()} />
                <Input name="名前" onChange={(e) => setName(e)} value={name} />
                <Input name="スラグ" onChange={(e) => setSlug(e)} value={slug} />
                <Input name="事業所" onChange={(e) => setWorkplace(e)} value={workplace} />
                <Input name="職種" onChange={(e) => setWorktype(e)} value={worktype} />
                <Input name="エリア" onChange={(e) => setLocation(e)} value={location} />
                <Input name="仕事内容タイトル" onChange={(e) => setcontenttilte(e)} value={contenttitle} />
                <TextAreaTool_v2 onChange={(e) => { setNewDetail(e); setChange }} value={detail} />
                <Button name='保存' onClick={() => UpdatePost(body)} />
            </div>
            <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onSubmit={(id) => { setOpenModal(false), setImage(id) }} />
        </div>
    )
}

export default Page