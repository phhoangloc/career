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
    const [title, setTitle] = useState<string>("")
    const [slug, setSlug] = useState<string>("")
    const [workplace, setWorkplace] = useState<string>("")
    const [worktype, setWorktype] = useState<string>("")
    const [location, setLocation] = useState<string>("")
    const [contenttitle, setcontenttilte] = useState<string>("")
    const [detail, setDetail] = useState<string>("もう少し仕事内容をシェアしてください。")
    const [newdetail, setNewDetail] = useState<string>("")

    const toPage = useRouter()
    const body = {
        title,
        slug,
        workplace,
        worktype,
        location,
        contenttitle,
        content: newdetail || detail
    }
    const getOnePost = async (p: string, a: string, s: string) => {
        const result = await UserAuthen.getOneItembySlug(p, a, s)

        if (result.success) {
            setId(result.data[0]._id)
            setTitle(result.data[0].title)
            setSlug(result.data[0].slug)
            setWorkplace(result.data[0].workplace)
            setWorktype(result.data[0].worktype)
            setLocation(result.data[0].location)
            setcontenttilte(result.data[0].contenttitle)
            setDetail(result.data[0].content)
        }
    }
    useEffect(() => {
        currentUser.position && params.slug !== "new" && getOnePost(currentUser.position, "post", params.slug)
    }, [currentUser.position, params.slug])

    const createPost = async (slug: string, body: any) => {
        const result = await UserAuthen.createItem(currentUser.position, "post", body)
        if (result.success) {
            toPage.push("./" + body.slug)
        }
    }
    const UpdatePost = async (body: any) => {
        const result = await UserAuthen.updateItem(currentUser.position, "post", id, body)
        if (result.success) {
            toPage.push("./" + body.slug)
        }
    }
    switch (params.slug) {
        case "new":
            return (
                <div className='grid_box scrollNone'>
                    <div className={`center xs12 md6 lg4 stickyBox`} style={{ height: "50vh", margin: "10px", borderRadius: "5px", top: "25%", textAlign: "center", overflow: "hidden", boxShadow: "0px 0px 10px #444" }}>
                        <UploadPicturePreview
                            icon={<AddPhotoAlternateIcon style={{ width: "100%", height: "100%" }} />}
                            src={"/img/defaultImg.jpg"}
                            size={30}
                        // func={() => setPictureModal(true)} 
                        />
                    </div>
                    <div className={`detailBox xs12 md6 lg8 `} style={{ overflowX: "hidden", margin: "0 10px", }}>
                        <Input name="タイトル" onChange={(e) => setTitle(e)} value={title} />
                        <Input name="スラグ" onChange={(e) => setSlug(e)} value={slug} />
                        <Input name="事業所" onChange={(e) => setWorkplace(e)} value={workplace} />
                        <Input name="職種" onChange={(e) => setWorktype(e)} value={worktype} />
                        <Input name="エリア" onChange={(e) => setLocation(e)} value={location} />
                        <Input name="仕事内容タイトル" onChange={(e) => setcontenttilte(e)} value={contenttitle} />
                        <TextAreaTool name='仕事内容' onChange={(e) => setNewDetail(e)} value={detail || newdetail} />
                        <Button name='create' onClick={() => createPost(params.slug, body)} />
                    </div>
                    {/* <PictureModal open={pictureModal} close={() => setPictureModal(false)} select={(e) => { setCover(e), setPictureModal(false) }} /> */}
                </div>
            )

    }
    return (
        <div className='grid_box scrollNone'>
            <div className={`center xs12 md6 lg4 stickyBox`} style={{ height: "50vh", margin: "10px", borderRadius: "5px", top: "25%", textAlign: "center", overflow: "hidden", boxShadow: "0px 0px 10px #444" }}>
                <UploadPicturePreview
                    icon={<AddPhotoAlternateIcon style={{ width: "100%", height: "100%" }} />}
                    src={"/img/defaultImg.jpg"}
                    size={30}
                // func={() => setPictureModal(true)} 
                />
            </div>
            <div className={`detailBox xs12 md6 lg8 `} style={{ overflowX: "hidden", margin: "0 10px", }}>
                <Input name="title" onChange={(e) => setTitle(e)} value={title} />
                <Input name="slug" onChange={(e) => setSlug(e)} value={slug} />
                <Input name="事業所" onChange={(e) => setWorkplace(e)} value={workplace} />
                <Input name="職種" onChange={(e) => setWorktype(e)} value={worktype} />
                <Input name="エリア" onChange={(e) => setLocation(e)} value={location} />
                <Input name="仕事内容タイトル" onChange={(e) => setcontenttilte(e)} value={contenttitle} />
                <TextAreaTool name='detail' onChange={(e) => setNewDetail(e)} value={detail || newdetail} />
                <Button name='save' onClick={() => UpdatePost(body)} />

            </div>
            {/* <PictureModal open={pictureModal} close={() => setPictureModal(false)} select={(e) => { setCover(e), setPictureModal(false) }} /> */}
        </div>
    )
}

export default Page