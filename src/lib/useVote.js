import useSWR from "swr";

function useVote(code) {
    const fetcher = (url) => fetch(url).then((r) => r.json());
    const { data, mutate, error, isLoading } = useSWR(code ? "/api/vote/" + code : null, fetcher);

    return { data, error, mutate, isLoading };
}

export default useVote;
