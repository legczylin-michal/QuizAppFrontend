import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { isAuth } from "./lib/dal";
import Header from "./ui/headers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Welcome | QuizApp",
};


export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
	let isLogged = await isAuth();

	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}>
				<Header loggedIn={isLogged}></Header>

				<main>{children}</main>

				<footer></footer>
			</body>
		</html>
	);
}