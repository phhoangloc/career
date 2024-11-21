'use client'
import React, { useState, useEffect } from 'react'
import store from '@/redux/store'
import NaviProfile from './naviProfile'
import NaviData from './naviData'
import Button from '../input/button'
import { useRouter } from 'next/navigation'
type Props = {
    data: any[],
    naviLeftWitdh: string
}

const NaviLeft = ({ data, naviLeftWitdh }: Props) => {

    const [currentUser, setCurrentUser] = useState<any>(store.getState().user)
    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))

    }
    useEffect(() => {
        update()
    })


    const toPage = useRouter()
    return (
        currentUser?._id ?
            <div>
                <NaviProfile />
                <NaviData data={data} naviLeftWitdh={naviLeftWitdh} />
            </div> :
            <div>
                <p className='width-max-content' style={{ margin: "auto" }} >こんにちは、</p>
                <div className='width-max-content' style={{ margin: "auto" }}><Button name='ログイン' onClick={() => toPage.push("/login")} /></div>
            </div>

    )
}

export default NaviLeft