'use client'

import { auth } from './firebase'
import { User } from 'firebase/auth'
import { Item } from '@/app/lib/definitions'

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
    return fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
}

export async function loginUser(idToken: string) {
    return fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
    })
}

export async function getItems(setId: string) {
  const user = auth.currentUser
  if (!user) throw new Error('Not authenticated')
  const token = await user.getIdToken()
  const response = await fetch(`http://localhost:5000/sets/${setId}/items`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!response.ok) throw new Error('Failed to fetch items')
  return response.json()
}

export async function createItem(setId: string, term: string, definition: string): Promise<Item> {
  const user = auth.currentUser
  if (!user) throw new Error('Not authenticated')
  
  const token = await user.getIdToken()
  const response = await fetch(`http://localhost:5000/sets/${setId}/items`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ term, definition })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create item')
  }

  // Get the created item's ID from response
  const { item_id } = await response.json()
  
  // Fetch the full item details
  const itemResponse = await fetch(`http://localhost:5000/sets/${setId}/items/${item_id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  if (!itemResponse.ok) throw new Error('Failed to fetch created item')
  
  return itemResponse.json()
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
