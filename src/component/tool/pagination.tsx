import React from 'react'


type Props = {

    page: number,
    next: () => void,
    onClick?: (e: number) => void,
    prev: () => void,
    end?: boolean,
    end2?: boolean,

}

const Pagination = ({ page, next, prev, end, end2, onClick }: Props) => {
    const boxStyle: React.CSSProperties = {
        minWidth: "30px",
        height: "30px",
        lineHeight: "30px",
        cursor: "pointer",
        textAlign: "center",
        margin: "0px 15px"
    }
    return (
        <div style={{ display: "flex", width: "max-content", margin: "50px auto 0" }}>
            {page === 0 ?
                null :
                <div style={boxStyle} onClick={() => prev()}>
                    前に
                </div>}
            {page >= 2 ?
                <div style={boxStyle} onClick={() => onClick && onClick(page - 2)}>
                    {page - 1}
                </div> :
                null
            }
            {page >= 1 ?
                <div style={boxStyle} onClick={() => onClick && onClick(page - 1)}>
                    {page}
                </div> :
                null
            }
            {
                <div style={{ ...boxStyle, fontWeight: "bold", background: "white", borderRadius: "50%" }}>
                    {page + 1}
                </div>
            }
            {end ? null :
                <div style={boxStyle} onClick={() => onClick && onClick(page + 1)}>
                    {page + 2}
                </div>}
            {end2 ?
                <div style={boxStyle} onClick={() => onClick && onClick(page + 2)}>
                    {page + 3}
                </div> : null}
            {end ? null :
                <div style={boxStyle} onClick={() => next()}>
                    つづき
                </div>}
        </div>
    )
}

export default Pagination