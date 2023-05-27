import Image from "next/image";
import React from "react";
import Button from "../Button";
import { signIn } from "next-auth/react";

function RestrictedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Image src={"/assets/upload-image-ui.svg"} alt="Restricted Picture" height={400} width={400} />
            <h1 className="text-4xl font-bold">Login dulu yah!</h1>
            <h2 className="text-lg text-center">
                Untuk mengakses halaman ini kamu wajib login terlebih dahulu
            </h2>
            <Button text="Login" onClick={signIn} className={"mt-10"} />
        </div>
    );
}

export default RestrictedPage;
