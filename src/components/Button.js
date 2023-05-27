import React from "react";

function Button(props) {
    return (
        <button
            className={`px-3 py-2 text-white bg-rose-500 hover:bg-rose-500/80
            ${
                props.type === "secondary" &&
                "border-2 border-rose-500 bg-slate-900 hover:bg-rose-500 hover:text-white text-rose-400"
            } ${props.className}
            `}
            onClick={props.onClick}>
            {props.text}
        </button>
    );
}

export default Button;
