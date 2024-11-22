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
import Script from 'next/script';
import { NoUserAuthen } from '@/api/NoUserAuthen';
import { japanRegions } from '@/lib/area';
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
    const [worktype, setWorkType] = useState<string>("")
    const [slug, setSlug] = useState<string>("ficility_" + moment(new Date()).format("YYYY_MM_DD_hh_mm_ss"))
    const [address, setAddress] = useState<string>("")
    const [postno, setPostno] = useState<string>("")
    const [postnoWarn, setPostnoWarn] = useState<string>("")

    const [postnoView, setPostNoView] = useState<string>("")
    const [location, setLocation] = useState<string>("")
    const [area, setArea] = useState<string>("")
    const [phone, setPhone] = useState<string>("")
    const [phoneWarn, setPhoneWarn] = useState<string>("")
    const [phoneView, setPhoneView] = useState<string>("")
    const [fax, setFax] = useState<string>("")
    const [faxWarn, setFaxWarn] = useState<string>("")
    const [faxView, setFaxView] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [emailWarn, setEmailWarn] = useState<string>("")

    const [homepage, setHomepage] = useState<string>("")
    const [map, setMap] = useState<string>("")
    const [contenttitle, setcontenttilte] = useState<string>("")
    const [detail, setDetail] = useState<string>("もう少し事業内容をシェアしてください。")
    const [newdetail, setNewDetail] = useState<string>("")
    const [image, setImage] = useState<string>("")
    const [imagePreview, setImagePreview] = useState<string>("")

    const [video, setVideo] = useState<string>("")

    const [change, setChange] = useState<number>(0)
    const [saving, setSaving] = useState<boolean>(false)
    const [savable, setSavable] = useState<boolean>(false)

    const toPage = useRouter()
    const body = {
        name,
        worktype,
        slug,
        address,
        postno,
        location,
        area,
        phone,
        fax,
        homepage,
        map,
        contenttitle,
        email,
        image: image || null,
        content: newdetail || detail,
        video,
    }
    const getOnePost = async (p: string, a: string, s: string) => {
        const result = await UserAuthen.getOneItembySlug(p, a, s)

        if (result.success && result.data[0]._id) {
            setId(result.data[0]._id)
            setName(result.data[0].name)
            setWorkType(result.data[0].worktype)
            setSlug(result.data[0].slug)
            setAddress(result.data[0].address)
            setPostno(result.data[0].postno)
            setLocation(result.data[0].location)
            setPhone(result.data[0].phone)
            setFax(result.data[0].fax)
            setEmail(result.data[0].email)
            setHomepage(result.data[0].homepage)
            setcontenttilte(result.data[0].contenttitle)
            setDetail(result.data[0].content)
            setImage(result.data[0].image)
            setMap(result.data[0].map)
            setVideo(result.data[0].video)
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
        body.slug = "ficility_2024_08_27_05_03_54_demo"
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

    function formatPostNo(input: string) {
        if (input) {
            const digits = input.replace(/\D/g, '');

            if (digits.length === 7) {
                setPostnoWarn("")
                return digits.replace(/(\d{3})(\d{4})/, '$1-$2');
            } else {
                setPostnoWarn("入力した郵便番号は適切ではありません")
                return input;
            }
        } else {
            setPhoneWarn("")
            return ""
        }
    }
    function formatPhoneNumber(input: string) {
        if (input) {
            const digits = input.replace(/\D/g, '');

            if (digits.length === 10) {
                setPhoneWarn("")
                return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            } else if (digits.length === 11) {
                setPhoneWarn("")
                return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else {
                setPhoneWarn("電話番号は適切ではありません")
                return input;
            }
        } else {
            setPhoneWarn("")
            return ""
        }
    }

    function formatFaxNumber(input: string) {
        if (input) {
            const digits = input.replace(/\D/g, '');

            if (digits.length === 10) {
                setFaxWarn("")
                return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            } else if (digits.length === 11) {
                setFaxWarn("")
                return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else {
                setFaxWarn("ファクスは適切ではありません")
                return input;
            }
        } else {
            setFaxWarn("")
            return ""
        }
    }
    function formatArea(input: string) {
        if (input) {
            // console.log(japanRegions.filter(r =>r.region === japanRegions.map(r.prefectures.filter(p => p.name === input))))
            japanRegions.map(r => {
                if (r.prefectures.filter(p => p.name === input).length) {
                    setArea(r.region);  // Trả về tên khu vực nếu tìm thấy tỉnh
                }
            })
        } else {
            return ""
        }
    }
    function ValidateEmail(input: string) {
        if (!/\S+@\S+\.\S+/.test(input) && input?.length) {
            setEmailWarn('電子メールが無効です');
        } else {
            setEmailWarn("")
        }
    }
    useEffect(() => {
    }, [fax])
    useEffect(() => {
        setPhoneView(formatPhoneNumber(phone))
    }, [phone])

    useEffect(() => {
        setFaxView(formatFaxNumber(fax))
    }, [fax])

    useEffect(() => {
        formatArea(location)
    }, [location])
    useEffect(() => {
        ValidateEmail(email)
    }, [email])

    const getAddressFacility = async (pNo: string) => {
        const result = await NoUserAuthen.getAddress(pNo)
        if (result.results?.length) {
            setAddress(result.results[0].address1 + result.results[0].address2 + result.results[0].address3)
            setLocation(result.results[0].address1)
        }
    }

    useEffect(() => {
        postno.length === 7 && getAddressFacility(postno)
        setPostNoView(formatPostNo(postno))
    }, [postno])

    switch (params.slug) {
        case "new":
            return (
                <div className='grid_box scrollNone'>
                    <div className={`detailBox xs12 scrollbar-none`} style={{ padding: "0 10px" }}>
                        <Button name="戻る" onClick={() => toPage.back()} />
                        <Input name="名前" onChange={(e) => { setSavable(true); setName(e) }} value={name} />
                        <Input name="冒頭" onChange={(e) => { setSavable(true); setcontenttilte(e) }} value={contenttitle} />
                        <Input name="種別" onChange={(e) => { setSavable(true); setWorkType(e) }} value={worktype} />
                        <Input name="スラッグ" onChange={(e) => { setSavable(true); setSlug(e) }} value={slug} />
                        <div style={{ height: "400px", aspectRatio: 1, borderRadius: "5px", margin: "0px 0px 20px", boxShadow: "0px 0px 10px #444" }}>
                            <UploadPicturePreview
                                icon={<AddPhotoAlternateIcon style={{ width: "100%", height: "100%" }} />}
                                src={`${imagePreview ? process.env.FTP_URL + "img/career/" + imagePreview : "/img/defaultImg.jpg"}`}
                                size={30}
                                func={() => { setSavable(true); setOpenModal(true) }}
                            />
                        </div>
                        <Input name="〒" onChange={(e) => { setSavable(true); setPostno(e) }} value={postnoView} sx="p-postal-code" />
                        <Input name="地方 " onChange={(e) => { setSavable(true); setArea(e) }} value={area} />
                        <Input name="都道府県" onChange={(e) => { setSavable(true); setLocation(e) }} value={location} />
                        <Input name="住所" onChange={(e) => { setSavable(true); setAddress(e) }} value={address} sx="p-region p-locality p-street-address p-extended-address" />
                        <Input name="電話番号" onChange={(e) => { setSavable(true); setPhone(e) }} value={phoneView} warn={phoneWarn} />
                        <Input name="FAX" onChange={(e) => { setSavable(true); setFax(e) }} value={faxView} warn={faxWarn} />
                        <Input name="eメール" onChange={(e) => { setSavable(true); setEmail(e) }} value={email} warn={emailWarn} />
                        <Input name="ホームページ" onChange={(e) => { setSavable(true); setHomepage(e) }} value={homepage} />
                        <Input name="埋め込みマップ" onChange={(e) => { setSavable(true); setMap(e) }} value={map} />
                        <Input name="youtube url" onChange={(e) => { setSavable(true); setVideo(e) }} value={video} />
                        <TextAreaTool_v2 onChange={(e) => { setNewDetail(e); setChange(c => c + 1) }} value={DOMPurify.sanitize(detail)} />
                        <div style={{ display: "flex", margin: "10px 0", maxWidth: "210px", justifyContent: "space-between" }}>
                            {saving ? <Button name='。。。' onClick={() => { }} /> :
                                <Button name='作成' disable={!savable} onClick={() => createPost(body)} />}
                            <Button name="プレビュー" onClick={() => UpdatePostDemo(body)} />
                        </div>
                    </div>
                    <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onImages={(ArrId) => { setOpenModal(false), setImage(ArrId[0].id), setSavable(true) }} />

                </div>
            )

    }
    return (
        <div className='grid_box scrollNone'>
            <div className={`detailBox xs12 scrollbar-none`} style={{ padding: "0 10px" }}>
                <Button name="戻る" onClick={() => toPage.back()} />
                <Input name="名前" onChange={(e) => { setSavable(true); setName(e) }} value={name} />
                <Input name="冒頭" onChange={(e) => { setSavable(true); setcontenttilte(e) }} value={contenttitle} />
                <Input name="種別" onChange={(e) => { setSavable(true); setWorkType(e) }} value={worktype} />
                <Input name="スラッグ" onChange={(e) => { setSavable(true); setSlug(e) }} value={slug} />
                <div style={{ height: "400px", aspectRatio: 1, borderRadius: "5px", margin: "0px 0px 20px", boxShadow: "0px 0px 10px #444" }}>
                    <UploadPicturePreview
                        icon={<AddPhotoAlternateIcon style={{ width: "100%", height: "100%" }} />}
                        src={`${imagePreview ? process.env.FTP_URL + "img/career/" + imagePreview : "/img/defaultImg.jpg"}`}
                        size={30}
                        func={() => { setSavable(true); setOpenModal(true) }}
                    />
                </div>
                <Input name="〒" onChange={(e) => { setSavable(true); setPostno(e) }} value={postnoView} warn={postnoWarn} sx="p-postal-code" />
                <Input name="地方 " onChange={(e) => { setSavable(true); setArea(e) }} value={area} />
                <Input name="都道府県" onChange={(e) => { setSavable(true); setLocation(e) }} value={location} />
                <Input name="住所" onChange={(e) => { setSavable(true); setAddress(e) }} value={address} sx="p-region p-locality p-street-address p-extended-address" />
                <Input name="電話番号" onChange={(e) => { setSavable(true); setPhone(e) }} value={phoneView} warn={phoneWarn} />
                <Input name="FAX" onChange={(e) => { setSavable(true); setFax(e) }} value={faxView} warn={faxWarn} />
                <Input name="eメール" onChange={(e) => { setSavable(true); setEmail(e) }} value={email} warn={emailWarn} />
                <Input name="ホームページ" onChange={(e) => { setSavable(true); setHomepage(e) }} value={homepage} />
                <Input name="埋め込みマップ" onChange={(e) => { setSavable(true); setMap(e) }} value={map} />
                <Input name="youtube url" onChange={(e) => { setSavable(true); setVideo(e) }} value={video} />
                <TextAreaTool_v2 onChange={(e) => { setNewDetail(e); setChange(c => c + 1) }} value={DOMPurify.sanitize(detail)} />
                <div style={{ display: "flex", margin: "10px 0", maxWidth: "210px", justifyContent: "space-between" }}>
                    {saving ? <Button name='。。。' onClick={() => { }} /> :
                        <Button name='保存' disable={!savable} onClick={() => UpdatePost(body)} />}
                    <Button name="プレビュー" onClick={() => UpdatePostDemo(body)} />
                </div>
            </div>
            <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onImages={(ArrId) => { setOpenModal(false), setImage(ArrId[0].id), setSavable(true) }} />

        </div>
    )
}

export default Page