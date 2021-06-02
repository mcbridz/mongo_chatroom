import React, { useEffect } from 'react'
import useCookie from './useCookie'

function Logout(props) {
    const [cookie, setCookie] = useCookie('chatroomCookie', '')

    useEffect(() => {
        if (!props.token) {
            setCookie('')
        }
    }, [props.token])
    
    return (
        <div>        
        </div>
    )
}

export default Logout
