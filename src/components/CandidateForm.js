import { useEffect, useState } from "react";
import Form from "./Form";
import { XCircleIcon } from "@heroicons/react/24/solid";

function CandidateForm(props) {
    const [candidate, setCandidate] = useState({
        key: 0,
        name: "",
        title: "",
    });

    useEffect(() => {
        setCandidate(props.candidate);
    }, [props.candidate]);

    useEffect(() => {
        props.submitCandidate(candidate);
    }, [candidate]);

    return (
        <div className="flex flex-col p-5 border border-slate-800">
            <div className="self-end">
                <XCircleIcon
                    className="w-6 h-6 rounded-full cursor-pointer hover:bg-rose-500"
                    onClick={() => props.removeCandidateFrom(candidate.key)}
                />
            </div>
            <h1 className="flex items-center self-center justify-center w-1/2 text-4xl text-center rounded-full bg-slate-800 aspect-square">
                {props.candidate.key}
            </h1>
            <label className="mt-3 mb-1 text-sm">Nama Kandidat</label>
            <Form
                placeholder={"Masukkan nama kandidat."}
                value={candidate.name}
                onChange={(e) => setCandidate({ ...candidate, name: e })}
            />
        </div>
    );
}

export default CandidateForm;
