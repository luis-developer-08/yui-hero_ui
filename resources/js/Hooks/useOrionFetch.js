import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useOrionFetch = (model, queryParams = {}, options = {}) => {
    const fetchData = async () => {
        const queryString = new URLSearchParams(queryParams).toString();
        const url = `/api/${model}${queryString ? `?${queryString}` : ""}`;

        const { data } = await axios.get(url);
        return data ?? [];
    };

    return useQuery({
        queryKey: ["orion", model, queryParams],
        queryFn: fetchData,
        ...options, // Additional options like refetch intervals, caching, etc.
    });
};

export default useOrionFetch;
