"use client"
import React, { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react';
import { useRouter} from "next/navigation"


const Login = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
  if (session?.status === 'authenticated') {
    router.push("/dashboard");
   }
  }, [session, router]);

  const handleSubmit = async(e: any) => {

    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    console.log(email, password)
    const res = await signIn('credentials', {
      redirect: false,
      email, password});



      if (res?.error) { console.log(res.error)
        if (res?.url) router.push("/dashboard")
       }
  }


    return (
      <div>
      <div><h1>Login</h1>
      <form onSubmit={handleSubmit}>
          <input type='text' placeholder='email' required></input>
          <input type='password' placeholder='password' required></input>
          <button type='submit'>Go</button>
      </form>
      </div>
      </div>
    )
  }

  


export default Login
