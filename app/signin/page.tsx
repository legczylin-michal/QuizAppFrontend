import Link from 'next/link';

export default function SignIn() {
    return (
        <div>
            This is "Sign In" page

            <Link href={`/`}>Back home</Link>
        </div>
    )
}