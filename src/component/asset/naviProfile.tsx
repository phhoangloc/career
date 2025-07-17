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
    const [currentRefresh, setCurrentRefresh] = useState<number>(store.getState().refresh)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
        store.subscribe(() => setCurrentRefresh(store.getState().refresh))


    }
    useEffect(() => {
        update()
    })

    const [userModal, setUserModal] = useState<boolean>(false)
    const toPage = useRouter()
    return (
        <>
            <div style={{ display: "flex", width: "calc(100% - 10px)", justifyContent: "space-between" }}>
                {currentUser.avata?.name ?
                    <Image src={currentUser.avata?.name} width={40} height={40} alt='avata' /> :
                    <PersonIcon style={{ width: "40px", height: "40px", margin: "0px" }} />}
                <h4 style={{ height: "50px", display: 'flex', flexDirection: "column", justifyContent: "center" }}>{currentUser.username}</h4>
            </div>
        </>
    )
}

export default NaviProfile