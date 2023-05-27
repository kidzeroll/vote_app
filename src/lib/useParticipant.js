import useSWR from "swr";

function useParticipant(code) {
    const fetcher = (url) => fetch(url).then((r) => r.json());
    const { data, mutate, error, isLoading } = useSWR(code ? "/api/participant/" + code : null, fetcher);

    return { data, error, mutate, isLoading };
}

export default useParticipant;
