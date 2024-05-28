import React, { ReactNode, useEffect, useRef, useState } from 'react'
import store from '@/redux/store'
import AddLinkIcon from '@mui/icons-material/AddLink';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
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

    const inputRef = useRef<any>()
    const inputImgRef = useRef<any>()
    const inputLinkRef = useRef<any>()

    const [x, setX] = useState<number>(0)
    const [y, setY] = useState<number>(0)
    const [textSelect, setTextSelect] = useState<string>("")

    const [focus, setFocus] = useState<boolean>(false)
    const [focusInputImg, setFocusInputImg] = useState<boolean>(false)
    const [focusInputLink, setFocusInputLink] = useState<boolean>(false)
    const [imglink, setImgLink] = useState<string>("")
    const [link, setLink] = useState<string>("")

    const createText = (value: string) => {
        const child = inputRef.current.childNodes[x]
        child ? textSelect ? child.innerHTML = `<${value}>${textSelect}</${value}>` : null : inputRef.current.innerHTML += `<div><${value}>${value}</${value}></div>`
        inputRef.current ? onChange(inputRef.current.innerHTML) : null
        setTextSelect("")
    }
    const createLink = (value: string) => {
        const child = inputRef.current.childNodes[x]
        child ? textSelect ? child.innerHTML = `<a href=${value} target="_blank">${textSelect}</a>` : child.innerHTML = `<a href=${value} target="_blank">${value}</a>` : inputRef.current.innerHTML += `<div><a href=${value} target="_blank">${value}</a></div>`
        inputRef.current ? onChange(inputRef.current.innerHTML) : null

    }
    const createImage = (type: string, value: string) => {
        const child = inputRef.current.childNodes[x]
        child ? child.innerHTML += `<${type} src=${value}></${type}>` : inputRef.current.innerHTML += `<div><${type} src=${value}></${type}></div>`
        inputRef.current ? onChange(inputRef.current.innerHTML) : null
        setFocusInputImg(false)
        setImgLink("")
    }

    useEffect(() => {
        inputRef.current ? inputRef.current.innerHTML = `${value}` : null
    }, [value])


    const getPosition = () => {
        const selection = window.getSelection();
        selection && setTextSelect(selection?.toString())
        const range = selection?.getRangeAt(0);
        const preCaretRange = range?.cloneRange();
        setY(preCaretRange?.endOffset || 0)
        let node: Node | undefined | null = range?.endContainer;
        let index = 0;
        while (node && node !== inputRef.current) {
            if (node.parentNode === inputRef.current) {
                index = Array.prototype.indexOf.call(inputRef.current.childNodes, node);
                break;
            }
            node = node.parentNode;
        }
        setX(index);
    }

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
        width: "24px",
        boxShadow: "1px 1px 5px -2.5px #444",
        margin: "5px",
        padding: "5px",
        borderRadius: "5px",
        cursor: "pointer",
        height: "24px",
        textAlign: "center"
    }
    const inputImgStyle: React.CSSProperties = {
        width: "0px",
        padding: 0,
        border: "none",
        background: "#fff",
        transition: "all 0.5s",
        outline: "none",
        color: "inherit",
        boxShadow: "1px 1px 5px -1px #aaa",
        margin: "0",
    }
    const inputImgFocusStyle: React.CSSProperties = {
        width: "200px",
        height: "24px",
        padding: "5px",
        border: "none",
        transition: "all 0.5s",
        outline: "none",
        color: "inherit",
        margin: "5px",
        boxShadow: "1px 1px 5px -1px #aaa",
        borderRadius: "5px",
        background: "#fff",
    }

    const inputBox: React.CSSProperties = {
        height: "calc(100vh - 200px)",
        padding: "10px",
        zIndex: 1,
        textAlign: "left",
        overflow: "auto",
        borderRadius: "5px",
        opacity: 0.9,
    }

    const inputBoxFocus: React.CSSProperties = {
        height: "calc(100vh - 200px)",
        padding: "10px",
        textAlign: "left",
        overflow: "auto",
        borderRadius: "5px",
        opacity: 1,

    }

    return (
        <div className={`borderBox ${focus || inputRef.current?.innerHTML || value ? "textarea_focus" : ""}`} style={boxStyle}>
            <div className={`tool`} style={toolStyle}>
                <p style={buttonStyle} className='border' onClick={() => createText("h1")}>h1</p>
                <p style={buttonStyle} onClick={() => createText("h2")}>h2</p>
                <p style={buttonStyle} onClick={() => createText("h3")}>h3</p>
                <p style={buttonStyle} onClick={() => createText("h4")}>h4</p>
                <p style={buttonStyle} onClick={() => createText("p")}>p</p>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <input ref={inputLinkRef}
                        style={focusInputLink ? inputImgFocusStyle : inputImgStyle}
                        placeholder='url link' onChange={(e) => setLink(e.target.value)}
                        onFocus={() => setFocusInputLink(true)}></input>
                    {focusInputLink ? <CheckIcon style={buttonStyle} onClick={() => { createLink(link), setFocusInputLink(false), setLink("") }} /> : null}
                    {focusInputLink ? <CloseIcon style={buttonStyle} onClick={() => { setLink(""), setFocusInputLink(false) }} /> : <AddLinkIcon style={buttonStyle} onClick={() => { inputLinkRef.current?.focus() }} />}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <input ref={inputImgRef}
                        style={focusInputImg ? inputImgFocusStyle : inputImgStyle}
                        placeholder='img link' onChange={(e) => setImgLink(e.target.value)}
                        onFocus={() => setFocusInputImg(true)}></input>
                    {focusInputImg ? <CheckIcon style={buttonStyle} onClick={() => { createImage("img", imglink), setFocusInputImg(false), setImgLink("") }} /> : null}
                    {focusInputImg ? <CloseIcon style={buttonStyle} onClick={() => { setImgLink(""), setFocusInputImg(false) }} /> : <AddPhotoAlternateIcon style={buttonStyle} onClick={() => { inputImgRef.current?.focus() }} />}
                </div>
            </div>
            <p style={focus || value ? nameStyleFocus : nameStyle} className={`name ${focus || inputRef.current?.innerHTML || value ? "name_focus" : ""}`} >{name}</p>
            <div ref={inputRef}
                style={focus ? inputBoxFocus : inputBox}
                className={`dangerousBox inputFocusOutlineNone scrollbar-none ${currentTheme ? "light" : "dark"}`}
                contentEditable={true}
                onInput={(e) => onChange(e.currentTarget.innerHTML)}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onSelect={() => getPosition()}
                onMouseUp={() => getPosition()}
                onKeyUp={() => getPosition()}
            >
            </div>
        </div >
    )
}

export default TextAreaTool