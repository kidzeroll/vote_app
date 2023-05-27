"use client";

import RestrictedPage from "@/components/page/RestrictedPage";
import { useSession } from "next-auth/react";

function Vote() {
    const { data: session } = useSession();

    if (!session) {
        return <RestrictedPage />;
    }
    return <div>Vote</div>;
}

export default Vote;
