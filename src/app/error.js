"use client";

export default function Error({ error, reset }) {
    console.log("🚀  error:", error);
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold text-rose-500">Something went wrong!</h2>
            <button onClick={() => reset()}>Try again</button>
        </div>
    );
}
