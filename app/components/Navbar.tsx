"use client"
import React from 'react'
import Link from "next/link"
import { signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const {data: session}:any = useSession();
  return (
    <div>
        <ul>
            <Link href="/"><li>Home</li></Link>
            <Link href="/dashboard"><li>dashboard</li></Link>
            {!session ? (
              <>
            <Link href="/register"><li>Register</li></Link>
            <Link href="/login"><li>Login</li></Link> 
            </> ): (
              <>
              {session.user?.email}
              <li>
                <button onClick={() => signOut()}>Logout</button>
              </li>
            </>)}
             </ul>
      
    </div>
  )
}

export default Navbar
