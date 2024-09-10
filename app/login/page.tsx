"use client"
import React, { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react';
import { useRouter} from "next/navigation"


const Login = () => {
  const session = useSession();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);


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
        setMessage("Invalid credentials");
        if (res?.url) { setTimeout(() => {
          router.push("/dashboard"); 
      }, 2000);
          
       }
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
      {message && (
                <div>
                    {message}
                </div>
            )}
      </div>
      </div>
    )
  }

  


export default Login
