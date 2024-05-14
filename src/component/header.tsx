'use client'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
const Header = () => {

    const [menu, setMenu] = useState<boolean>(false)

    return (
        <div className='header'>
            <div style={{ height: "60px" }}></div>

            <div className='buttonOff'>
                <MenuIcon style={{ position: "absolute", top: "75px", right: "5px" }} onClick={() => setMenu(true)} />
            </div>

            <div className={`menu ${menu ? "" : "menuOff"}`}>
                <div className='buttonOff'>
                    <CloseIcon style={{ position: "absolute", top: "5px", right: "5px" }} onClick={() => setMenu(false)} />
                </div>

                <p>仕事を探す</p>
                <p>業界を知る</p>
                <p>施設の方へ</p>
                <p>お知らせ</p>
                <div className='header_input'><input placeholder='Search' /><SearchIcon /></div>
            </div>
        </div>
    )
}

export default Header