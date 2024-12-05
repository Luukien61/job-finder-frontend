import { useEffect } from "react";

const SuccessPage = () => {
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const sessionId = queryParams.get("session_id");

        if (sessionId) {
            fetch('http://localhost:8088/webhook/verify-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            })
                .then(response => response.json())
                .then(data => console.log('Verified:', data))
                .catch(err => console.error('Error verifying session:', err));
        }
    }, []);

    return <div>Payment successful! Redirecting...</div>;
};

export default SuccessPage;
