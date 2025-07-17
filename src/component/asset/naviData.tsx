import React, { useState, useEffect } from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import IconToggle from '../tool/iconToggle';
import Link from 'next/link';
import store from '@/redux/store';
type Props = {
    data: any[],
    naviLeftWitdh: string,
}

const NaviData = ({ data, naviLeftWitdh }: Props) => {

    const [currentUser, setCurrentUser] = useState<any>(store.getState().user)
    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))

    }
    useEffect(() => {
        update()
    })

    const [index, setIndex] = useState<number>(0)

    return (
        <div style={{ width: "calc(100% - 10px)" }}>
            {data.map((item_first, index_first) =>
                !item_first.position || item_first.position === currentUser.position ?
                    <div key={index_first}>
                        <div style={{ display: "flex" }}>
                            <div className='text-ellipsis '
                                onClick={() => index_first + 1 != index ? setIndex(index_first + 1) : setIndex(0)}
                                style={{ width: `calc(${naviLeftWitdh} - 40px)`, height: "40px", lineHeight: "50px", fontWeight: "700", cursor: "pointer", opacity: 0.75 }}>
                                {item_first.name}
                            </div>
                            {item_first.child ?
                                <IconToggle
                                    icon1={<ArrowDropUpIcon style={{ width: "30px", height: "30px" }} onClick={() => index_first + 1 != index ? setIndex(index_first + 1) : setIndex(0)} />}
                                    icon2={<ArrowDropDownIcon style={{ width: "30px", height: "30px" }} onClick={() => index_first + 1 != index ? setIndex(index_first + 1) : setIndex(0)} />}
                                    value={index === index_first + 1}
                                    style={{ height: "30px", margin: "5px 0" }} /> : null}
                        </div>
                        <div className='overflow-hidden transition-all-05s' style={{ height: index === index_first + 1 ? `calc(${item_first.child.length} * 35px)` : "0px" }}>
                            {
                                item_first.child ? item_first.child.map((item_second: any, index_second: number) =>
                                    <div className='text-ellipsis devide  '
                                        key={index_second}
                                        style={{ width: "100%", height: "35px", lineHeight: "30px", fontWeight: "400", cursor: "pointer", opacity: 0.75, fontSize: "0.9rem", padding: "5px" }}>
                                        {item_second.link ? <Link href={item_second.link} >
                                            <p style={{ width: "100%" }}>{item_second.name}</p>
                                        </Link> :
                                            <p onClick={() => { }} style={{ width: "100%" }}>{item_second.name}</p>}
                                    </div>
                                ) : null
                            }
                        </div>
                    </div> :
                    null
            )}
            <div className='text-ellipsis' style={{ width: `calc(${naviLeftWitdh} - 40px)`, height: "40px", lineHeight: "50px", fontWeight: "700", cursor: "pointer", opacity: 0.75 }} onClick={() => { localStorage.clear(), window.location.reload() }}>
                ログアウト
            </div>

        </div>

    )
}

export default NaviData