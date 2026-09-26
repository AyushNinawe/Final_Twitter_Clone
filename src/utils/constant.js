export const USER_API_END_POINT = "/api/v1/user";
export const TWEET_API_END_POINT = "/api/v1/tweet";

export const timeSince = (timestamp) => {
    if (!timestamp) return "just now";
    const time = Date.parse(timestamp);
    const now = Date.now();
    const secondsPast = (now - time) / 1000;
    if (secondsPast < 60) {
        return `${Math.max(1, Math.round(secondsPast))}s`;
    }
    if (secondsPast < 3600) {
        return `${Math.round(secondsPast / 60)}m`;
    }
    if (secondsPast <= 86400) {
        return `${Math.round(secondsPast / 3600)}h`;
    }
    const days = Math.round(secondsPast / 86400);
    return `${days}d`;
};
