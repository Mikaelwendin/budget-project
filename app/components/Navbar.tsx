import React from 'react'
import Link from "next/link"

const Navbar = () => {
  return (
    <div>
        <ul>
            <Link href="/"><li>Home</li></Link>
            <Link href="/dashboard"><li>dashboard</li></Link>
            <Link href="/register"><li>Register</li></Link>
            <Link href="/login"><li>Login</li></Link>
        </ul>
      
    </div>
  )
}

export default Navbar
