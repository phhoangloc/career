import React, { useEffect, useRef, useState } from 'react'
import store from '@/redux/store'

type Props = {
    onChange: (e: string) => void,
    name: string,
    value: string,
}

const TextAreaTool = ({ onChange, name, value }: Props) => {

    const [currentTheme, setCurrentTheme] = useState<boolean>(store.getState().theme)
    const update = () => {
        store.subscribe(() => setCurrentTheme(store.getState().theme))
    }
    update()

    const inputRef = useRef<HTMLDivElement | null>(null)
    const inputImgRef = useRef<any>()

    const [focus, setFocus] = useState<boolean>(false)
    const [focusInputImg, setFocusInputImg] = useState<boolean>(false)
    const [imglink, setImgLink] = useState<string>("")

    const createText = (value: string) => {
        inputRef.current ? inputRef.current.innerHTML += `<${value}>hello world</${value}>` : null
        inputRef.current ? onChange(inputRef.current.innerHTML) : null

    }
    const createImage = (type: string, value: string) => {
        inputRef.current ? inputRef.current.innerHTML += `<${type} src=${value}></${type}>` : null
        inputRef.current ? onChange(inputRef.current.innerHTML) : null
        setFocusInputImg(false)
        setImgLink("")
    }

    useEffect(() => {
        inputRef.current ? inputRef.current.innerHTML = value : null
    }, [value])

    const boxStyle: React.CSSProperties = {
        width: "100%",
        margin: "10px auto",
        position: "relative",
        borderRadius: "5px"
    }

    const nameStyle: React.CSSProperties = {
        padding: "5px",
        transform: "translateY(30px)",
        width: "max-content",
        transition: "all 0.5s",
        fontWeight: "bold",
        fontSize: "1rem",
        opacity: "1",
    }
    const nameStyleFocus: React.CSSProperties = {
        padding: "5px",
        transform: "translateY(00px)",
        width: "max-content",
        transition: "all 0.5s",
        fontWeight: "bold",
        fontSize: "0.9rem",
        opacity: "0.5",
    }
    const toolStyle: React.CSSProperties = {
        display: "flex",
        flexWrap: "wrap"
    }
    const buttonStyle: React.CSSProperties = {
        width: "max-content",
        border: "1px solid #888",
        margin: "5px",
        padding: "5px",
        borderRadius: "5px",
        cursor: "pointer",
        height: "25px"
    }
    const inputImgStyle: React.CSSProperties = {
        width: "0px",
        padding: 0,
        border: 0,
        background: "none",
        transition: "all 0.5s",
        outline: "none",
        color: "inherit",
        borderBottom: "1px solid #888",
        margin: "0",
    }
    const inputImgFocusStyle: React.CSSProperties = {
        width: "200px",
        padding: 0,
        border: 0,
        background: "none",
        transition: "all 0.5s",
        outline: "none",
        color: "inherit",
        borderBottom: "1px solid #888",
        margin: "0 5px",

    }

    const inputBox: React.CSSProperties = {
        height: "300px",
        padding: "10px",
        zIndex: 1,
        textAlign: "justify",
        overflow: "auto",
        lineHeight: 1.75,
    }

    const inputBoxFocus: React.CSSProperties = {
        height: "300px",
        padding: "10px",
        textAlign: "justify",
        overflow: "auto",
        lineHeight: 1.75,

    }
    return (
        <div className={`borderBox ${currentTheme ? "background_light" : "background_dark"} ${focus || inputRef.current?.innerHTML || value ? "textarea_focus" : ""}`} style={boxStyle}>

            <div className={`tool`} style={toolStyle}>
                <p style={buttonStyle} className='border' onClick={() => createText("h1")}>h1</p>
                <p style={buttonStyle} onClick={() => createText("h2")}>h2</p>
                <p style={buttonStyle} onClick={() => createText("h3")}>h3</p>
                <p style={buttonStyle} onClick={() => createText("h4")}>h4</p>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <input ref={inputImgRef}
                        style={focusInputImg ? inputImgFocusStyle : inputImgStyle}
                        placeholder='link' onChange={(e) => setImgLink(e.target.value)}
                        onFocus={() => setFocusInputImg(true)}></input>
                    {focusInputImg ? <p style={buttonStyle} onClick={() => createImage("img", imglink)}>add</p> : null}
                    <p style={buttonStyle} onClick={() => { inputImgRef.current?.focus(), setImgLink(""), setFocusInputImg(!focusInputImg) }}>{focusInputImg ? "cancel" : "add image url"}</p>
                </div>
            </div>
            <p style={focus || value ? nameStyleFocus : nameStyle} className={`name ${focus || inputRef.current?.innerHTML || value ? "name_focus" : ""}`} >{name}</p>
            <div ref={inputRef}
                style={focus ? inputBoxFocus : inputBox}
                className="dangerousBox inputFocusOutlineNone scroll scrollbar"
                contentEditable={true}
                onInput={(e) => onChange(e.currentTarget.innerHTML)}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
            >
            </div>
        </div >
    )
}

export default TextAreaTool