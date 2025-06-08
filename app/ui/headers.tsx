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

export default function Header({ loggedIn, }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="relative inset-x-0 top-0 z-50">
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                <div className="flex"></div>

                <div className="flex lg:hidden">
                    <button type="button" onClick={() => setMobileMenuOpen(true)} className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"                    >
                        <span className="sr-only">Open main menu</span>

                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>

                <div className="hidden lg:flex lg:gap-x-12">
                    <Link href={'/'} className="text-sm/6 font-semibold text-gray-900">
                        Home
                    </Link>

                    <a href="#" className="text-sm/6 font-semibold text-gray-900">
                        Sets
                    </a>

                    <a href="#" className="text-sm/6 font-semibold text-gray-900">
                        Friends
                    </a>
                </div>

                {loggedIn
                    ?
                    <div className="hidden lg:flex lg:gap-x-12 lg:flex-1 lg:justify-end">
                        <Link href={'/signup'} className="text-sm/6 font-semibold text-gray-900">
                            My profile
                        </Link>

                        <Link href={'/signin'} className="text-sm/6 font-semibold text-gray-900">
                            Sign out
                        </Link>
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

                        <button type="button" onClick={() => setMobileMenuOpen(false)} className="-m-2.5 rounded-md p-2.5 text-gray-700"                        >
                            <span className="sr-only">Close menu</span>

                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>

                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"                                >
                                    Home
                                </a>

                                <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"                                >
                                    Sets
                                </a>

                                <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"                                >
                                    Friends
                                </a>
                            </div>

                            {loggedIn
                                ?
                                <div className="py-6">
                                    <Link href={'/signup'} className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                        My profile
                                    </Link>

                                    <Link href={'/signin'} className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                        Sign out
                                    </Link>
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
