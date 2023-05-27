import useSWR from "swr";

function useVotes() {
    const fetcher = (url) => fetch(url).then((r) => r.json());
    const { data, error, isLoading } = useSWR("/api/vote", fetcher);

    return { data, error, isLoading };
}

export default useVotes;
