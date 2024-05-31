"use client"
import React from 'react'

const Register = () => {


const handleSubmit = async(e: any) => {

    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    console.log(email, password)

    try {
        const res = await fetch("/api/register" , {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({
                email, password
            })
        })
        if (res.status === 400) {
            console.log("email already registred")
        }
        if (res.status === 200) {
            console.log("Success")
        }
        
    } catch (error) {
        console.log("Error!!!")
    }
}


  return (
    <div>
    <div><h1>Register</h1>
    <form onSubmit={handleSubmit}>
        <input type='text' placeholder='email' required></input>
        <input type='password' placeholder='password' required></input>
        <button type='submit'>Go</button>
    </form>
    </div>
    </div>
  )
}

export default Register
