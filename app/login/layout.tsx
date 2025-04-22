import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Log In",
};

export default function LogInLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    return (
        <section>
            {children}
        </section>
    )
}