'use client'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
const Header = () => {

    const [menu, setMenu] = useState<boolean>(false)
    const [itemModal, setItemModal] = useState<boolean>(false)

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

                <div className='item'>
                    {itemModal ? null : <p onClick={() => setItemModal(true)}>仕事を探す <KeyboardArrowDownIcon /></p>}
                    <div className={`children ${itemModal ? "children_on" : ""}`}>
                        <p onClick={() => setItemModal(false)} >仕事を探す<KeyboardArrowDownIcon /></p>
                        <p>施設で探す</p>
                        <p>職種で探す</p>
                        <p>雇用形態で探す</p>
                        <p>エリアで探す</p>
                        <p>人気タグでで探す</p>
                    </div>
                </div>
                <p>業界を知る <KeyboardArrowDownIcon /></p>
                <p>施設の方へ</p>
                <p>お知らせ</p>
                <div className='header_input'><input placeholder='Search' /><SearchIcon /></div>
            </div>
        </div>
    )
}

export default Header