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
import { NoUserAuthen } from '@/api/NoUserAuthen';
import Accordion from '@/component/tool/accordion';
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
    const [slug, setSlug] = useState<string>("news_" + moment(new Date()).format("YYYY_MM_DD"))
    const [detail, setDetail] = useState<string>("もう少し仕事内容をシェアしてください。")
    const [newdetail, setNewDetail] = useState<string>("")
    const [categories, setCategories] = useState<{ name: string }[]>([])
    const [category, setCategory] = useState<any[]>([])

    const [change, setChange] = useState<number>(0)
    const [saving, setSaving] = useState<boolean>(false)
    const [savable, setSavable] = useState<boolean>(false)

    const toPage = useRouter()
    const body = {
        name,
        slug,
        content: newdetail,
        category

    }
    const getOnePost = async (p: string, a: string, s: string) => {
        const result = await UserAuthen.getOneItembySlug(p, a, s)

        if (result.success && result.data[0]?._id) {

            setId(result.data[0]._id)
            setName(result.data[0].name)
            setSlug(result.data[0].slug)
            setDetail(result.data[0].content)
            setCategory(result.data[0].category)
        }
    }
    const getCategory = async (a: string) => {
        const result = await NoUserAuthen.getItem(a, "", "", "", "", "", undefined, undefined)

        if (result.success) {
            setCategories(result.data)
        }
    }
    useEffect(() => {
        currentUser.position && params.slug !== "new" && getOnePost(currentUser.position, "news", params.slug)
        getCategory("category")
    }, [currentUser.position, params.slug])

    const createPost = async (slug: string, body: any) => {
        setSaving(true)
        const result = await UserAuthen.createItem(currentUser.position, "news", body)
        if (result.success) {
            setSaving(false)
            toPage.push("/admin/news")
        }
    }
    const UpdatePost = async (body: any) => {
        setSaving(true)

        const result = await UserAuthen.updateItem(currentUser.position, "news", id, body)
        if (result.success) {
            setSaving(true)
            toPage.push("/admin/news")
        }
    }

    const UpdatePostDemo = async (body: any) => {
        body.slug = body.slug + "_demo"
        const result = await UserAuthen.updateItem(currentUser.position, "news", "66b06560216acefccc080e48", body)
        if (result) {
            window.open('/home/news/' + body.slug, '_blank');
        }
    }

    switch (params.slug) {
        case "new":
            return (
                <div className='grid_box scrollNone mw1200px-grid-reverse'>
                    <div className={`detailBox xs12 md8  scrollbar-none`} style={{ padding: "0 10px", margin: "auto", height: "calc(100vh - 60px)", overflow: "auto" }}>
                        <Button name="戻る" onClick={() => toPage.back()} />
                        <Input name="タイトル" onChange={(e) => setName(e)} value={name} />
                        <Input name="スラグ" onChange={(e) => setSlug(e)} value={slug} />
                        {/* <Input name="カテゴリー" onChange={(e) => setCategory(e)} value={category} /> */}
                        <TextAreaTool_v2 onChange={(e) => { setNewDetail(e); setChange }} value={detail} />
                        <div style={{ display: "flex", margin: "10px 0" }}>
                            {saving ? <Button name='。。。' onClick={() => { }} /> :
                                <Button name='作成' onClick={() => createPost(params.slug, body)} disable={name && slug ? false : true} />}
                            <Button name="プレビュー" onClick={() => UpdatePostDemo(body)} />
                        </div>
                    </div>
                </div>
            )

    }

    return (
        <div className='grid_box scrollNone mw1200px-grid-reverse'>
            <div className={`detailBox xs12 md8  scrollbar-none`} style={{ padding: "0 10px", margin: "auto", height: "calc(100vh - 60px)", overflow: "auto" }}>
                <Button name="戻る" onClick={() => toPage.back()} />
                <Input name="タイトル" onChange={(e) => setName(e)} value={name} />
                <Input name="スラグ" onChange={(e) => setSlug(e)} value={slug} />
                {/* <Input name="カテゴリー" onChange={(e) => setCategory(e)} value={category} /> */}
                <div>
                    <h4>カテゴリー</h4>
                    <div style={{ height: "150px", overflow: "auto", background: "whitesmoke", padding: "0 5px" }}>
                        {/* <div style={{ display: "flex", flexWrap: "wrap", }}> */}
                        {categories.length ?
                            categories.map((item: any, index: number) =>
                                <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                    <input type='checkbox' checked={category?.includes(item._id)} onChange={() => { category?.includes(item._id) ? setCategory(ca => ca.filter(c => c != item._id)) : setCategory(c => [...c, item._id]) }} ></input>
                                    <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{item.name}</p>
                                </div>
                            ) :
                            <p>カテゴリーがない</p>}
                    </div>
                </div>
                <TextAreaTool_v2 onChange={(e) => { setNewDetail(e); setChange }} value={detail} />
                <div style={{ display: "flex", margin: "10px 0" }}>
                    <Button name='保存' onClick={() => UpdatePost(body)} />
                    <Button name="プレビュー" onClick={() => UpdatePostDemo(body)} />
                </div>
            </div>
        </div>
    )
}

export default Page