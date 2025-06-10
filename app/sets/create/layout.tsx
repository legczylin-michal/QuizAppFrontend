import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create set | QuizApp",
};

export default function CreateSetLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <section>{children}</section>
    );
}