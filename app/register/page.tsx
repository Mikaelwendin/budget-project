"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Register = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const email = e.target[0].value;
        const password = e.target[1].value;

        if (!validateEmail(email)) {
            setIsError(true);
            setMessage("Please enter a valid email.");
            setTimeout(() => {
                setMessage(null);
                setIsError(false);
            }, 3000);
            return;
        }

        if (password.length < 6) {
            setIsError(true);
            setMessage("Password must be at least 6 characters.");
            setTimeout(() => {
                setMessage(null);
                setIsError(false);
            }, 3000);
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (res.status === 400) {
                setIsError(true);
                setMessage("Email already registered");
                setTimeout(() => {
                    setMessage(null);
                    setIsError(false);
                }, 3000);
            } else if (res.status === 200) {
                setIsError(false);
                setMessage("Registration successful! Redirecting...");
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);
            }
        } catch (error) {
            setIsError(true);
            setMessage("An error occurred. Please try again.");
            setTimeout(() => {
                setMessage(null);
                setIsError(false);
            }, 3000);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='email' required />
                <input type='password' placeholder='password' required />
                <button type='submit'>Go</button>
            </form>
            {message && (
                <div style={{ color: isError ? 'red' : 'green' }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default Register;


