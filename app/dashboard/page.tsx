import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from "next/navigation"

const Dashboard = async () => {
  const session = await getServerSession();
  if (!session) {
    redirect("/")
   }
   return (
    <div className="flex min-h-screen w-full bg-black justify-center items-center">
      <h1 className="text-white">Dashboard</h1>
    </div>
  );
  
}

export default Dashboard
