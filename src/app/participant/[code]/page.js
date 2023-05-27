"use client";

import showAlert from "@/components/Alert";
import Button from "@/components/Button";
import CandidateItem from "@/components/CandidateItem";
import CountDown from "@/components/CountDown";
import Menu from "@/components/Menu";
import RestrictedPage from "@/components/page/RestrictedPage";
import useParticipant from "@/lib/useParticipant";
import useVote from "@/lib/useVote";
import moment from "moment";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export const STATE_NOT_STARTED = "STATE_NOT_STARTED",
    STATE_STARTED = "STATE_STARTED",
    STATE_ENDED = "STATE_ENDED",
    STATE_LOADING = "STATE_LOADING";

function DetailParticipant({ params }) {
    const { code } = params;
    const { data: session } = useSession();
    const { data: dataVoteApi, mutate: mutateVoteApi } = useVote(code);
    const { data: dataParticipantApi, mutate: mutateParticipantApi } = useParticipant(code);

    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const [currentState, setCurrentState] = useState(STATE_LOADING);

    const submitVote = () => {
        if (selectedCandidate) {
            showAlert({
                title: "Apakah kamu yakin?",
                message: "Kamu akan memilih kandidat " + selectedCandidate.name,
                postiveBtnText: "Ya, saya yakin",
                negativeBtnText: "tidak",
                onPositiveClick: async () => {
                    const res = await fetch("/api/participant/" + dataVoteApi?.data?.code, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            candidate: selectedCandidate.name,
                        }),
                    });

                    if (res.status === 200) {
                        mutateVoteApi();
                        mutateParticipantApi();
                        showAlert({ title: "Vote terkirim", message: "Terimakasih telah berpartisipasi 😊" });
                    }
                },
            });
        } else {
            showAlert({
                title: "Vote gagal?",
                message: "Mohon pilih salah satu kandidat",
            });
        }
    };

    useEffect(() => {
        if (dataVoteApi && dataVoteApi.data) {
            const vote = dataVoteApi.data;
            const start = moment(vote?.startDateTime);
            const end = moment(vote?.endDateTime);

            if (currentState === STATE_ENDED) {
                return;
            }

            const interval = setInterval(async () => {
                const now = moment();
                if (now.isBefore(start)) {
                    setCurrentState(STATE_NOT_STARTED);
                } else if (now.isAfter(start) && now.isBefore(end)) {
                    setCurrentState(STATE_STARTED);
                } else if (now.isAfter(end)) {
                    setCurrentState(STATE_ENDED);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [dataVoteApi]);

    useEffect(() => {
        if (dataParticipantApi && dataVoteApi) {
            const candidate = dataVoteApi?.data?.candidates?.find(
                (c) => c.name === dataParticipantApi?.data?.candidate
            );

            if (candidate) {
                setSelectedCandidate(candidate);
            }
        }
    }, [dataParticipantApi, dataVoteApi]);

    if (!session) {
        return <RestrictedPage />;
    }

    return (
        <>
            <Menu />
            <div>
                <h1 className="mt-10 text-4xl text-center">{dataVoteApi?.data?.title}</h1>

                <CountDown
                    start={String(dataVoteApi?.data?.startDateTime)}
                    end={String(dataVoteApi?.data?.endDateTime)}
                    currentState={currentState}
                    className={"mt-10"}
                />

                <div className="w-full mx-auto mt-10 space-y-3 lg:w-2/3">
                    {dataVoteApi?.data?.candidates.map((candidate, index) => {
                        return (
                            <CandidateItem
                                key={index}
                                index={candidate.key}
                                name={candidate.name}
                                title={"Kandidat " + candidate.key}
                                percentage={
                                    candidate.votes
                                        ? (candidate.votes / dataVoteApi?.data?.totalVotes) * 100
                                        : 0
                                }
                                isSelected={selectedCandidate?.name === candidate.name}
                                onClick={() => {
                                    !dataParticipantApi?.data &&
                                        currentState === STATE_STARTED &&
                                        setSelectedCandidate(candidate);
                                }}
                            />
                        );
                    })}
                </div>
                <div className="mt-10 text-center">
                    {session?.user?.email != dataVoteApi?.data?.publisher &&
                        !dataParticipantApi?.data &&
                        currentState === STATE_STARTED && (
                            <Button
                                text="Kirim vote saya 👍"
                                type="secondary"
                                onClick={() => {
                                    submitVote();
                                }}
                            />
                        )}

                    {dataParticipantApi?.data && (
                        <p className="">
                            Kamu sudah memilih, dan tidak diperbolehkan lagi untuk mengganti pilihan 😢
                        </p>
                    )}

                    {session?.user?.email === dataVoteApi?.data?.publisher && (
                        <p className="inline-flex items-center justify-center w-full px-3 py-2 text-center rounded-full bg-slate-800 lg:w-2/3 ">
                            Pembuat vote tidak boleh melakukan voting 👌
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

export default DetailParticipant;
