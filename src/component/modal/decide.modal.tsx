'use client'
import React, { useState, useEffect } from 'react'
import Button from '../input/button'
import store from '@/redux/store'
import { setAlert } from '@/redux/reducer/alertReducer'

const DecideModal = () => {
  const [currentTheme, setCurrentTheme] = useState<any>(store.getState().theme)
  const [currentAlert, setCurrentAlert] = useState<any>(store.getState().alert)
  const update = () => {
    store.subscribe(() => setCurrentTheme(store.getState().theme))
    store.subscribe(() => setCurrentAlert(store.getState().alert))
  }
  useEffect(() => {
    update()
  })

  return (
    <div className={`ps-f w100p h100p dp-flex fd-col jc-center ta-center bg-drop zi-4 ${currentAlert.open ? 'trsf-scale-1' : 'trsf-scale-0'}`}>
      <div className={`w100p h-mc mw-575px mg-auto br-5px pd-10px trss-1-2 trss-delay-1-4 ${currentAlert.open ? "" : "trsf-top--100p"} light1`}>
        <p>{currentAlert.msg}</p>
        <div className='w-mc dp-flex mg-auto'>
          <Button name="yes" onClick={() => store.dispatch(setAlert({ value: true, open: false, msg: "" }))} />
          <Button name="no" onClick={() => store.dispatch(setAlert({ value: false, open: false, msg: "" }))} />
        </div>
      </div>
    </div>
  )
}

export default DecideModal