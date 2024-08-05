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
// import ImageModal from '@/component/tool/imageModal';
import ImageModal from '@/component/tool/imageModal_v2';
import TextAreaTool_v2 from '@/component/input/textareaTool_v2';
import moment from 'moment';
import { NoUserAuthen } from '@/api/NoUserAuthen';
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

    const [facility, setFacility] = useState<any[]>([])

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

    const getFacility = async () => {
        const result = await NoUserAuthen.getItem("facility", "", "", "", "", "", undefined, undefined)
        if (result.success) {
            setFacility(result.data)
        }
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
        const result = await UserAuthen.updateItem(currentUser.position, "interview", "66ab3ed4b494bfd095780b34", body)
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


    useEffect(() => {
        getFacility()
    }, [])
    switch (params.slug) {
        case "new":
            return (
                <div className='grid_box scrollNone m'>
                    <div className={`detailBox xs12 scrollbar-none`} style={{ padding: "0 10px", height: "calc(100vh - 60px)", overflow: "auto" }}>
                        <Button name="戻る" onClick={() => toPage.back()} />
                        <Input name="名前" onChange={(e) => { setSavable(true); setName(e) }} value={name} />
                        <Input name="スラグ" onChange={(e) => { setSavable(true); setSlug(e) }} value={slug} />
                        <div style={{ height: "300px", aspectRatio: 1, borderRadius: "5px", margin: "0px 0px 20px", boxShadow: "0px 0px 10px #444" }}>
                            <UploadPicturePreview
                                icon={<AddPhotoAlternateIcon style={{ width: "100%", height: "100%" }} />}
                                src={`${imagePreview ? process.env.FTP_URL + "img/career/" + imagePreview : "/img/defaultImg.jpg"}`}
                                size={30}
                                func={() => { setSavable(true); setOpenModal(true) }}
                            />
                        </div>
                        <Input name="職種" onChange={(e) => { setSavable(true), setWorktype(e) }} value={worktype} />
                        <Input name="仕事内容タイトル" onChange={(e) => { setSavable(true), setcontenttilte(e) }} value={contenttitle} />
                        <TextAreaTool_v2 onChange={(e) => { setNewDetail(e); setChange(c => c + 1) }} value={detail} />
                        <div style={{ display: "flex", margin: "10px 0" }}>
                            {saving ? <Button name='。。。' onClick={() => { }} /> : <Button name='作成' onClick={() => createPost(params.slug, body)} disable={name && slug && image && savable ? false : true} />}
                            <Button name="プレビュー" onClick={() => UpdatePostDemo(body)} />
                        </div>
                    </div>
                    <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onImages={(ArrId) => { setOpenModal(false), setImage(ArrId[0].id), setSavable(true) }} />
                </div>
            )

    }
    return (
        <div className='grid_box scrollNone mw1200px-grid-reverse'>
            <div className={`detailBox xs12 scrollbar-none`} style={{ padding: "0 10px", height: "calc(100vh - 60px)", overflow: "auto" }}>
                <Button name="戻る" onClick={() => toPage.back()} />
                <Input name="名前" onChange={(e) => { setSavable(true), setName(e) }} value={name} />
                <Input name="スラグ" onChange={(e) => { setSavable(true), setSlug(e) }} value={slug} />
                <div style={{ height: "300px", aspectRatio: 1, borderRadius: "5px", margin: "0px 0px 20px", boxShadow: "0px 0px 10px #444" }}>
                    <UploadPicturePreview
                        icon={<AddPhotoAlternateIcon style={{ width: "100%", height: "100%" }} />}
                        src={`${imagePreview ? process.env.FTP_URL + "img/career/" + imagePreview : "/img/defaultImg.jpg"}`}
                        size={30}
                        func={() => { setOpenModal(true), setSavable(true) }}
                    />
                </div>
                {facility?.length ?
                    <div>
                        <h4>事業所</h4>
                        <div style={{ height: "150px", overflow: "auto", background: "whitesmoke", padding: "0 5px" }}>
                            {
                                facility.map((item: any, index: number) =>
                                    <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                        <input type='checkbox' checked={workplace === item._id} onChange={() => { workplace === item._id ? setWorkplace("") : setWorkplace(item._id); setSavable(true) }} ></input>
                                        <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{item.name}</p>
                                    </div>
                                )}
                        </div>
                    </div> :
                    null
                }
                <Input name="職種" onChange={(e) => { setSavable(true), setWorktype(e) }} value={worktype} />
                <Input name="仕事内容タイトル" onChange={(e) => { setSavable(true); setcontenttilte(e) }} value={contenttitle} />
                <TextAreaTool_v2 onChange={(e) => { setNewDetail(e); setChange(c => c + 1) }} value={detail} />
                <div style={{ display: "flex", margin: "10px 0" }}>
                    {saving ? <Button name='。。。' onClick={() => { }} /> : <Button name='保存' onClick={() => UpdatePost(body)} disable={!savable} />}
                    <Button name="プレビュー" onClick={() => UpdatePostDemo(body)} />
                </div>
            </div>
            <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onImages={(ArrId) => { setOpenModal(false), setImage(ArrId[0].id), setSavable(true) }} />
        </div>
    )
}

export default Page