'use client'

import { useState } from 'react';
import {
    Dialog,
    DialogPanel
} from '@headlessui/react';
import {
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '@/app/lib/session';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, loading } = useAuth()
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut(auth)
            router.push('/signin')
        } catch (error) {
            console.error('Sign out error:', error)
        }
    }

    // Show nothing while loading to prevent flash
    if (loading) {
        return (
            <header className="relative inset-x-0 top-0 z-50">
                <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                    <div className="flex"></div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        <Link href={'/'} className="text-sm/6 font-semibold text-gray-900">
                            Home
                        </Link>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12 lg:flex-1 lg:justify-end">
                        <span className="text-sm/6 font-semibold text-gray-900">Loading...</span>
                    </div>
                </nav>
            </header>
        )
    }

    return (
        <header className="relative inset-x-0 top-0 z-50">
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                <div className="flex"></div>

                <div className="flex lg:hidden">
                    <button type="button" onClick={() => setMobileMenuOpen(true)} className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>

                <div className="hidden lg:flex lg:gap-x-12">
                    <Link href={'/'} className="text-sm/6 font-semibold text-gray-900">
                        Home
                    </Link>

                    <Link href={'/sets'} className="text-sm/6 font-semibold text-gray-900">
                        Sets
                    </Link>

                    {/* <a href="#" className="text-sm/6 font-semibold text-gray-900">
                        Friends
                    </a> */}
                </div>

                {user
                    ?
                    <div className="hidden lg:flex lg:gap-x-12 lg:flex-1 lg:justify-end">
                        <span className="text-sm/6 font-semibold text-gray-900">
                            {user.email}
                        </span>

                        <button
                            onClick={handleSignOut}
                            className="text-sm/6 font-semibold text-gray-900 hover:text-gray-600"
                        >
                            Sign out
                        </button>
                    </div>
                    :
                    <div className="hidden lg:flex lg:gap-x-12 lg:flex-1 lg:justify-end">
                        <Link href={'/signup'} className="text-sm/6 font-semibold text-gray-900">
                            Sign up
                        </Link>

                        <Link href={'/signin'} className="text-sm/6 font-semibold text-gray-900">
                            Sign in
                        </Link>
                    </div>
                }
            </nav>

            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10" />

                <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <div className="-m-1.5 p-1.5"></div>

                        <button type="button" onClick={() => setMobileMenuOpen(false)} className="-m-2.5 rounded-md p-2.5 text-gray-700">
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>

                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <Link href={'/'} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                    Home
                                </Link>

                                <Link href={'/sets'} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                    Sets
                                </Link>

                                <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                    Friends
                                </a>
                            </div>

                            {user
                                ?
                                <div className="py-6">
                                    <span className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900">
                                        {user.email}
                                    </span>

                                    <button
                                        onClick={handleSignOut}
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 w-full text-left"
                                    >
                                        Sign out
                                    </button>
                                </div>
                                :
                                <div className="py-6">
                                    <Link href={'/signup'} className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                        Sign Up
                                    </Link>

                                    <Link href={'/signin'} className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                        Sign In
                                    </Link>
                                </div>
                            }
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
