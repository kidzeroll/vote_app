import { zeroPad } from "react-countdown";

function CountDownItem({ value, label }) {
    return (
        <div className="flex items-center">
            <div className="flex flex-col text-center">
                <span className="text-5xl font-bold">{zeroPad(value, 2)}</span>
                <span className="text-xl font-light">{label}</span>
            </div>
            {label != "Detik" && <span className="mx-5 text-4xl">:</span>}
        </div>
    );
}

export default CountDownItem;
