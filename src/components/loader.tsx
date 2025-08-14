"use client"

const LoaderSection = ()=>{
    return(
        <div className="h-[90vh] bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h2>
            <p className="text-gray-600">Please wait for some time</p>
            </div>
        </div>
    )
}

export default LoaderSection