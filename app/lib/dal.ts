import 'server-only';

import { cache } from "react";

import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';

export const isAuth = cache(async () => {
    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);

    if (!session?.userId)
        return false;

    return true;
})