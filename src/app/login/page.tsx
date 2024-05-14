import Login from '@/component/auth/login'
import React from 'react'


const page = () => {
    return (
        <div style={{ height: "calc(100vh)", padding: "5px 0" }}>
            <Login archive='admin' />
        </div>
    )
}

export default page