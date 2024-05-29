import React from 'react'

type Props = {
    name?: string,
    icon?: React.ReactNode,
    onClick?: () => void,
    bg?: string,
    color?: string
}

const ButtonWeb = ({ name, icon, onClick, bg, color, }: Props) => {
    return (
        <div style={{ width: "100%", height: "40px", borderRadius: "calc(15px + 1rem)", background: bg ? bg : "inherit", color: color ? color : "inherit", display: "flex", margin: "5px", boxShadow: "1px 1px 3px #888", cursor: "pointer" }}
            onClick={() => onClick ? onClick() : null}>
            <p style={{ width: "max-content", fontWeight: "bold", lineHeight: "40px", padding: "0 15px" }}>{name ? name : "Submit"}</p>
            {icon}
        </div>
    )
}

export default ButtonWeb