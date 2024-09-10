"use client";
import React from 'react';
import Link from "next/link";
import { signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const { data: session }: any = useSession();
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-between items-center text-white">
        <div className="flex space-x-4">
          <Link href="/">
            <li className="hover:text-gray-300 cursor-pointer">Home</li>
          </Link>
          <Link href="/dashboard">
            <li className="hover:text-gray-300 cursor-pointer">Dashboard</li>
          </Link>
          {!session ? (
            <>
              <Link href="/register">
                <li className="hover:text-gray-300 cursor-pointer">Register</li>
              </Link>
              <Link href="/login">
                <li className="hover:text-gray-300 cursor-pointer">Login</li>
              </Link>
            </>
          ) : (
            <>
              <span>{session.user?.email}</span>
              <li>
                <button
                  onClick={() => signOut()}
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;

