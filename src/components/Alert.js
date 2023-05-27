import React, { useState } from "react";
import Button from "./Button";
import { createRoot } from "react-dom/client";

function Alert(props) {
    const [isOpen, setIsOpen] = useState(props.isOpen);
    return (
        <div className={`realtive z-10 ${!isOpen && "hidden"}`} role="dialog" aria-modal="true">
            <div className="fixed inset-0 transition-opacity bg-slate-900 bg-opacity-80"></div>
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex items-center justify-center min-h-full text-center ">
                    <div className="relative p-4 overflow-hidden text-left transition-all transform rounded-md shadow-xl bg-slate-100">
                        <div className="w-full p-5 text-center">
                            <p className="text-2xl font-bold text-black">
                                {props.title ? props.title : "Judul"}
                            </p>
                            <p className="text-lg text-black">
                                {props.message ? props.message : "Message here"}
                            </p>

                            <div className="mt-5 space-x-3">
                                <button
                                    className="px-3 py-2 text-sm bg-slate-900 hover:bg-slate-900/80"
                                    onClick={() => {
                                        props.onNegativeClick;
                                        setIsOpen(false);
                                    }}>
                                    {props.negativeBtnText || "Oke!"}
                                </button>
                                <Button
                                    className={`${!props.onPositiveClick && "hidden"}`}
                                    onClick={() => {
                                        props.onPositiveClick && props.onPositiveClick();
                                        setIsOpen(false);
                                    }}
                                    text={props.positiveBtnText || "Ya"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function showAlert(props) {
    const alert = document.createElement("div");
    alert.id = "alert";
    document.body.appendChild(alert);
    const root = createRoot(alert);
    root.render(
        <Alert
            isOpen={true}
            title={props.title}
            message={props.message}
            positiveBtnText={props.positiveBtnText}
            onPositiveClick={props.onPositiveClick}
            negativeBtnText={props.negativeBtnText}
            onNegativeClick={props.onNegativeClick}
        />
    );
}
export default showAlert;
