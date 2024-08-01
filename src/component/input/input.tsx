import React, { useRef, useState } from 'react'
import store from '@/redux/store'
type Props = {
    onChange: (e: string) => void,
    name: React.ReactNode,
    value: string,
    type?: string,
    onfocus?: () => void,
    disabled?: boolean
}

const Input = ({ onChange, name, value, type, onfocus, disabled }: Props) => {

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
        borderBottom: "1px solid ",
        borderColor: "inherit",
        overflow: "hidden"
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
    const pStyle: React.CSSProperties = {
        width: "max-content",
        position: "absolute",
        top: "20px",
        padding: "0 10px",
        transition: "all 0.5s"
    }
    const pStyleFocus: React.CSSProperties = {
        width: "max-content",
        position: "absolute",
        padding: "0 10px",
        transition: "all 0.5s",
        top: 0,
        opacity: 0.5,
        fontSize: "0.9rem"
    }
    const inputStyle: React.CSSProperties = {
        width: "100%",
        height: "100%",
        border: 0,
        background: "none",
        color: "inherit",
        padding: "10px 10px 0",
        fontSize: "1rem",
        textOverflow: "ellipsis"
    }

    return (
        <div className={`${focus || value ? currentTheme ? "background_light" : "background_dark" : null}`} style={focus || value ? boxStyleFocus : boxStyle}>
            <p style={focus || value ? pStyleFocus : pStyle}>{name}</p>
            <input className={`inputFocusOutlineNone `}
                style={inputStyle}
                disabled={disabled ? disabled : false}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => { setFocus(true); onfocus && onfocus() }}
                onBlur={() => setFocus(false)}
                type={type}
            ></input>
        </div >
    )
}

export default Input