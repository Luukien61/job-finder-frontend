import React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}

const Payment = () => {
    return (
        <div className={`h-screen bg-white flex justify-center flex-col`}>
            <div className={``}>
                <stripe-pricing-table pricing-table-id="prctbl_1QSgijFMfEC9tDRAk3FaXA1j"
                                      publishable-key="pk_test_51QSgLlFMfEC9tDRAej15WRORpPfqwOCUbTQ7E4Vlz0K6Mvl4hdMgUavGFxmB0NEc9zbQIFEeffKiDakHznViNfz3001w8OJvVj">
                </stripe-pricing-table>
            </div>
        </div>
    );
};

export default Payment;