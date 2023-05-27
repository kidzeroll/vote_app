"use client";

import React, { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

function Menu() {
    const { data: session, status } = useSession();

    const [showDropdown, setShowDropdown] = useState(false);

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        signOut();
        setShowDropdown(false);
    };

    return (
        <div className="flex items-center justify-between py-3">
            <Link href="/" className="text-2xl font-bold text-rose-500">
                Kidzeroll
            </Link>
            {session ? (
                <div className="relative px-3 py-1 rounded-full cursor-pointer hover:bg-slate-800">
                    <button
                        className="flex items-center justify-center space-x-3"
                        onClick={handleDropdownToggle}>
                        {session?.user?.image && (
                            <Image
                                src={session?.user?.image}
                                alt="Avatar"
                                className="rounded-full"
                                width={30}
                                height={30}
                            />
                        )}
                        <span>{session?.user?.name}</span>
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 rounded-lg shadow-md">
                            <Button
                                text="Logout"
                                className="block w-full px-4 py-2 text-left"
                                onClick={handleLogout}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <Button text="Login" className="mt-4 rounded-lg sm:mt-0" onClick={signIn} />
            )}
        </div>
    );
}

export default Menu;
