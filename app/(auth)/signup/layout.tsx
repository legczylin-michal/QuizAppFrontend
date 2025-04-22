import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Sign Up | QuizApp",
};

export default function SignUpLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    return (
        <section>
            {children}
        </section>
    )
}