"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

const ErrorSection = ()=>{
    const router = useRouter()
    return(
        <div className="h-[90vh] bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Unauthorized</h2>
            <p className="text-gray-600">Please sign-up to continue.</p>
            <Button variant="teal" className="mt-2" onClick={()=>router.push("/")}>
                Go to home page
            </Button>
            </div>
        </div>
    )
}

export default ErrorSection