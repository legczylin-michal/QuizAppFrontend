import { use } from "react"

export default function SetsPage({ params, }: { params: Promise<{ setId: string }> }) {
    const { setId } = use(params);

    return (
        <div></div>
    )
}