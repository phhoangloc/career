import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import Button from './input/button';
import { NoUserAuthen } from '@/api/NoUserAuthen';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { japanRegions } from '@/lib/area';
import { workstatusList, statusList } from '@/data/workstatus';
import RefreshIcon from '@mui/icons-material/Refresh';
import Image from 'next/image';
type Props = {
    body?: any
}

const SearchTool = ({ body }: Props) => {

    const [workplaces, setWorkplace] = useState<string[]>([])
    const getWorkplace = async () => {
        const result = await NoUserAuthen.getItem("facility", "", "", "", "", "", undefined, undefined)
        if (result.success) {
            setWorkplace(result.data)
        }
    }

    useEffect(() => {
        getWorkplace()
    }, [])
    const [worktypes, setWorktypes] = useState<any[]>([])
    const getWorkType = async () => {
        const result = await NoUserAuthen.getItem("worktype", "", "", "", "", "", undefined, undefined)
        if (result.success) {
            setWorktypes(result.data)
        }
    }

    useEffect(() => {
        getWorkType()
    }, [])

    const [wp, setwp] = useState<string>("")
    const [wt, setwt] = useState<string>("")
    const [stt, setstt] = useState<string>("")
    const [lis, setLis] = useState<string>("")
    const [lo, setlo] = useState<string[]>([])
    const [area, setArea] = useState<number>(-1)
    const [areaModal, setAreaModal] = useState<boolean>(true)

    const loString = lo.join()

    const toPage = useRouter()

    const onSearch = (a: string, b: string, c: string, s: string, lis: string) => {
        toPage.push(`/home/search/n/${a ? a : "a"}/${b ? b : "b"}/${s ? s : "s"}/${c ? c : "c"}/${lis ? lis : "lis"}`)
    }


    useEffect(() => {
        setlo(body?.lo[0].length ? body.lo : [])
    }, [])

    return (
        <div className='searchTool'>
            <div className='title' style={{ margin: "auto", maxWidth: "1200px" }}>
                <h2 style={{ textAlign: "left" }}>Job Search</h2>
                <div style={{ display: "flex", width: "100%" }}><h1 style={{ lineHeight: "inherit" }}>仕事を探す</h1> <Image style={{ marginTop: "5px" }} src={"/icon/icon2.png"} width={40} height={40} alt="icon2" /></div>
            </div>
            <div className='grid_box'>
                <div className='selectbox xs12 md6 lg8  '>
                    <KeyboardArrowDownIcon style={{ position: "absolute", right: "20px", top: "25px" }} onClick={() => setAreaModal(false)} />
                    {areaModal ?
                        <>
                            <select onClick={() => setAreaModal(false)}>
                                <option value={undefined}>エリア</option>
                            </select>
                            {lo.map((item, index) => <li style={{ fontWeight: "normal", fontSize: "1rem", lineHeight: 1.5, marginTop: "10px" }} key={index}>{item}</li>)}
                            {/* {body.lo.map((item: any, index: number) => <li style={{ fontWeight: "normal", fontSize: "1rem", lineHeight: 1.5, marginTop: "10px" }} key={index}>{item}</li>)} */}
                        </>
                        : null}
                    <div className={`area ${areaModal ? "area_none" : ""}`}>
                        <div className='flexbox' style={{ background: "white", height: "60px" }}>
                            <h3 style={{ height: "100%", lineHeight: "70px", padding: "0 5px" }}>エリア</h3>
                            <CancelOutlinedIcon onClick={() => { setAreaModal(true), setlo([]) }} />
                        </div>
                        <div className='flexbox'>
                            <div className='area_titles'>
                                {japanRegions.map((item, index) =>
                                    <div className={`area_title ${index === area ? "area_title_select" : ""}`} key={index} onClick={() => setArea(index)}>
                                        {item.region}
                                    </div>
                                )}
                            </div>
                            <div className='area_children'>
                                <h4 style={{ textAlign: "center", height: "30px", lineHeight: "40px" }}>{japanRegions[area]?.region}</h4>
                                <div className='area_title' >
                                    {japanRegions[area]?.prefectures.map((item, index) =>
                                        <p key={index}>{lo.includes(item.name) ?
                                            <CheckBoxOutlinedIcon onClick={() => setlo(p => p.filter(i => i !== item.name))} /> :
                                            <CheckBoxOutlineBlankOutlinedIcon onClick={() => setlo(p => [...p, item.name])} />}
                                            {item.name}</p>
                                    )}
                                </div>
                                <div style={{ position: "absolute", bottom: "5px", right: "5px", width: "max-content", height: "max-content" }}><Button name="検索" onClick={() => { setAreaModal(true) }} /></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='selectbox xs12 md6 lg4'>
                    <select onChange={(e) => setwt(e.target.value)}>
                        <option value={"b"}>{"職種"}</option>
                        {worktypes.map((item, index) =>
                            <option key={index} value={item.name} selected={body?.wt === item.name ? true : false}>{item.name}</option>
                        )}
                    </select>
                </div>
                <div className='selectbox xs12 md6 lg4'>
                    <select onChange={(e) => setstt(e.target.value)}>
                        <option value={"s"}>{"雇用形態"}</option>
                        {workstatusList.map((item, index) =>
                            <option key={index} value={item.name} selected={body?.ws === item.name ? true : false}>{item.name}</option>
                        )}
                    </select>
                </div>
                <div className='selectbox xs12 md6 lg4'>
                    <select onChange={(e) => setLis(e.target.value)}  >
                        <option value={"lis"}>{"資格の有無"}</option>

                        {statusList.map((item: any, index: any) =>
                            <option key={index} value={item.name} selected={body?.lis === item.name ? true : false}>{item.name}</option>
                        )}
                    </select>
                </div>
                <div className='selectbox xs12 md6 lg4'>
                    <select onChange={(e) => setwp(e.target.value)} >
                        <option value={"a"}>{"施設"}</option>
                        {workplaces.map((item: any, index: any) =>
                            <option key={index} value={item.name} selected={body?.wp === item.name ? true : false}>{item.name}</option>
                        )}
                    </select>
                </div>


            </div>
            <div className='button_search xs12 md4 '>
                <Button onClick={() => onSearch(wp || body?.wp, wt || body?.wt, loString, stt || body?.ws, lis || body?.lis)} name='検索' />
                <RefreshIcon onClick={() => toPage.push("/home/search//n/a/b/s/c/lis")} />
            </div>
        </div>
    )
}

export default SearchTool