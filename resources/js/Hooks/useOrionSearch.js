import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useOrionSearch = (
    model,
    queryParams = {},
    searchParams = "",
    options = {}
) => {
    const queryString = new URLSearchParams(queryParams).toString();

    // Handle URL based on whether pagination or filtering is changing
    // const url = searchParams
    //     ? `/api/${model}/search` // Force page=1 when filtering
    //     : `/api/${model}/search${queryString ? `?${queryString}` : ""}`; // For pagination

    const url = `/api/${model}/search${queryString ? `?${queryString}` : ""}`; // For pagination

    const fetchData = async () => {
        const payload = {
            search: {
                value: searchParams || "",
            },
        };

        const { data } = await axios.post(url, payload, {
            headers: { "Content-Type": "application/json" },
        });

        return data;
    };

    return useQuery({
        queryKey: ["orion", [model, queryParams, searchParams]],
        queryFn: fetchData,
        ...options,
    });
};

export default useOrionSearch;
