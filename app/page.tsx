import Link from 'next/link';

export default function Home() {
	return (
		<div>
			<Link href={`/signin`}>Sign In</Link>
			<Link href={`/login`}>Log In</Link>
		</div>
	);
}