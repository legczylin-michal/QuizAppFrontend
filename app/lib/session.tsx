'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

interface AuthContextType {
    user: User | null
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)
        })
        
        return unsubscribe
    }, [])
    
    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

// Helper function to get Firebase ID token for API calls
export async function getIdToken(): Promise<string | null> {
    const user = auth.currentUser
    if (!user) return null
    
    try {
        return await user.getIdToken()
    } catch (error) {
        console.error('Failed to get ID token:', error)
        return null
    }
}

// Simple auth state check
export function isAuthenticated(): boolean {
    return !!auth.currentUser
}
