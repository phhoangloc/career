import React, { useRef } from 'react'
type Props = {
    icon: React.ReactNode | string;
    size?: number
    func?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const UploadButton = ({ icon, size, func }: Props) => {
    const IconRef = useRef<HTMLInputElement | null>(null)
    return (
        <div className={`upload_button`} style={{ borderRadius: "5px", background: "#0073e6", color: "white", cursor: "pointer" }}>
            <input ref={IconRef} type="file" style={{ display: "none" }} onChange={(e) => func && func(e)} multiple={true} />
            <div onClick={() => IconRef.current && IconRef.current.click()} style={{ padding: "5px", width: size + "px", height: size + "px" }}>{icon}</div>
        </div>
    )
}

export default UploadButton