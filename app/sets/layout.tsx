import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sets | QuizApp",
};

export default function SetsLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <section>{children}</section>
    );
}