'use client'

import { auth } from './firebase'
import { User } from 'firebase/auth'

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
    return !!auth.currentUser
}

// Helper function to get current user
export function getCurrentUser(): User | null {
    return auth.currentUser
}

// Helper function to make authenticated API requests
export async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    const user = auth.currentUser
    if (!user) {
        throw new Error('Not authenticated')
    }
    
    const idToken = await user.getIdToken()
    
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
        }
    })
}

// API functions for your Flask backend
export async function registerUser(email: string, password: string) {
    return fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
}

export async function loginUser(idToken: string) {
    return fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
    })
}

// // Set management functions
// export async function createSet(title: string, description: string) {
//     return makeAuthenticatedRequest('http://localhost:8080/sets', {
//         method: 'POST',
//         body: JSON.stringify({ title, description })
//     })
// }

// export async function getSets() {
//     return makeAuthenticatedRequest('http://localhost:8080/sets')
// }

// export async function updateSet(setId: string, title: string, description: string) {
//     return makeAuthenticatedRequest(`http://localhost:8080/sets/${setId}`, {
//         method: 'PUT',
//         body: JSON.stringify({ title, description })
//     })
// }

// export async function deleteSet(setId: string) {
//     return makeAuthenticatedRequest(`http://localhost:8080/sets/${setId}`, {
//         method: 'DELETE'
//     })
// }

// // Item management functions
// export async function createItem(setId: string, term: string, definition: string) {
//     return makeAuthenticatedRequest(`http://localhost:8080/sets/${setId}/items`, {
//         method: 'POST',
//         body: JSON.stringify({ term, definition })
//     })
// }

// export async function getItems(setId: string) {
//     return makeAuthenticatedRequest(`http://localhost:8080/sets/${setId}/items`)
// }

// export async function updateItem(setId: string, itemId: string, term: string, definition: string) {
//     return makeAuthenticatedRequest(`http://localhost:8080/sets/${setId}/items/${itemId}`, {
//         method: 'PUT',
//         body: JSON.stringify({ term, definition })
//     })
// }

// export async function deleteItem(setId: string, itemId: string) {
//     return makeAuthenticatedRequest(`http://localhost:8080/sets/${setId}/items/${itemId}`, {
//         method: 'DELETE'
//     })
// }
