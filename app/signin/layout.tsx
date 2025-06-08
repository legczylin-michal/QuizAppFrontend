import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign in | QuizApp",
};

export default function SigninLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <section>{children}</section>
    );
}