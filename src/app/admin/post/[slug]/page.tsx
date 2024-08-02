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

    const [saving, setSaving] = useState<boolean>(false)
    const [savable, setSavable] = useState<boolean>(false)

    const [id, setId] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const [slug, setSlug] = useState<string>("post_" + moment(new Date()).format("YYYY_MM_DD"))
    const [workplace, setWorkplace] = useState<string>("")
    const [worktype, setWorktype] = useState<string>("")
    const [workstatus, setWorkstatus] = useState<string>("")
    const [worktime, setWorkTime] = useState<string>("")
    const [worksalary, setWorksalary] = useState<string>("")
    const [workbenefit, setWorkbenefit] = useState<string>("")
    const [location, setLocation] = useState<string>("")
    const [contenttitle, setcontenttilte] = useState<string>("")
    const [detail, setDetail] = useState<string>("もう少し仕事内容をシェアしてください。")
    const [newdetail, setNewDetail] = useState<string>("")
    const [image, setImage] = useState<string>("")
    const [imagePreview, setImagePreview] = useState<string>("")
    const [change, setChange] = useState<number>(0)

    const [facility, setFacility] = useState<any[]>([])

    const toPage = useRouter()

    const body = {
        title,
        slug,
        workplace,
        worktype,
        workstatus,
        location,
        contenttitle,
        image,
        content: newdetail || detail,
        worktime,
        worksalary,
        workbenefit,
    }

    const getFacility = async (p: string, a: string, s: string, skip: number | undefined, limit: number | undefined) => {
        const result = await UserAuthen.getItem(p, a, s, skip, limit)
        if (result.success) {
            setFacility(result.data)
        }
    }

    const getOnePost = async (p: string, a: string, s: string) => {
        const result = await UserAuthen.getOneItembySlug(p, a, s)
        console.log(result)
        if (result.success) {
            setId(result.data[0]._id)
            setTitle(result.data[0].title)
            setSlug(result.data[0].slug)
            setWorkplace(result.data[0].workplace)
            setWorktype(result.data[0].worktype)
            setWorkstatus(result.data[0].workstatus)
            setLocation(result.data[0].location)
            setcontenttilte(result.data[0].contenttitle)
            setDetail(result.data[0].content)
            setImage(result.data[0].image)
            setWorkTime(result.data[0].worktime)
            setWorksalary(result.data[0].worksalary)
            setWorkbenefit(result.data[0].workbenefit)
        }
    }
    useEffect(() => {
        currentUser.position && params.slug !== "new" && getOnePost(currentUser.position, "post", params.slug)
    }, [currentUser.position, params.slug])

    const createPost = async (body: any) => {
        setSaving(true)
        const result = await UserAuthen.createItem(currentUser.position, "post", body)

        if (result.success) {
            setSaving(false)
            toPage.push("/admin/post")
        }
    }
    const UpdatePost = async (body: any) => {
        setSaving(true)
        const result = await UserAuthen.updateItem(currentUser.position, "post", id, body)
        if (result.success) {
            setTimeout(() => {
                setSaving(false)
                toPage.push("/admin/post")
            }, 1000);
        }
    }
    const UpdatePostDemo = async (body: any) => {
        body.slug = body.slug + "_demo"
        const result = await UserAuthen.updateItem(currentUser.position, "post", "664eb0c390ea82cc9da49e9f", body)
        if (result) {
            window.open('/home/post/' + body.slug, '_blank');
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
        getFacility(currentUser.position, "facility", "", undefined, undefined)
    }, [])

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
                        <Button name="戻る" onClick={() => toPage.push("/admin/post")} />
                        <Input name="タイトル" onChange={(e) => setTitle(e)} value={title} />
                        <Input name="スラグ" onChange={(e) => setSlug(e)} value={slug} />
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
                        <Input name="職種" onChange={(e) => setWorktype(e)} value={worktype} />
                        <Input name="雇用形態" onChange={(e) => setWorkstatus(e)} value={workstatus} />
                        <Input name="エリア" onChange={(e) => setLocation(e)} value={location} />
                        <Input name="勤務時間" onChange={(e) => setWorkTime(e)} value={worktime} />
                        <Input name="給与" onChange={(e) => setWorksalary(e)} value={worksalary} />
                        <Input name="休⽇休暇" onChange={(e) => setWorkbenefit(e)} value={workbenefit} />
                        <Input name="仕事内容タイトル" onChange={(e) => setcontenttilte(e)} value={contenttitle} />
                        <TextAreaTool_v2 onChange={(e) => setNewDetail(e)} value={detail} />
                        <div style={{ display: "flex", margin: "10px 0" }}>
                            {saving ? <Button name='。。。' onClick={() => { }} /> : <Button name='作成' onClick={() => createPost(body)} disable={title && slug && image ? false : true} />}
                            <Button name="プレビュー" onClick={() => UpdatePostDemo(body)} />
                        </div>
                    </div>
                    <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onImages={(arrId) => { setOpenModal(false), setImage(arrId[0].id) }} />
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
                <Button name="戻る" onClick={() => toPage.push("/admin/post")} />
                <Input name="タイトル" onChange={(e) => { setSavable(true); setTitle(e) }} value={title} />
                <Input name="スラグ" onChange={(e) => { setSavable(true); setSlug(e) }} value={slug} />
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
                <Input name="職種" onChange={(e) => { setSavable(true); setWorktype(e) }} value={worktype} />
                <Input name="雇用形態" onChange={(e) => { setSavable(true); setWorkstatus(e) }} value={workstatus} />
                <Input name="エリア" onChange={(e) => { setSavable(true); setLocation(e) }} value={location} />
                <Input name="勤務時間" onChange={(e) => setWorkTime(e)} value={worktime} />
                <Input name="給与" onChange={(e) => setWorksalary(e)} value={worksalary} />
                <Input name="休⽇休暇" onChange={(e) => setWorkbenefit(e)} value={workbenefit} />
                <Input name="仕事内容タイトル" onChange={(e) => { setSavable(true); setcontenttilte(e) }} value={contenttitle} />
                <TextAreaTool_v2 onChange={(e) => { setNewDetail(e); setChange(c => c + 1) }} value={detail} />
                <div style={{ display: "flex", margin: "10px 0" }}>
                    {saving ? <Button name='。。。' onClick={() => { }} /> : <Button name='保存' disable={!savable} onClick={() => UpdatePost(body)} />}
                    <Button name="プレビュー" onClick={() => UpdatePostDemo(body)} />
                </div>
            </div>
            <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onImages={(arrId) => { setOpenModal(false), setImage(arrId[0].id); setSavable(true) }} />
        </div>
    )
}

export default Page