import React, { useRef, useState } from 'react'
import Image from 'next/image';
import LoopIcon from '@mui/icons-material/Loop';
type Props = {
    icon: React.ReactNode | string;
    src: any,
    size?: number,
    func?: () => void,
    loading?: boolean,
    imgstyle?: React.CSSProperties
    iconStyle?: React.CSSProperties
}

const UploadPicturePreview = ({ size, src, icon, func, loading, imgstyle, iconStyle }: Props) => {

    return (
        <div style={{ height: "100%", position: "relative" }}>
            <div style={{ height: "100%", position: "relative" }}>
                <Image src={src} alt='pic' fill style={{ objectFit: "cover" }} />
            </div>
            <div onClick={() => func && func()}
                style={iconStyle || { width: size + "px", height: size + "px", zIndex: 1, color: "black", background: "white", position: "absolute", bottom: "5px", right: "5px", borderRadius: "5px" }}>
                {loading ? <LoopIcon /> : icon}
            </div>
        </div>
    )
}

export default UploadPicturePreview