import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import Button from './input/button';
type Props = {}

const SearchTool = (props: Props) => {

    const workplaces = [
        {
            name: "山田老人ホーム",
        },
        {
            name: "トヨタ老人ホーム",
        },
        {
            name: "池田老人ホーム",
        },
    ]
    const worktypes = [
        {
            name: "手話通訳士",
        },
        {
            name: "エンジニア",
        },
        {
            name: "企画・管理",
        },
        {
            name: "事務・アシスト",
        },
    ]
    const workstatus = [
        {
            name: "正社員",
        },
        {
            name: "アルバイト・バイト",
        },
        {
            name: "契約社員",
        },
        {
            name: "フリーランス",
        },
    ]
    const locations = [
        {
            name: "北海道",
            child: [
                "札幌市"
            ],
        },
        {
            name: "東北",
            child: [
                "仙台市"
            ],
        },
        {
            name: "関東",
            child: [
                "東京都"
            ],
        },
        {
            name: "北信越",
            child: [],
        },
        {
            name: "東海",
            child: [],

        },
        {
            name: "関西",
            child: [
                "京都市", "大阪市", "神戸市"
            ],

        },
        {
            name: "中国・四国",
            child: [],

        },
        {
            name: "九州・沖縄",
            child: [
                "福岡", "沖縄"
            ],

        },
        {
            name: "海外",
            child: [
                "韓国", "中国"
            ],
        },
    ]

    const [wp, setwp] = useState<string>("")
    const [wt, setwt] = useState<string>("")
    const [stt, setstt] = useState<string>("")
    const [lo, setlo] = useState<string[]>([])
    const [area, setArea] = useState<number>(-1)
    const [areaModal, setAreaModal] = useState<boolean>(true)

    const loString = lo.join()

    const toPage = useRouter()

    const onSearch = (a: string, b: string, c: string, s: string) => {
        toPage.push(`/home/search/${a ? a : "a"}/${b ? b : "b"}/${s ? s : "s"}/${c ? c : "c"}`)
    }
    return (
        <div className='searchTool'>
            <div className='title'>
                <h2> look for a job</h2>
                <h1>仕事を探す</h1>
            </div>
            <div className='grid_box'>
                <div className='selectbox xs12 md6 lg4'>
                    <select onChange={(e) => setwp(e.target.value)}>
                        <option value={undefined}>施設</option>
                        {workplaces.map((item, index) =>
                            <option key={index} value={item.name}>{item.name}</option>
                        )}
                    </select>
                </div>
                <div className='selectbox xs12 md6 lg4'>
                    <select onChange={(e) => setwt(e.target.value)}>
                        <option value={undefined}>職種</option>
                        {worktypes.map((item, index) =>
                            <option key={index} value={item.name}>{item.name}</option>
                        )}
                    </select>
                </div>
                <div className='selectbox xs12 md6 lg4'>
                    <select onChange={(e) => setstt(e.target.value)}>
                        <option value={undefined}>雇用形態</option>
                        {workstatus.map((item, index) =>
                            <option key={index} value={item.name}>{item.name}</option>
                        )}
                    </select>
                </div>
                <div className='selectbox xs12 md6 lg8 '>
                    {areaModal ?
                        <>
                            <select onClick={() => setAreaModal(false)}>
                                <option value={undefined}>エリア</option>
                            </select>
                            {lo.map((item, index) => <li style={{ fontWeight: "normal", fontSize: "1rem", lineHeight: 1.5, marginTop: "10px" }} key={index}>{item}</li>)}
                        </>
                        : null}
                    <div className={`area ${areaModal ? "area_none" : ""}`}>
                        <div className='flexbox' style={{ background: "white", height: "60px" }}>
                            <h3 style={{ height: "100%", lineHeight: "70px", padding: "0 5px" }}>エリア</h3>
                            <CancelOutlinedIcon onClick={() => { setAreaModal(true), setlo([]) }} />
                        </div>
                        <div className='flexbox'>
                            <div className='area_titles'>
                                {locations.map((item, index) =>
                                    <div className={`area_title ${index === area ? "area_title_select" : ""}`} key={index} onClick={() => setArea(index)}>
                                        {item.name}
                                    </div>
                                )}
                            </div>
                            <div className='area_children'>
                                <h4 style={{ textAlign: "center", height: "30px", lineHeight: "40px" }}>{locations[area]?.name}</h4>
                                <div className='area_title' >
                                    {locations[area]?.child.map((item, index) =>
                                        <p key={index}>{lo.includes(item) ?
                                            <CheckBoxOutlinedIcon onClick={() => setlo(p => p.filter(i => i !== item))} /> :
                                            <CheckBoxOutlineBlankOutlinedIcon onClick={() => setlo(p => [...p, item])} />}
                                            {item}</p>
                                    )}
                                </div>
                                <div style={{ position: "absolute", bottom: "5px", right: "5px", width: "max-content", height: "max-content" }}><Button name="検索" onClick={() => { setAreaModal(true) }} /></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='button_search xs12 md4 '>
                    <Button onClick={() => onSearch(wp, wt, loString, stt)} name='検索' />
                </div>
            </div>
        </div>
    )
}

export default SearchTool