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
import DOMPurify from 'dompurify';
import { japanPrefectures, japanRegions } from '@/lib/area';
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
        contenttitle,
        image,
        content: newdetail || detail,
        worktime,
        worksalary,
        workbenefit,
    }

    const [search, setSearch] = useState<string>("")
    const [area, setArea] = useState<string>("")
    const [location, setLocation] = useState<string>("")

    const getFacility = async () => {
        const result = await UserAuthen.getItem(currentUser.position, "facility", search, undefined, undefined, location, area)
        if (result.success) {
            setFacility(result.data)
        }
    }

    const getOnePost = async (p: string, a: string, s: string) => {
        const result = await UserAuthen.getOneItembySlug(p, a, s)
        if (result.success) {
            setId(result.data[0]._id)
            setTitle(result.data[0].title)
            setSlug(result.data[0].slug)
            setWorkplace(result.data[0].workplace)
            setWorktype(result.data[0].worktype)
            setWorkstatus(result.data[0].workstatus)
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
        getFacility()
    }, [search, area, location])


    switch (params.slug) {
        case "new":
            return (
                <div className='grid_box scrollNone'>
                    <div className={`scrollbar-none`} style={{ width: "100%", maxWidth: "992px", padding: "0 10px", margin: "auto", height: "calc(100vh - 60px)", overflow: "auto" }}>

                        <Button name="戻る" onClick={() => toPage.push("/admin/post")} />
                        <Input name="タイトル" onChange={(e) => { setSavable(true); setTitle(e) }} value={title} />
                        <Input name="仕事内容タイトル" onChange={(e) => { setSavable(true); setcontenttilte(e) }} value={contenttitle} />
                        <Input name="スラグ" onChange={(e) => { setSavable(true); setSlug(e) }} value={slug} />
                        <div className="grid_box ">
                            <div className="xs12 lg5 of-hidden" style={{ marginBottom: "10px", maxHeight: "400px" }}>
                                <h4 style={{ height: "40px", lineHeight: "50px" }}>アイキャッチ</h4>
                                <div style={{ height: "calc(100% - 40px) ", aspectRatio: 1, borderRadius: "5px", margin: "0px auto 20px", boxShadow: "0px 0px 10px #444", }}>
                                    <UploadPicturePreview
                                        icon={<AddPhotoAlternateIcon style={{ width: "100%", height: "100%" }} />}
                                        src={`${imagePreview ? process.env.FTP_URL + "img/career/" + imagePreview : "/img/defaultImg.jpg"}`}
                                        size={30}
                                        func={() => { setOpenModal(true), setSavable(true) }}
                                    />
                                </div>
                            </div>

                            <div className="xs12 lg7">
                                <div style={{ width: "100%", height: "400px" }}>
                                    <div className='dp-flex'><h4 style={{ height: "40px", lineHeight: "50px" }}>事業所</h4><input placeholder='施設で検索' style={{ height: "20px", margin: " auto 5px" }} onChange={(e) => setSearch(e.target.value)} /></div>
                                    <div className='dp-flex'>
                                        <select style={{ width: "100px", height: "30px", margin: "0 5px" }} onChange={(e) => setLocation(e.target.value)}>
                                            <option value="">都道府県</option>
                                            {japanPrefectures.map((p, index) => <option key={index}>{p.name}</option>)}
                                        </select>
                                        <select style={{ height: "30px", margin: "0 5px" }} onChange={(e) => setArea(e.target.value)}>
                                            <option value="">エリア</option>
                                            {japanRegions.map((r, index) => <option key={index}>{r.region}</option>)}
                                        </select>
                                    </div>
                                    {facility?.length ?
                                        <div className='scrollbar-none' style={{ height: "calc(100% - 80px)", overflow: "auto", background: "whitesmoke", padding: "0 5px", marginTop: "10px" }}>
                                            {
                                                facility.map((item: any, index: number) =>
                                                    <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                                        <input type='checkbox' checked={workplace === item._id} onChange={() => { workplace === item._id ? setWorkplace("") : setWorkplace(item._id); setSavable(true) }} ></input>
                                                        <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{item.name}</p>
                                                    </div>
                                                )}
                                        </div>
                                        :
                                        null
                                    }
                                </div>
                            </div>
                        </div>
                        <Input name="職種" onChange={(e) => { setSavable(true); setWorktype(e) }} value={worktype} />
                        <Input name="雇用形態" onChange={(e) => { setSavable(true); setWorkstatus(e) }} value={workstatus} />
                        <Input name="勤務時間" onChange={(e) => { setSavable(true); setWorkTime(e) }} value={worktime} />
                        <Input name="給与" onChange={(e) => { setSavable(true), setWorksalary(e) }} value={worksalary} />
                        <Input name="休⽇休暇" onChange={(e) => { setSavable(true), setWorkbenefit(e) }} value={workbenefit} />
                        <TextAreaTool_v2 onChange={(e) => { setNewDetail(e), setChange(c => c + 1) }} value={DOMPurify.sanitize(detail)} />

                        <div style={{ display: "flex", margin: "10px 0", maxWidth: "210px", justifyContent: "space-between" }}>
                            {saving ? <Button name='。。。' onClick={() => { }} /> :
                                <Button name='作成' onClick={() => createPost(body)} disable={title && slug && image && savable ? false : true} />}
                            <Button name="プレビュー" onClick={() => UpdatePostDemo(body)} />
                        </div>
                    </div>
                    <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onImages={(arrId) => { setOpenModal(false), setImage(arrId[0].id), setSavable(true) }} />
                </div>
            )

    }
    return (
        <div className='grid_box scrollNone'>
            <div className={`scrollbar-none`} style={{ width: "100%", maxWidth: "992px", padding: "0 10px", margin: "auto", height: "calc(100vh - 60px)", overflow: "auto" }}>

                <Button name="戻る" onClick={() => toPage.push("/admin/post")} />
                <Input name="タイトル" onChange={(e) => { setSavable(true); setTitle(e) }} value={title} />
                <Input name="仕事内容タイトル" onChange={(e) => { setSavable(true); setcontenttilte(e) }} value={contenttitle} />
                <Input name="スラグ" onChange={(e) => { setSavable(true); setSlug(e) }} value={slug} />
                <div className="grid_box ">
                    <div className="xs12 lg5 of-hidden" style={{ marginBottom: "10px", maxHeight: "400px" }}>
                        <h4 style={{ height: "40px", lineHeight: "50px" }}>アイキャッチ</h4>
                        <div style={{ height: "calc(100% - 40px) ", aspectRatio: 1, borderRadius: "5px", margin: "0px auto 20px", boxShadow: "0px 0px 10px #444", }}>
                            <UploadPicturePreview
                                icon={<AddPhotoAlternateIcon style={{ width: "100%", height: "100%" }} />}
                                src={`${imagePreview ? process.env.FTP_URL + "img/career/" + imagePreview : "/img/defaultImg.jpg"}`}
                                size={30}
                                func={() => { setOpenModal(true), setSavable(true) }}
                            />
                        </div>
                    </div>

                    <div className="xs12 lg7">
                        <div style={{ width: "100%", height: "400px" }}>
                            <div className='dp-flex'><h4 style={{ height: "40px", lineHeight: "50px" }}>事業所</h4><input placeholder='施設で検索' style={{ height: "20px", margin: " auto 5px" }} onChange={(e) => setSearch(e.target.value)} /></div>
                            <div className='dp-flex'>
                                <select style={{ width: "100px", height: "30px", margin: "0 5px" }} onChange={(e) => setLocation(e.target.value)}>
                                    <option value="">都道府県</option>
                                    {japanPrefectures.map((p, index) => <option key={index}>{p.name}</option>)}
                                </select>
                                <select style={{ height: "30px", margin: "0 5px" }} onChange={(e) => setArea(e.target.value)}>
                                    <option value="">エリア</option>
                                    {japanRegions.map((r, index) => <option key={index}>{r.region}</option>)}
                                </select>
                            </div>
                            {facility?.length ?
                                <div className='scrollbar-none' style={{ height: "calc(100% - 80px)", overflow: "auto", background: "whitesmoke", padding: "0 5px", marginTop: "10px" }}>
                                    {
                                        facility.map((item: any, index: number) =>
                                            <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                                <input type='checkbox' checked={workplace === item._id} onChange={() => { workplace === item._id ? setWorkplace("") : setWorkplace(item._id); setSavable(true) }} ></input>
                                                <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{item.name}</p>
                                            </div>
                                        )}
                                </div>
                                :
                                null
                            }
                        </div>
                    </div>
                </div>
                <Input name="職種" onChange={(e) => { setSavable(true); setWorktype(e) }} value={worktype} />
                <Input name="雇用形態" onChange={(e) => { setSavable(true); setWorkstatus(e) }} value={workstatus} />
                <Input name="勤務時間" onChange={(e) => { setSavable(true); setWorkTime(e) }} value={worktime} />
                <Input name="給与" onChange={(e) => { setSavable(true), setWorksalary(e) }} value={worksalary} />
                <Input name="休⽇休暇" onChange={(e) => { setSavable(true), setWorkbenefit(e) }} value={workbenefit} />
                <TextAreaTool_v2 onChange={(e) => { setNewDetail(e), setChange(c => c + 1) }} value={DOMPurify.sanitize(detail)} />
                <div style={{ display: "flex", margin: "10px 0", maxWidth: "210px", justifyContent: "space-between" }}>
                    {saving ? <Button name='。。。' onClick={() => { }} /> : <Button name='保存' disable={!savable} onClick={() => UpdatePost(body)} />}
                    <Button name="プレビュー" onClick={() => UpdatePostDemo(body)} />
                </div>
            </div>
            <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onImages={(arrId) => { setOpenModal(false), setImage(arrId[0].id); setSavable(true) }} />
        </div>
    )
}

export default Page