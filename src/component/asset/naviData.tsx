import React, { useState, useEffect } from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import IconToggle from '../tool/iconToggle';
import Link from 'next/link';

type Props = {
    data: any[],
    naviLeftWitdh: string,
}

const NaviData = ({ data, naviLeftWitdh }: Props) => {

    const [index, setIndex] = useState<number>(0)

    return (
        <div style={{ width: "calc(100% - 10px)" }}>
            {data.map((item_first, index_first) =>
                <div key={index_first}>
                    <div style={{ display: "flex" }}>
                        <div className='text-ellipsis'
                            style={{ width: `calc(${naviLeftWitdh} - 40px)`, height: "40px", lineHeight: "40px", fontWeight: "700", cursor: "pointer", opacity: 0.75 }}>
                            {item_first.name}
                        </div>
                        {item_first.child ?
                            <IconToggle
                                icon1={<ArrowDropUpIcon style={{ width: "30px", height: "30px" }} onClick={() => setIndex(0)} />}
                                icon2={<ArrowDropDownIcon style={{ width: "30px", height: "30px" }} onClick={() => setIndex(index_first + 1)} />}
                                value={index === index_first + 1}
                                style={{ height: "30px", margin: "5px 0" }} /> : null}
                    </div>
                    <div className='overflow-hidden transition-all-05s' style={{ height: index === index_first + 1 ? `calc(${item_first.child.length} * 30px)` : "0px" }}>
                        {
                            item_first.child ? item_first.child.map((item_second: any, index_second: number) =>
                                <div className='text-ellipsis hover-color-main hover-color-1'
                                    key={index_second}
                                    style={{ width: naviLeftWitdh, height: "30px", lineHeight: "30px", fontWeight: "400", cursor: "pointer", opacity: 0.75, fontSize: "0.9rem" }}>
                                    {item_second.link ? <Link href={item_second.link} >{item_second.name}</Link> : <p onClick={() => console.log("upload")}>{item_second.name}</p>}
                                </div>
                            ) : null
                        }
                    </div>
                </div>
            )}
        </div>

    )
}

export default NaviData