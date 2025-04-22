import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign in | QuizApp",
};

export default function SignInLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    return (
        <section>
            {children}
        </section>
    )
}