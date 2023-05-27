import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

function CandidateItem({ name, title, index, percentage, onClick, isSelected }) {
    return (
        <div className="flex flex-row p-5 space-x-3 border rounded-md border-slate-800">
            <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-center bg-slate-800">
                {index}
            </div>

            <div className="w-full">
                <h3 className="text-lg font-bold">{name}</h3>
                <p>{title}</p>
                <div className="flex flex-row items-center space-x-2">
                    <div className="w-full h-1 rounded-full bg-slate-800">
                        <div
                            className="h-1 rounded-full bg-rose-500"
                            style={{ width: `${percentage}%` }}></div>
                    </div>
                    <p className="text-sm font-bold">
                        {Intl.NumberFormat("en", { notation: "compact" }).format(percentage)}%
                    </p>
                </div>
            </div>

            <div
                onClick={onClick}
                className={`flex items-center justify-center w-20 h-20 rounded-md cursor-pointer ${
                    isSelected ? "bg-rose-500 hover:bg-rose-500/80" : "bg-slate-800 hover:bg-slate-800/80"
                }`}>
                <CheckIcon className="w-5 h-5" />
            </div>
        </div>
    );
}

export default CandidateItem;
