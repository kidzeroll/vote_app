"use client";

import { useState } from "react";
import Form from "@/components/Form";
import Image from "next/image";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import id from "date-fns/locale/id";
import "react-datepicker/dist/react-datepicker.css";
import CandidateForm from "@/components/CandidateForm";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Button from "@/components/Button";
import { useSession } from "next-auth/react";
import RestrictedPage from "@/components/page/RestrictedPage";
import Menu from "@/components/Menu";
import showAlert from "@/components/Alert";
import { useRouter } from "next/navigation";

registerLocale("id", id);

function CreateVote() {
    const [startDateTime, setStartDateTime] = useState(new Date());
    const [endDateTime, setEndDateTime] = useState(new Date());
    const [candidates, setCandidates] = useState([]);
    const [judul, setJudul] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const submitCandidate = (candidate) => {
        setCandidates(candidates.map((i) => (i.key === candidate.key ? candidate : i)));
    };

    const addCandidateForm = () => {
        const newCandidate = {
            name: "",
            key: candidates.length + 1,
            title: "",
        };

        setCandidates([...candidates, newCandidate]);
    };

    const removeCandidateFrom = (key) => {
        const newCandidates = candidates.filter((candidate) => candidate.key !== key);

        newCandidates.forEach((candidate, index) => {
            candidate.key = index + 1;
        });

        setCandidates(newCandidates);
    };

    const handleCreateVote = (e) => {
        e.preventDefault();

        // validasi
        if (judul === "") {
            showAlert({ title: "Hmmm", message: "Judul tidak boleh kosong" });
            return;
        }
        if (candidates.length < 2) {
            showAlert({ title: "Hmmm", message: "Minimal ada 2 kandidate untuk voting" });
            return;
        }
        if (startDateTime > endDateTime) {
            showAlert({
                title: "Hmmm",
                message: "Tanggal mulai tidak boleh lebih besar dari Tanggal selesai",
            });
            return;
        }
        if (candidates.some((i) => i.name === "")) {
            showAlert({ title: "Hmmm", message: "Nama kandidat tidak boleh kosong" });
            return;
        }

        setLoading(true);
        fetch("/api/vote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: judul,
                startDateTime,
                endDateTime,
                candidates,
                publisher: session?.user?.email,
            }),
        })
            .then((data) => {
                showAlert({ title: "Yeay!", message: "Voting berhasil dibuat!" });
                router.push("/");
            })
            .catch(() => {
                showAlert({ title: "Hmmh!", message: "Voting gagal dibuat!" });
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
            <div className="py-10">
                <div className="flex flex-col items-center">
                    <Image
                        src="/assets/developer-team.svg"
                        alt="Create Vote Image"
                        width={400}
                        height={400}
                    />
                    <h1 className="text-4xl font-bold">Buat Vote Baru</h1>
                    <h2 className="mt-3 text-slate-500">
                        Silahkan masukkan data yang dibutuhkan sebelum membuat vote online
                    </h2>
                </div>

                <form className="flex flex-col">
                    <div className="space-y-5">
                        <h3 className="mt-10 text-xl font-medium underline decoration-wavy decoration-rose-500">
                            Detail Voting
                        </h3>
                        <div className="flex flex-col">
                            <label className="mt-5 text-sm">Judul</label>
                            <Form
                                onChange={(e) => setJudul(e)}
                                value={judul}
                                placeholder={"Contoh : Voting Bupati"}
                                className="w-full mt-1 sm:w-1/2"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm">Kapan dimulai?</label>
                            <div className="flex flex-col md:flex-row">
                                <ReactDatePicker
                                    locale={"id"}
                                    showTimeSelect
                                    selected={startDateTime}
                                    onChange={(date) => date && setStartDateTime(date)}
                                    dateFormat={"Pp"}
                                    minDate={new Date()}
                                    className={"w-full sm:w-auto bg-slate-800 py-2 px-3 mt-1"}
                                />
                            </div>

                            <label className="mt-3 text-sm">Sampai?</label>
                            <div>
                                <ReactDatePicker
                                    locale={"id"}
                                    showTimeSelect
                                    selected={endDateTime}
                                    onChange={(date) => date && setEndDateTime(date)}
                                    dateFormat={"Pp"}
                                    minDate={startDateTime}
                                    className={"w-full sm:w-auto bg-slate-800 py-2 px-3 mt-1"}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="mt-10 text-xl font-medium">Kandidat</h3>
                        <div className="grid grid-cols-1 gap-4 mt-5 sm:grid-cols-4">
                            {candidates.map((candidate, index) => {
                                return (
                                    <CandidateForm
                                        key={index}
                                        candidate={candidate}
                                        submitCandidate={submitCandidate}
                                        removeCandidateFrom={removeCandidateFrom}
                                    />
                                );
                            })}
                            <div
                                className="flex flex-col items-center justify-center w-20 h-20 rounded-full cursor-pointer aspect-square bg-rose-500 hover:bg-slate-800"
                                onClick={addCandidateForm}>
                                <PlusCircleIcon className="" />
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <Button text={loading ? "Loading..." : "Buat Voting 👍"} onClick={handleCreateVote} />
                    </div>
                </form>
            </div>
        </>
    );
}

export default CreateVote;
