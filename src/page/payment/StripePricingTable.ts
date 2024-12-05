import React, {useEffect} from "react";

export const StripePricingTable = () => {

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/pricing-table.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };

    }, []);

    return React.createElement("stripe-pricing-table", {
        "pricing-table-id": "prctbl_1QSgijFMfEC9tDRAk3FaXA1j",
        "publishable-key": "pk_test_51QSgLlFMfEC9tDRAej15WRORpPfqwOCUbTQ7E4Vlz0K6Mvl4hdMgUavGFxmB0NEc9zbQIFEeffKiDakHznViNfz3001w8OJvVj",
    });

};