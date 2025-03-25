import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useOrionPost = (model, options = {}) => {
    const postData = async (payload) => {
        const url = `/api/${model}`;

        const { data } = await axios.post(url, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return data;
    };

    return useMutation({
        mutationFn: postData,
        ...options, // Additional options like onSuccess, onError, etc.
    });
};

export default useOrionPost;
