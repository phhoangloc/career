import React from 'react'


type Props = {
    page: number,
    next: () => void,
    prev: () => void,
    end?: boolean
}

const Pagination = ({ page, next, prev, end }: Props) => {

    const boxStyle: React.CSSProperties = {
        width: "60px",
        height: "30px",
        lineHeight: "40px",
        cursor: "pointer",
        textAlign: "center"
    }
    return (
        <div style={{ display: "flex", width: "max-content", margin: "auto auto 0" }}>
            {page === 0 ?
                <div style={boxStyle} /> :
                <div style={boxStyle} onClick={() => prev()}>
                    前に
                </div>}
            <div style={boxStyle}>
                {page + 1}
            </div>
            {end ? <div style={boxStyle} /> :
                <div style={boxStyle} onClick={() => next()}>
                    つづき
                </div>}
        </div>
    )
}

export default Pagination