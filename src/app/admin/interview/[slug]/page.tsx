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
import DOMPurify from 'dompurify';
import ImageModal from '@/component/tool/imageModal_v2';
import TextAreaTool_v2 from '@/component/input/textareaTool_v2';
import moment from 'moment';
import { NoUserAuthen } from '@/api/NoUserAuthen';
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

    const [id, setId] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [slug, setSlug] = useState<string>("interview_" + moment(new Date()).format("YYYY_MM_DD"))
    const [workplaceId, setWorkplaceId] = useState<string>("")
    const [workplace, setWorkplace] = useState<any>()
    const [worktype, setWorktype] = useState<string>("")
    const [location, setLocation] = useState<string>("")
    const [contenttitle, setcontenttilte] = useState<string>("")
    const [detail, setDetail] = useState<string>("もう少し仕事内容をシェアしてください。")
    const [newdetail, setNewDetail] = useState<string>("")
    const [image, setImage] = useState<string>("")
    const [video, setVideo] = useState<string>("")
    const [imagePreview, setImagePreview] = useState<string>("")

    const [change, setChange] = useState<number>(0)
    const [saving, setSaving] = useState<boolean>(false)
    const [savable, setSavable] = useState<boolean>(false)

    const [facility, setFacility] = useState<any[]>([])

    const toPage = useRouter()

    const body = {
        name,
        slug,
        workplace: workplaceId,
        worktype,
        location,
        contenttitle,
        image,
        video,
        content: newdetail || detail
    }
    const [search, setSearch] = useState<string>("")
    const [area, setArea] = useState<string>("")
    const [locationFa, setLocationFa] = useState<string>("")

    const getFacility = async (search: string, location: string, area: string) => {
        const result = await UserAuthen.getItem(currentUser.position, "facility", search, undefined, undefined, location, area)
        console.log(result)
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
            setWorkplaceId(result.data[0].workplace?._id)
            setWorkplace(result.data[0].workplace)
            setWorktype(result.data[0].worktype)
            setLocation(result.data[0].location)
            setcontenttilte(result.data[0].contenttitle)
            setDetail(result.data[0].content)
            setImage(result.data[0].image)
            setVideo(result.data[0].video)
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
        getFacility(search, locationFa, area)
    }, [search, area, locationFa])

    switch (params.slug) {
        case "new":
            return (
                <div className='grid_box scrollNone m'>
                    <div className={`scrollbar-none`} style={{ width: "100%", maxWidth: "992px", padding: "0 10px", margin: "auto", }}>

                        <Button name="戻る" onClick={() => toPage.back()} />
                        <Input name="名前" onChange={(e) => { setSavable(true); setName(e) }} value={name} />
                        <Input name="仕事内容タイトル" onChange={(e) => { setSavable(true), setcontenttilte(e) }} value={contenttitle} />
                        <Input name="ID（このIDがURLの末尾になります。）" onChange={(e) => { setSavable(true); setSlug(e) }} value={slug} />
                        {/* <Input name="ID（このIDがURLの末尾になります。）" onChange={(e) => { setSavable(true); setSlug(e) }} value={slug} /> */}

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
                                        <select style={{ width: "100px", height: "30px", margin: "0 5px" }} onChange={(e) => setLocationFa(e.target.value)}>
                                            <option value="">都道府県</option>
                                            {japanPrefectures.map((p, index) => <option key={index}>{p.name}</option>)}
                                        </select>
                                        <select style={{ height: "30px", margin: "0 5px" }} onChange={(e) => setArea(e.target.value)}>
                                            <option value="">地方</option>
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
                        <Input name="職種" onChange={(e) => { setSavable(true), setWorktype(e) }} value={worktype} />
                        <Input name="youtube url" onChange={(e) => { setSavable(true); setVideo(e) }} value={video} />
                        <TextAreaTool_v2 onChange={(e) => { setNewDetail(e); setChange(c => c + 1) }} value={DOMPurify.sanitize(detail)} />
                        <div style={{ display: "flex", margin: "10px 0", maxWidth: "210px", justifyContent: "space-between" }}>
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
            <div className={`scrollbar-none`} style={{ width: "100%", maxWidth: "992px", padding: "0 10px", margin: "auto", }}>

                <Button name="戻る" onClick={() => toPage.back()} />
                <Input name="名前" onChange={(e) => { setSavable(true), setName(e) }} value={name} />
                <Input name="仕事内容タイトル" onChange={(e) => { setSavable(true); setcontenttilte(e) }} value={contenttitle} />
                <Input name="スラグ" onChange={(e) => { setSavable(true), setSlug(e) }} value={slug} />
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
                                <select style={{ width: "100px", height: "30px", margin: "0 5px" }} onChange={(e) => setLocationFa(e.target.value)}>
                                    <option value="">都道府県</option>
                                    {japanPrefectures.map((p, index) => <option key={index}>{p.name}</option>)}
                                </select>
                                <select style={{ height: "30px", margin: "0 5px" }} onChange={(e) => setArea(e.target.value)}>
                                    <option value="">地方</option>
                                    {japanRegions.map((r, index) => <option key={index}>{r.region}</option>)}
                                </select>
                            </div>
                            {facility?.length ?
                                <div className='scrollbar-none' style={{ height: "calc(100% - 80px)", overflow: "auto", background: "whitesmoke", padding: "0 5px", marginTop: "10px" }}>
                                    {
                                        facility.map((item: any, index: number) =>
                                            <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                                <input type='checkbox' checked={workplaceId === item._id} onChange={() => { workplaceId === item._id ? setWorkplaceId("") : setWorkplaceId(item._id); setSavable(true) }} ></input>
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
                <Input name="職種" onChange={(e) => { setSavable(true), setWorktype(e) }} value={worktype} />
                <Input name="youtube url" onChange={(e) => { setSavable(true); setVideo(e) }} value={video} />
                <TextAreaTool_v2 onChange={(e) => { setNewDetail(e); setChange(c => c + 1) }} value={DOMPurify.sanitize(detail)} />
                <div style={{ display: "flex", margin: "10px 0", maxWidth: "210px", justifyContent: "space-between" }}>
                    {saving ? <Button name='。。。' onClick={() => { }} /> : <Button name='保存' onClick={() => UpdatePost(body)} disable={!savable} />}
                    <Button name="プレビュー" onClick={() => UpdatePostDemo(body)} />
                </div>
            </div>
            <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onImages={(ArrId) => { setOpenModal(false), setImage(ArrId[0].id), setSavable(true) }} />
        </div>
    )
}

export default Page