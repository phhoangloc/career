'use client'
import React, { useState, useEffect } from 'react'
import store from '../store'
import { setUser } from '../reducer/UserReduce'
import { UserAuthen } from '@/api/UserAuthen'
type Props = {
    children: React.ReactNode
}

const Provider = ({ children }: Props) => {
    const [currentTheme, setCurrentTheme] = useState<boolean>(store.getState().theme)
    const [currentRefresh, setCurrentRefresh] = useState<number>(store.getState().refresh)
    const update = () => {
        store.subscribe(() => setCurrentTheme(store.getState().theme))
        store.subscribe(() => setCurrentRefresh(store.getState().refresh))

    }
    useEffect(() => {
        update()
    })

    const checkLogin = async () => {
        const result = await UserAuthen.checkLogin()
        if (result.success) {
            store.dispatch(setUser(result.data))
        } else {
            store.dispatch(setUser({}))
        }
    }

    useEffect(() => {

        checkLogin()
    }, [currentRefresh])


    return (
        <div className={` ${currentTheme ? "light" : "dark"}`} style={{ padding: "5px" }}>
            {children}
        </div>

    )
}

export default Provider