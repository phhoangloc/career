'use client'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
const Header = () => {

    const [menu, setMenu] = useState<boolean>(false)
    const [itemModal, setItemModal] = useState<boolean>(false)

    const [search, setSearch] = useState<string>("")
    const toPage = useRouter()
    return (
        <div className='header'>
            <div style={{ height: "60px", position: "relative" }}>
                <div onClick={() => toPage.push("/home")} style={{ height: "150%", padding: "15px", position: "absolute", cursor: "pointer" }}>
                    <Image src="/img/ロゴ仮.png" width={500} height={500} alt="logo" style={{ height: "100%", width: "auto", }} />
                </div>
            </div>

            <div className='buttonOff'>
                <MenuIcon style={{ position: "absolute", top: "75px", right: "5px" }} onClick={() => setMenu(true)} />
            </div>

            <div className={`menu ${menu ? "" : "menuOff"}`}>
                <div className='buttonOff'>
                    <CloseIcon style={{ position: "absolute", top: "5px", right: "5px" }} onClick={() => setMenu(false)} />
                </div>

                {/* <div className='item'> */}
                <p onClick={() => toPage.push("/")} >ホーム </p>
                <p onClick={() => toPage.push("/home/search/n/a/b/s/c/lis")} >仕事を探す </p>
                {/* <div className={`children ${itemModal ? "children_on" : ""}`}>
                        <p onClick={() => setItemModal(false)} >仕事を探す<KeyboardArrowDownIcon /></p>
                        <p onClick={() => toPage.push("/home/search/a/b/c/d")}>施設で探す</p>
                        <p onClick={() => toPage.push("/home/search/a/b/c/d")}>職種で探す</p>
                        <p onClick={() => toPage.push("/home/search/a/b/c/d")}>雇用形態で探す</p>
                        <p onClick={() => toPage.push("/home/search/a/b/c/d")}>エリアで探す</p>
                        <p>人気タグで探す</p>
                    </div> */}
                {/* </div> */}
                {/* <p>業界を知る <KeyboardArrowDownIcon /></p> */}
                <p onClick={() => toPage.push("/home/facility")}>施設一覧</p>
                <p onClick={() => toPage.push("/home/news")}>ニュース</p>
                <p onClick={() => toPage.push("/home/contact")}>お問い合わせ</p>
                <div className='header_input'><input placeholder='仕事をフリーワードで探す' value={search} onChange={(e) => setSearch(e.target.value)} /><SearchIcon onClick={() => toPage.push('/home/search/' + search + "/a/b/s/c")} /></div>
            </div>
        </div>
    )
}

export default Header