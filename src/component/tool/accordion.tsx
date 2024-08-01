'use client'
import React, { useState, useEffect } from 'react'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Link from 'next/link';
import store from '@/redux/store';
import { relative } from 'path';
type Props = {
    title: string
    data: any[]
    width?: string
}

const Accordion = ({ title, data, width }: Props) => {

    const [open, setOpen] = useState<boolean>(false)

    const clickBox: React.CSSProperties = {
        display: "flex",
        height: "50px",
        lineHeight: "50px",
        cursor: "pointer",
        border: "2px solid #888",
        borderRadius: "5px",
        padding: "0 5px",
        margin: "0 5px",
    }

    const selectBox: React.CSSProperties = {
        width: "calc(100% - 10px)",
        borderRadius: "5px",
        boxShadow: "0px 0px 2px 0px #aaa ",
        position: "absolute",
        top: "55px",
        overflow: "hidden",
        transition: "all 0.25s",
        height: `${open ? data?.length * 42 + "px" : 0}`,
        zIndex: 1,
        margin: "0 5px",

    }

    const selectTitle: React.CSSProperties = {
        height: "40px",
        lineHeight: "50px",
        padding: "0 5px",
        cursor: "pointer",
        borderRadius: "5px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        margin: "1px",
    }

    return (
        <div style={{ position: "relative", width: width ? width : "100%" }}>
            <div style={clickBox} onClick={() => setOpen(!open)} >
                <h4 className='tw-no' style={{ overflow: "hidden", textOverflow: "ellipsis", lineHeight: "50px" }}>{title}</h4>
                {open ?
                    <KeyboardArrowUpIcon style={{ width: "30px", height: "30px", padding: "5px", boxSizing: "border-box", margin: "auto 0 auto auto" }} />
                    : <KeyboardArrowDownIcon style={{ width: "30px", height: "30px", padding: "5px", boxSizing: "border-box", margin: "auto 0 auto auto" }} />}
            </div>
            <div className='bglv1' style={selectBox}>
                {
                    data ? data.map((item: any, index: number) =>
                        item?.link ?
                            <Link href={item.link}
                                onClick={() => { setOpen(false) }}
                                key={index}>
                                <div className='devide'
                                    style={selectTitle}>
                                    {item?.name || item?.title}
                                </div>
                            </Link> :
                            <div key={index} onClick={() => { item.func && item.func(), setOpen(false) }}
                                className='devide'
                                style={selectTitle}>
                                {item?.name || item?.title}
                            </div>
                    ) : null
                }
            </div>
        </div>
    )
}

export default Accordion