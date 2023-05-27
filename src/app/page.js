"use client";

import Button from "@/components/Button";
import Image from "next/image";
import { LinkIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Menu from "@/components/Menu";
import { useSession } from "next-auth/react";
import useVotes from "@/lib/useVotes";
import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import showAlert from "@/components/Alert";
import Link from "next/link";

export default function Home() {
    const router = useRouter();
    const { data: session } = useSession();
    const { data: dataVoteApi, error, isLoading } = useVotes();

    const [votes, setVotes] = useState(null);

    const handleDelete = (code) => {
        showAlert({
            title: "Anda Yakin?",
            message: "Ingin menghapus data ini",
            onPositiveClick() {
                fetch("/api/vote/" + code, { method: "DELETE" })
                    .then(() => {
                        showAlert({ title: "Berhasil", message: "Data berhasil dihapus" });
                        setVotes(votes?.filter((vote) => vote.code !== code));
                    })
                    .catch(() => {
                        showAlert({ title: "Gagal", message: "Data gagal dihapus" });
                    });
            },
        });
    };

    useEffect(() => {
        if (dataVoteApi) {
            setVotes(dataVoteApi.data);
        }
    }, [dataVoteApi]);

    return (
        <>
            <Menu />
            <div className="py-10">
                {/* hero */}
                <div className="flex flex-col items-center space-y-3">
                    <h1 className="text-5xl font-bold text-center">Ayo Mulai Voting</h1>
                    <h2 className="px-3 py-1 text-lg rounded-full bg-slate-800">
                        Simple <span className="text-rose-500">&</span> Minimalis Web Voting
                    </h2>
                    <Image alt="hero" src="/assets/software-engineer.svg" width={400} height={400} />
                    <div className="space-x-4">
                        <Button
                            text="Buat Vote Baru"
                            className="font-bold"
                            onClick={() => router.push("/vote/create")}
                        />
                        <Button
                            text="Ikutan Vote"
                            type="secondary"
                            onClick={() => router.push("/participant")}
                            className="font-bold"
                        />
                    </div>
                </div>

                {/* table */}
                {session && (
                    <div className="mt-10">
                        <p className="py-5 text-lg font-bold">Vote yang saya buat</p>
                        <div className="overflow-x-auto">
                            <table className="w-full border table-auto border-rose-500">
                                <thead>
                                    <tr className="font-bold bg-rose-500">
                                        <th className="p-5 text-left">No</th>
                                        <th className="p-5 text-left">Judul</th>
                                        <th className="p-5 text-left">Kandidat</th>
                                        <th className="p-5 text-left">Kode</th>
                                        <th className="p-5 text-left">Mulai</th>
                                        <th className="p-5 text-left">Selesai</th>
                                        <th className="p-5 text-left">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={7} className="py-2 text-center">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : votes && votes.length > 0 ? (
                                        votes.map((vote, index) => (
                                            <tr key={index}>
                                                <td className="p-5 text-left">{index + 1}</td>
                                                <td className="p-5 text-left">
                                                    <Link
                                                        href={`/vote/${vote.code}`}
                                                        className="underline hover:text-blue-500">
                                                        {vote.title}
                                                    </Link>
                                                </td>
                                                <td className="p-5 text-left">
                                                    {vote.candidates.map((c, idx) => (
                                                        <span key={idx}>
                                                            {c.name +
                                                                (idx < vote.candidates.length - 1
                                                                    ? " vs "
                                                                    : "")}
                                                        </span>
                                                    ))}
                                                </td>
                                                <td className="p-5 font-bold text-left">{vote.code}</td>
                                                <td className="p-5 text-left">
                                                    {moment(vote.startDateTime).format("DD MMM YYYY, h:mm a")}
                                                </td>
                                                <td className="p-5 text-left">
                                                    {moment(vote.endDateTime).format("DD MMM YYYY, h:mm a")}
                                                </td>
                                                <td className="p-5 text-left">
                                                    <div className="flex space-x-4">
                                                        <Link href={`/participant/${vote.code}`}>
                                                            <LinkIcon className="w-8 h-8 p-2 hover:bg-rose-500" />
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                handleDelete(vote.code);
                                                            }}>
                                                            <TrashIcon className="w-8 h-8 p-2 hover:bg-rose-500" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="py-2 text-xl text-center">
                                                Belum ada votes yang dibuat.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
