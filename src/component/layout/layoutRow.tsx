'use client'
import React, { useEffect } from 'react'
import { useState } from 'react'
import IconToggle from '../tool/iconToggle'
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import store from '@/redux/store';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { setTheme } from '@/redux/reducer/ThemeReduce';
import Link from 'next/link';
useEffect
type Props = {
    children: React.ReactNode,
    naviLef: React.ReactNode,
    naviLeftWitdh: string
}

const LayoutRow = ({ children, naviLef, naviLeftWitdh }: Props) => {

    const [currentTheme, setCurrentTheme] = useState<boolean>(store.getState().theme)
    const update = () => {
        store.subscribe(() => setCurrentTheme(store.getState().theme))
    }
    useEffect(() => {
        update()
    })

    const [modalOpen, setModalOpen] = useState<boolean>(true)

    return (
        <div className='overflow-hidden border-radius-5' style={{ minHeight: "calc(100vh - 10px)" }}>
            <div className='display-flex position-relative width-max-content ' style={{ maxWidth: "1600px", margin: "auto", }} >
                <div className={"navi-left transition-all-05s height-100p overflow-hidden"} style={modalOpen ? { width: naviLeftWitdh } : { width: "0px" }}>
                    {naviLef}
                </div>
                <div className={`${currentTheme ? "light1" : "dark1"} navi-right transition-all-05s border-radius-5 box-shadow-0 `} style={{ height: "calc(100% - 10px)", margin: "5px", width: modalOpen ? `calc(100vw  - ${naviLeftWitdh} - 20px)` : "calc(100vw - 20px)" }} >
                    <div style={{ height: "40px", display: "flex" }}>
                        <IconToggle
                            icon1={<MenuOpenIcon onClick={() => setModalOpen(false)} style={{ width: "30px", height: "30px" }} />}
                            icon2={<MenuIcon onClick={() => setModalOpen(true)} style={{ width: "30px", height: "30px" }} />}
                            value={modalOpen} style={{ width: "40px", height: "40px", padding: "5px" }} />
                        {/* <h2 style={{ lineHeight: "50px" }}>Admin</h2> */}
                        <IconToggle
                            icon1={<DarkModeIcon onClick={() => store.dispatch(setTheme(false))} style={{ width: "30px", height: "30px" }} />}
                            icon2={<LightModeIcon onClick={() => store.dispatch(setTheme(true))} style={{ width: "30px", height: "30px" }} />}
                            value={currentTheme} style={{ width: "40px", height: "40px", padding: "5px", position: 'absolute', right: "10px" }} />
                    </div>
                    <div className='navi-right display-flex flex-direction-column justify-content-center' style={{ minHeight: "calc(100% - 40px)" }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LayoutRow