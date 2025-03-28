import { useEffect, useState } from "react";

/**
 * Hashes the email using SHA-256
 */
const sha256 = async (email) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(email.trim().toLowerCase());

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

/**
 * React Hook for Gravatar URL
 */
const useGravatar = (email, size = 150, defaultImg = "identicon") => {
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (email) {
            const generateUrl = async () => {
                const hash = await sha256(email);
                const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImg}`;
                setUrl(gravatarUrl);
            };

            generateUrl();
        }
    }, [email, size, defaultImg]);

    return url;
};

export default useGravatar;
