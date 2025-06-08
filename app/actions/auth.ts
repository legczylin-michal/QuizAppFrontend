'use server';

import { redirect } from 'next/navigation'

import { SignupFormSchema, SigninFormSchema, FormState } from '@/app/lib/definitions';
import { createSession, deleteSession } from '../lib/session';

export async function signin(state: FormState, formData: FormData) {
    const validatedFields = SigninFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { email, password } = validatedFields.data;

    const lookForTokenIdData: Record<string, string> = {};
    lookForTokenIdData['email'] = email;
    lookForTokenIdData['password'] = password;
    lookForTokenIdData['returnSecureToken'] = 'true';

    const lookForTokenIdResponse = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB4aWqGdfJta2x0uvgHyGBrC6P2ioVF09M', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(lookForTokenIdData),
    });

    const lookForTokenIdResult = await lookForTokenIdResponse.json();

    if (!lookForTokenIdResponse.ok) {
        return {
            message: 'An error occurred while looking for account with such credentials.',
        }
    }

    const signinData: Record<string, string> = {};
    signinData['idToken'] = lookForTokenIdResult.idToken;

    const signinResponse = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(signinData),
    });

    const signinResult = await signinResponse.json();

    if (!signinResponse.ok) {
        return {
            message: 'An error occurred while validating id token.',
        }
    }

    createSession(signinResult.uid);

    redirect('/');
}

export async function signup(state: FormState, formData: FormData) {
    const validatedFields = SignupFormSchema.safeParse({
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { username, email, password } = validatedFields.data;

    const plainData: Record<string, string> = {};
    plainData['username'] = username;
    plainData['email'] = email;
    plainData['password'] = password;

    const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(plainData),
    });

    const data = await response.json();

    if (!response.ok) {
        return {
            message: 'An error occurred while creating your account.',
        }
    }

    console.log(data);

    createSession(data.uid);

    redirect('/');
}

export async function logout() {
    await deleteSession();
    redirect('/signin');
}