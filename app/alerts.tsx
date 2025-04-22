import Link from "next/link";

export function ErrorAlert({ msg, }) {
    return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{msg}</p>
        </div>
    )
}

export function SuccessAlert({ msg, }) {
    return (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
            <p className="font-bold">Success</p>
            <p>User <span className="font-bold">{msg}</span> successfully signed up!</p>
            <p><Link href={'/signin'} className="font-medium text-green-600 dark:text-green-500 hover:underline">Sign in</Link> to continue.</p>
        </div>
    )
}