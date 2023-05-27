"use client";

import React, { useState } from "react";
import Form from "@/components/Form";
import Image from "next/image";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import RestrictedPage from "@/components/page/RestrictedPage";
import { useSession } from "next-auth/react";
import Menu from "@/components/Menu";
import showAlert from "@/components/Alert";

function Participant() {
    const router = useRouter();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (code === "") {
            showAlert({ title: "Hmmh!", message: "Tolong masukkan kode yang benar" });
        }

        setLoading(true);
        await fetch("/api/vote/" + code, { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                if (data.code === 404) {
                    showAlert({ title: "Hmmh!", message: "Kode yang anda masukkan salah" });
                    return;
                }

                router.push(`/participant/${code}`);
                return;
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const { data: session } = useSession();

    if (!session) {
        return <RestrictedPage />;
    }

    return (
        <>
            <Menu />
            <div className="flex flex-col items-center justify-center space-y-5">
                <Image
                    src={"/assets/website-development.svg"}
                    width={400}
                    height={400}
                    alt="Participant Image"
                />

                <h1 className="text-4xl font-bold text-rose-500">Ikutan Voting</h1>
                <h2 className="w-full max-w-md text-center">
                    Untuk ikutan voting, kamu harus memasukkan kode voting yang sudah diberikan oleh
                    panitia/penyelenggara.
                </h2>
                <Form
                    placeholder="Masukkan kode voting"
                    className="w-full max-w-md mt-3"
                    value={code}
                    onChange={setCode}
                />

                <Button
                    text={loading ? "Loading ..." : "Lanjutkan"}
                    onClick={handleSubmit}
                    className="w-full max-w-md"
                />
                <button className="text-sm" onClick={() => router.push("/")}>
                    Kembali
                </button>
            </div>
        </>
    );
}

export default Participant;
