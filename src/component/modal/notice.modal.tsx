'use client'
import React, { useState, useEffect } from 'react'
import store from '@/redux/store'
import { NoUserAuthen } from '@/api/NoUserAuthen'
const NoticeModal = () => {
  const [currentNotice, setCurrentNotice] = useState<any>(store.getState().notice)
  const update = () => {
    store.subscribe(() => setCurrentNotice(store.getState().notice))
  }
  useEffect(() => {
    update()
  })

  const getModel = async () => {
    await NoUserAuthen.getItem("image", "", "", "", "", "", undefined, undefined)
    await NoUserAuthen.getItem("post", "", "", "", "", "", undefined, undefined)
  }
  useEffect(() => {
    getModel()
  }, [])

  return (
    <div className={`ps-f w100p h100p dp-flex fd-col jc-center ta-center bg-drop zi-4 ${currentNotice.open ? 'trsf-scale-1' : 'trsf-scale-0'}`}>
      <div className={`w100p h-mc mw-575px mg-auto br-5px pd-1p trss-1-2 trss-delay-1-4 ta-center ${currentNotice.open ? "" : "trsf-top--100p"} light1`}>
        <p>{currentNotice.msg}</p>
      </div>
    </div>
  )
}

export default NoticeModal