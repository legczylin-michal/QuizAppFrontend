'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'

export default function SignoutLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    useEffect(() => {
        const handleSignOut = async () => {
            try {
                await signOut(auth)
                router.push('/signin')
            } catch (error) {
                console.error('Error signing out:', error)
                router.push('/signin') // Redirect anyway
            }
        }

        handleSignOut()
    }, [router])

    return (
        <div>
            <p>Signing out...</p>
            {children}
        </div>
    )
}
