import React from 'react'
type Props = {
    onClick: () => void,
    name: string,
    disable?: boolean
}

const Button = ({ onClick, name, disable }: Props) => {
    return (
        <div style={{ width: "100px", height: "40px", margin: "0 5px 5px 0px", background: disable ? "whitesmoke" : "#666633", borderRadius: "5px" }}>
            <button style={{ border: "none", width: "100%", height: "100%", cursor: "pointer", background: "none", color: "white", fontWeight: "bold", margin: "0px" }}
                disabled={disable ? disable : false} onClick={() => onClick()}>
                {name}
            </button>
        </div>
    )
}

export default Button