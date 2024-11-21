import React, { useRef, useState } from 'react'
import store from '@/redux/store'
type Props = {
    onChange: (e: any) => void,
    name: React.ReactNode,
    value: any,
    type?: string,
    onfocus?: () => void,
    disabled?: boolean,
    warn?: string,
    sx?: string,
    placeholder?: string,
}

const Input = ({ onChange, name, value, type, onfocus, disabled, warn, placeholder }: Props) => {

    const inputRef: any = useRef()

    const [currentTheme, setCurrentTheme] = useState<boolean>(store.getState().theme)

    const update = () => {
        store.subscribe(() => setCurrentTheme(store.getState().theme))
    }

    update()

    const [focus, setFocus] = useState<boolean>(false)

    const boxStyle: React.CSSProperties = {
        width: "100%",
        margin: "10px auto",
        position: "relative",
        height: "50px",
        paddingBottom: "5px",
        border: `1px solid #aaa`,
        overflow: "hidden",
        borderRadius: "5px",
    }
    const boxStyleFocus: React.CSSProperties = {
        width: "100%",
        margin: "10px auto",
        position: "relative",
        height: "50px",
        paddingBottom: "5px",
        border: "2px solid ",
        borderRadius: "5px",
        borderColor: "#666633",
        overflow: "hidden"
    }
    const boxStyleFocusWarn: React.CSSProperties = {
        borderColor: "red",

    }
    const pStyle: React.CSSProperties = {
        width: "max-content",
        position: "absolute",
        top: "20px",
        padding: "0 10px",
        opacity: 0.8,
        transition: "all 0.5s"
    }
    const pStyleFocus: React.CSSProperties = {
        width: "max-content",
        position: "absolute",
        padding: "0 10px",
        transition: "all 0.5s",
        top: 0,
        opacity: 0.25,
        fontSize: "0.8rem"
    }
    const inputStyle: React.CSSProperties = {
        width: "100%",
        height: "100%",
        border: 0,
        background: "inherit",
        color: "inherit",
        padding: "20px 10px 0",
        fontSize: "1rem",
        textOverflow: "ellipsis",
        boxSizing: "border-box",

    }
    const inputStyleFocus: React.CSSProperties = {
        opacity: 1
    }

    const warnStyle: React.CSSProperties = {
        color: "red",
        margin: "0 5px",
        fontSize: "0.75rem",
        textOverflow: "ellipsis",
    }

    return (
        <div className={`${focus || value ? currentTheme ? "background_light" : "background_dark" : null} `} style={focus || value ? warn?.length ? { ...boxStyleFocus, ...boxStyleFocusWarn } : { ...boxStyleFocus } : boxStyle}>
            <p style={placeholder || focus || value ? pStyleFocus : pStyle} onClick={() => inputRef.current.focus()}>{name}<span style={warnStyle}>{warn}</span></p>
            <input ref={inputRef}
                className={`inputFocusOutlineNone `}
                style={focus ? { ...inputStyle, ...inputStyleFocus } : inputStyle}
                disabled={disabled ? disabled : false}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => { setFocus(true); onfocus && onfocus() }}
                onBlur={() => setFocus(false)}
                type={type}
                placeholder={placeholder}
            ></input>
        </div >
    )
}

export default Input