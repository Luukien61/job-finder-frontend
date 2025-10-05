import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "null");

        if (!user) {
            navigate("/login");
        }
    }, [navigate]);
};

export default useAuthRedirect;
