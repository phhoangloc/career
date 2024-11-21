'use client'
import React, { useState, useEffect } from 'react'
import UploadPicturePreview from '@/component/input/uploadPicturePreview'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Input from '@/component/input/input';
import Button from '@/component/input/button';
import { useRouter } from 'next/navigation';
import { UserAuthen } from '@/api/UserAuthen';
import store from '@/redux/store';
import ImageModal from '@/component/tool/imageModal_v2';
import TextAreaTool_v2 from '@/component/input/textareaTool_v2';
import moment from 'moment';
import { NoUserAuthen } from '@/api/NoUserAuthen';
import DOMPurify from 'dompurify';
import { japanPrefectures, japanRegions } from '@/lib/area';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { workstatusList, statusList } from '@/data/workstatus';
import { jpyFormatter } from '@/lib/currency';
jpyFormatter
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
    const [isInput, setIsInput] = useState<boolean>(false)

    const [id, setId] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const [slug, setSlug] = useState<string>("post_" + moment(new Date()).format("YYYY_MM_DD"))
    const [workplace, setWorkplace] = useState<string>("")
    const [_contract, set_contract] = useState<string>("")
    const [_contractName, set_contractName] = useState<string>("")
    const [worktype, setWorktype] = useState<string[]>([])
    const [newWorktype, setNewWorktype] = useState<string>("")
    const [worktypeList, setWorktypeList] = useState<string[]>([])
    const [workstatus, setWorkstatus] = useState<string[]>([])
    const [lisense, setLisense] = useState<string[]>([])
    const [worktime, setWorkTime] = useState<string>("")
    const [worksalary, setWorksalary] = useState<string>("")
    const [_bonus, set_bonus] = useState<string>("")
    const [workbenefit, setWorkbenefit] = useState<string>("")
    const [contenttitle, setcontenttilte] = useState<string>("")
    const [detail, setDetail] = useState<string>("もう少し仕事内容をシェアしてください。")
    const [newdetail, setNewDetail] = useState<string>("")
    const [image, setImage] = useState<string>("")
    const [imagePreview, setImagePreview] = useState<string>("")
    const [change, setChange] = useState<number>(0)
    const [facility, setFacility] = useState<any[]>([])

    const [_startDay, set_startDay] = useState<Date>(new Date())
    const [_endDay, set_endDay] = useState<Date>(new Date())
    const [_i, set_i] = useState<number>(0)

    const toPage = useRouter()

    const body = {
        title,
        slug,
        workplace,
        worktype: worktype.join(","),
        workstatus: workstatus.join(","),
        contenttitle,
        image,
        content: newdetail || detail,
        worktime,
        worksalary,
        workbenefit,
        startDate: new Date(_startDay),
        endDate: new Date(_endDay),
        bonus: _bonus === "あり" ? 1 : 0,
        contact: _contract,
        contactName: _contractName,
        lisense: lisense.join(","),

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
            setWorktype(result.data[0].worktype.split(','))
            setWorkstatus(result.data[0].workstatus.split(','))
            setcontenttilte(result.data[0].contenttitle)
            setDetail(result.data[0].content)
            setImage(result.data[0].image)
            setWorkTime(result.data[0].worktime)
            setWorksalary(result.data[0].worksalary)
            setWorkbenefit(result.data[0].workbenefit)
            set_bonus(result.data[0].bonus === 1 ? "あり" : "なし")
            set_contract(result.data[0].contact)
            set_contractName(result.data[0].contactName)
            set_startDay(result.data[0].startDate)
            set_endDay(result.data[0].endDate)
            setLisense(result.data[0].lisense.split(','))
        }
    }

    const getWorkType = async () => {
        const result = await NoUserAuthen.getItem("worktype", "", "", "", "", "", undefined, undefined)

        if (result.success) {
            setWorktypeList(result.data)
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

    useEffect(() => {
        getWorkType()
    }, [_i])

    const addWorktype = async (body: any) => {
        const result = await UserAuthen.createItem(currentUser.position, "worktype", body)
        if (result.success) {
            set_i(_i + 1)
        }
    }

    switch (params.slug) {
        case "new":
            return (
                <div className='grid_box scrollNone'>
                    <div className={`scrollbar-none`} style={{ width: "100%", maxWidth: "992px", padding: "0 10px", margin: "auto" }}>

                        <Button name="戻る" onClick={() => toPage.push("/admin/post")} />
                        <Input name="タイトル" onChange={(e) => { setSavable(true); setTitle(e) }} value={title} />
                        <Input name="仕事内容タイトル" onChange={(e) => { setSavable(true); setcontenttilte(e) }} value={contenttitle} />
                        <Input name="スラグ" onChange={(e) => { setSavable(true); setSlug(e) }} value={slug} />
                        <Input name="連絡先" onChange={(e) => { setSavable(true); set_contract(e) }} value={_contract} />
                        <Input name="担当者の名前" onChange={(e) => { setSavable(true); set_contractName(e) }} value={_contractName} />
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
                                        <select style={{ height: "30px", margin: "0 5px" }} onChange={(e) => setArea(e.target.value)}>
                                            <option value="">エリア</option>
                                            {japanRegions.map((r, index) => <option key={index}>{r.region}</option>)}
                                        </select>
                                        <select style={{ width: "100px", height: "30px", margin: "0 5px" }} onChange={(e) => setLocation(e.target.value)}>
                                            <option value="">都道府県</option>
                                            {japanPrefectures.map((p, index) => <option key={index}>{p.name}</option>)}
                                        </select>

                                    </div>
                                    {facility?.length ?
                                        <div className='scrollbar-none' style={{ height: "calc(100% - 80px)", overflow: "auto", background: "whitesmoke", padding: "0 5px", marginTop: "10px" }}>
                                            {
                                                facility.map((item: any, index: number) =>
                                                    <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                                        <input type='radio' checked={workplace === item._id} onChange={() => { workplace === item._id ? setWorkplace("") : setWorkplace(item._id); setSavable(true) }} ></input>
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
                        <div>
                            <div className='dp-flex' >
                                <h3 style={{ height: "40px", lineHeight: "50px" }}>職種</h3>
                                <AddIcon style={{ width: "40px", height: "40px", padding: "12px", boxSizing: "border-box" }} onClick={() => setIsInput(!isInput)} />
                                <div style={{ display: isInput ? "flex" : "none", height: "40px" }}>
                                    <input
                                        style={{ height: "30px" }}
                                        onChange={(e) => { setNewWorktype(e.target.value); }}
                                        value={newWorktype}
                                        onFocus={(e) => {
                                            e.target.style.outline = 'none'
                                        }}>
                                    </input>
                                    <CloseIcon className={`svg30px br-5px bg-main`} style={{ margin: "auto 5px" }} onClick={() => { setIsInput(false) }} />
                                    <CheckIcon className={`svg30px br-5px bg-main`} style={{ margin: "auto 5px" }} onClick={() => { setIsInput(false), addWorktype({ name: newWorktype }) }} />
                                </div>
                            </div>
                            <div style={{ height: "150px", overflow: "auto", background: "whitesmoke", padding: "0 5px" }}>
                                {worktypeList.length ?
                                    worktypeList.map((item: any, index: number) =>
                                        <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                            <input type='checkbox' checked={worktype?.includes(item.name)} onChange={() => setWorktype(wt => wt.includes(item.name) ? wt.filter(w => w !== item.name) : [...wt, item.name])} ></input>
                                            <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{item.name}</p>
                                        </div>
                                    ) :
                                    <p style={{ opacity: "0.5" }}>職種がない</p>}
                            </div>
                        </div>
                        <div>
                            <div className='dp-flex' >
                                <h3 style={{ height: "40px", lineHeight: "50px" }}>雇用形態</h3>
                            </div>
                            <div style={{ height: "150px", overflow: "auto", background: "whitesmoke", padding: "0 5px" }}>
                                {workstatusList.length ?
                                    workstatusList.map((item: any, index: number) =>
                                        <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                            <input type='checkbox' checked={workstatus?.includes(item.name)} onChange={() => setWorkstatus(ws => ws.includes(item.name) ? ws.filter(w => w !== item.name) : [...ws, item.name])} ></input>
                                            <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{item.name}</p>
                                        </div>
                                    ) :
                                    null}
                            </div>
                        </div>
                        <div>
                            <div className='dp-flex' >
                                <h3 style={{ height: "40px", lineHeight: "50px" }}>資格の有無</h3>
                            </div>
                            <div style={{ height: "150px", overflow: "auto", background: "whitesmoke", padding: "0 5px" }}>
                                {statusList.length ?
                                    statusList.map((item: any, index: number) =>
                                        <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                            <input type='checkbox' checked={lisense?.includes(item.name)} onChange={() => setLisense(ls => ls.includes(item.name) ? ls.filter(l => l !== item.name) : [...ls, item.name])} ></input>
                                            <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{item.name}</p>
                                        </div>
                                    ) :
                                    null
                                }
                            </div>
                        </div>
                        <Input name="勤務時間" onChange={(e) => { setSavable(true); setWorkTime(e) }} value={worktime} placeholder='10:00 - 19:00' />
                        <Input name="給与" onChange={(e) => { setSavable(true), setWorksalary(e) }} value={worksalary} placeholder='500.000円' />
                        <div>
                            <div className='dp-flex' >
                                <h3 style={{ height: "40px", lineHeight: "50px" }}>賞与</h3>
                            </div>
                            <div className='display-flex' style={{ gap: "4px" }}>
                                <div className='dp-flex' style={{ height: "30px" }}>
                                    <input type='radio' checked={_bonus === "あり"} onChange={() => set_bonus("あり")} ></input>
                                    <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{"あり"}</p>
                                </div>
                                <div className='dp-flex' style={{ height: "30px" }}>
                                    <input type='radio' checked={_bonus !== "あり"} onChange={() => set_bonus("なし")} ></input>
                                    <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{"なし"}</p>
                                </div>
                            </div>
                        </div>
                        <Input name="福利厚生" onChange={(e) => { setSavable(true), setWorkbenefit(e) }} value={workbenefit} placeholder="資格手当など" />
                        <Input name="掲載日" onChange={(e) => { setSavable(true), set_startDay(e) }} value={moment(_startDay).format("YYYY-MM-DD")} type='date' />
                        <Input name="掲載終了日" onChange={(e) => { setSavable(true), set_endDay(e) }} value={moment(_endDay).format("YYYY-MM-DD")} type='date' />
                        <TextAreaTool_v2 onChange={(e) => { setNewDetail(e), setChange(c => c + 1) }} value={DOMPurify.sanitize(detail)} />

                        <div style={{ display: "flex", margin: "10px 0", maxWidth: "210px", justifyContent: "space-between" }}>
                            {saving ? <Button name='。。。' onClick={() => { }} /> :
                                <Button name='作成' onClick={() => createPost(body)} disable={title && slug && image && savable && workplace && worktype && workstatus && lisense ? false : true} />}
                            <Button name="プレビュー" disable={!savable} onClick={() => UpdatePostDemo(body)} />
                        </div>
                    </div>
                    <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onImages={(arrId) => { setOpenModal(false), setImage(arrId[0].id), setSavable(true) }} />
                </div>
            )

    }

    return (
        <div className='grid_box scrollNone'>
            <div className={`scrollbar-none`} style={{ width: "100%", maxWidth: "992px", padding: "0 10px", margin: "auto" }}>

                <Button name="戻る" onClick={() => toPage.push("/admin/post")} />
                <Input name="タイトル" onChange={(e) => { setSavable(true); setTitle(e) }} value={title} />
                <Input name="仕事内容タイトル" onChange={(e) => { setSavable(true); setcontenttilte(e) }} value={contenttitle} />
                <Input name="スラグ" onChange={(e) => { setSavable(true); setSlug(e) }} value={slug} />
                <Input name="連絡先" onChange={(e) => { setSavable(true); set_contract(e) }} value={_contract} />
                <Input name="担当者の名前" onChange={(e) => { setSavable(true); set_contractName(e) }} value={_contractName} />
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
                                <select style={{ height: "30px", margin: "0 5px" }} onChange={(e) => setArea(e.target.value)}>
                                    <option value="">エリア</option>
                                    {japanRegions.map((r, index) => <option key={index}>{r.region}</option>)}
                                </select>
                                <select style={{ width: "100px", height: "30px", margin: "0 5px" }} onChange={(e) => setLocation(e.target.value)}>
                                    <option value="">都道府県</option>
                                    {japanPrefectures.map((p, index) => <option key={index}>{p.name}</option>)}
                                </select>

                            </div>
                            {facility?.length ?
                                <div className='scrollbar-none' style={{ height: "calc(100% - 80px)", overflow: "auto", background: "whitesmoke", padding: "0 5px", marginTop: "10px" }}>
                                    {
                                        facility.map((item: any, index: number) =>
                                            <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                                <input type='radio' checked={workplace === item._id} onChange={() => { workplace === item._id ? setWorkplace("") : setWorkplace(item._id); setSavable(true) }} ></input>
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
                <div>
                    <div className='dp-flex' >
                        <h3 style={{ height: "40px", lineHeight: "50px" }}>職種</h3>
                        <AddIcon style={{ width: "40px", height: "40px", padding: "12px", boxSizing: "border-box" }} onClick={() => setIsInput(!isInput)} />
                        <div style={{ display: isInput ? "flex" : "none", height: "40px" }}>
                            <input
                                style={{ height: "30px" }}
                                onChange={(e) => { setNewWorktype(e.target.value); }}
                                value={newWorktype}
                                onFocus={(e) => {
                                    e.target.style.outline = 'none'
                                }}>
                            </input>
                            <CloseIcon className={`svg30px br-5px bg-main`} style={{ margin: "auto 5px" }} onClick={() => { setIsInput(false) }} />
                            <CheckIcon className={`svg30px br-5px bg-main`} style={{ margin: "auto 5px" }} onClick={() => { setIsInput(false), addWorktype({ name: newWorktype }) }} />
                        </div>
                    </div>
                    <div style={{ height: "150px", overflow: "auto", background: "whitesmoke", padding: "0 5px" }}>
                        {worktypeList.length ?
                            worktypeList.map((item: any, index: number) =>
                                <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                    <input type='checkbox' checked={worktype?.includes(item.name)} onChange={() => setWorktype(wt => wt.includes(item.name) ? wt.filter(w => w !== item.name) : [...wt, item.name])} ></input>
                                    <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{item.name}</p>
                                </div>
                            ) :
                            <p style={{ opacity: "0.5" }}>職種がない</p>}
                    </div>
                </div>
                <div>
                    <div className='dp-flex' >
                        <h3 style={{ height: "40px", lineHeight: "50px" }}>雇用形態</h3>
                    </div>
                    <div style={{ height: "150px", overflow: "auto", background: "whitesmoke", padding: "0 5px" }}>
                        {workstatusList.length ?
                            workstatusList.map((item: any, index: number) =>
                                <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                    <input type='checkbox' checked={workstatus?.includes(item.name)} onChange={() => setWorkstatus(ws => ws.includes(item.name) ? ws.filter(w => w !== item.name) : [...ws, item.name])} ></input>
                                    <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{item.name}</p>
                                </div>
                            ) :
                            null}
                    </div>
                </div>
                <div>
                    <div className='dp-flex' >
                        <h3 style={{ height: "40px", lineHeight: "50px" }}>資格の有無</h3>
                    </div>
                    <div style={{ height: "150px", overflow: "auto", background: "whitesmoke", padding: "0 5px" }}>
                        {statusList.length ?
                            statusList.map((item: any, index: number) =>
                                <div className='dp-flex' key={index} style={{ height: "30px" }}>
                                    <input type='checkbox' checked={lisense?.includes(item.name)} onChange={() => setLisense(ls => ls.includes(item.name) ? ls.filter(l => l !== item.name) : [...ls, item.name])} ></input>
                                    <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{item.name}</p>
                                </div>
                            ) :
                            null
                        }
                    </div>
                </div>
                <Input name="勤務時間" onChange={(e) => { setSavable(true); setWorkTime(e) }} value={worktime} placeholder='10:00 - 19:00' />
                <Input name="給与" onChange={(e) => { setSavable(true), setWorksalary(e) }} value={worksalary} />
                <div>
                    <div className='dp-flex' >
                        <h3 style={{ height: "40px", lineHeight: "50px" }}>賞与</h3>
                    </div>
                    <div className='display-flex' style={{ gap: "4px" }}>
                        <div className='dp-flex' style={{ height: "30px" }}>
                            <input type='radio' checked={_bonus === "あり"} onChange={() => set_bonus("あり")} ></input>
                            <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{"あり"}</p>
                        </div>
                        <div className='dp-flex' style={{ height: "30px" }}>
                            <input type='radio' checked={_bonus !== "あり"} onChange={() => set_bonus("なし")} ></input>
                            <p className='mg-0px-5px' style={{ lineHeight: "40px" }}>{"なし"}</p>
                        </div>
                    </div>
                </div>
                <Input name="福利厚生" onChange={(e) => { setSavable(true), setWorkbenefit(e) }} value={workbenefit} placeholder="資格手当など" />
                <Input name="掲載日" onChange={(e) => { setSavable(true), set_startDay(e) }} value={moment(_startDay).format("YYYY-MM-DD")} type='date' />
                <Input name="掲載終了日" onChange={(e) => { setSavable(true), set_endDay(e) }} value={moment(_endDay).format("YYYY-MM-DD")} type='date' />
                <TextAreaTool_v2 onChange={(e) => { setNewDetail(e), setChange(c => c + 1) }} value={detail} />
                <div style={{ display: "flex", margin: "10px 0", maxWidth: "210px", justifyContent: "space-between" }}>
                    {saving ? <Button name='。。。' onClick={() => { }} /> : <Button name='保存' disable={!savable} onClick={() => UpdatePost(body)} />}
                    <Button name="プレビュー" disable={!savable} onClick={() => UpdatePostDemo(body)} />
                </div>
            </div>
            <ImageModal modalOpen={openModal} onCanel={() => setOpenModal(false)} onImages={(arrId) => { setOpenModal(false), setImage(arrId[0].id); setSavable(true) }} />
        </div>
    )
}

export default Page