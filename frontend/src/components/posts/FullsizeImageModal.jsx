import React from "react";
import { FiX } from "react-icons/fi";

function FullsizeImageModal({ imageUrl, onClose }) {
    if (!imageUrl) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-150"
            onClick={onClose}
        >
            <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center">
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white/80 hover:text-white p-2 rounded-full cursor-pointer"
                >
                    <FiX size={24} />
                </button>
                <img
                    src={imageUrl}
                    alt="Fullsize preview"
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
}

export default FullsizeImageModal;