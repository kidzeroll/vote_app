import React from "react";
import CountDownItem from "./CountDownItem";

function CountDownRenderer(props) {
    const { days, hours, minutes, seconds } = props;
    return (
        <div className="flex flex-row justify-center mx-auto">
            {days > 0 && <CountDownItem label="Hari" value={days} />}
            {hours > 0 && <CountDownItem label="Jam" value={hours} />}
            {minutes > 0 && <CountDownItem label="Menit" value={minutes} />}
            {seconds > 0 && <CountDownItem label="Detik" value={seconds} />}
        </div>
    );
}

export default CountDownRenderer;
