import React from 'react'

type Props = {
    icon1: React.ReactNode,
    icon2: React.ReactNode,
    value: boolean,
    className?: string,
    style?: React.CSSProperties
}

const IconToggle = ({ icon1, icon2, value, className, style }: Props) => {
    return (
        <div className={className ? className : ""} style={style ? style : {}}>
            {value ? icon1 : icon2}
        </div>
    )
}

export default IconToggle