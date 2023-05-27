import React from "react";
import Countdown from "react-countdown";
import CountDownRenderer from "./CountDownRenderer";
import { STATE_ENDED, STATE_LOADING, STATE_NOT_STARTED, STATE_STARTED } from "@/app/participant/[code]/page";

function CountDown({ className, start, end, currentState }) {
    const countDown = ({ days, hours, minutes, seconds }) => {
        return <CountDownRenderer days={days} hours={hours} minutes={minutes} seconds={seconds} />;
    };
    return (
        <div className={`text-center ${className}`}>
            {currentState === STATE_LOADING && <p className="animate-pulse">Tunggu Sebentar...</p>}
            {currentState === STATE_NOT_STARTED && (
                <div>
                    <p>Voting akan dimulai pada:</p>
                    <Countdown date={start} renderer={countDown} />
                </div>
            )}
            {currentState === STATE_STARTED && (
                <div>
                    <p>Voting sedang berlangsung:</p>
                    <Countdown date={end} renderer={countDown} />
                </div>
            )}
            {currentState === STATE_ENDED && <p>Voting telah berakhir</p>}
        </div>
    );
}

export default CountDown;
