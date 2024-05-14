
import Signup from '@/component/auth/signup'
import React from 'react'


const page = () => {

    return (
        <div style={{ height: "calc(100vh)", padding: "5px 0px" }}>
            <Signup archive='admin' />
        </div>
    )
}

export default page