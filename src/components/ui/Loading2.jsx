// src/components/ui/Loader2.jsx
import React from 'react';

const Loader2 = () => {
    return (
        <div className="spinner-container flex justify-center items-center">
            <div className="spinner"></div>

            <style>
                {`
                    .spinner-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                    }

                    .spinner {
                        width: 56px;
                        height: 56px;
                        border-radius: 50%;
                        padding: 1.1px;
                        background: conic-gradient(#0000 10%, #474bff) content-box;
                        -webkit-mask: repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
                                      radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 calc(100% - 9px));
                        -webkit-mask-composite: destination-in;
                        mask-composite: intersect;
                        animation: spinner-d55elj 1s infinite steps(10);
                    }

                    @keyframes spinner-d55elj {
                        to {
                            transform: rotate(1turn);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Loader2;
