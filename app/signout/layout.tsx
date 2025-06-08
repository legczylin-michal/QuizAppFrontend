import { redirect } from "next/navigation";
import { deleteSession } from "../lib/session";

export default function SignoutLayout() {
    deleteSession();

    redirect('/signin');
}