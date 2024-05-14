'use client'
import React, { useState, useEffect } from 'react'
import store from '@/redux/store'
import Image from 'next/image'
import PersonIcon from '@mui/icons-material/Person';
import IconToggle from '../tool/iconToggle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useRouter } from 'next/navigation';
import { setRefresh } from '@/redux/reducer/RefreshReduce';

const NaviProfile = () => {

    const [currentUser, setCurrentUser] = useState<any>(store.getState().user)
    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))

    }
    useEffect(() => {
        update()
    })
    const [userModal, setUserModal] = useState<boolean>(false)
    const toPage = useRouter()
    return (
        <>
            <div className='display-flex'>
                {currentUser.avata?.name ?
                    <Image src={currentUser.avata?.name} width={40} height={40} alt='avata' /> :
                    <PersonIcon style={{ width: "40px", height: "40px" }} />}
                <h4 style={{ lineHeight: "50px" }}>{currentUser.username}</h4>
                <IconToggle
                    icon1={<ArrowDropUpIcon style={{ width: "30px", height: "30px" }} onClick={() => setUserModal(false)} />}
                    icon2={<ArrowDropDownIcon style={{ width: "30px", height: "30px" }} onClick={() => setUserModal(true)} />}
                    value={userModal}
                    style={{ height: "30px", margin: "5px 0" }} />
            </div>
            <div className='transition-all-05s overflow-hidden' style={{ height: userModal ? "60px" : "0px" }} >
                <div className='text-ellipsis hover-color-main hover-color-1 ' style={{ height: "30px", lineHeight: "30px", fontWeight: "400", cursor: "pointer", opacity: 0.75, fontSize: "0.9rem" }}
                    onClick={() => toPage.push("/profile")}>
                    profile
                </div>
                <div className='text-ellipsis hover-color-main hover-color-1 ' style={{ height: "30px", lineHeight: "30px", fontWeight: "400", cursor: "pointer", opacity: 0.75, fontSize: "0.9rem" }}
                    onClick={() => { localStorage.clear(), store.dispatch(setRefresh()) }}>
                    log out
                </div>
            </div>
        </>
    )
}

export default NaviProfile