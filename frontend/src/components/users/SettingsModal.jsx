import React, { useState } from "react";
import { createPortal } from "react-dom";
import ContactModal from "./ContactModal";
import { FiTrash2, FiX, FiAlertTriangle, FiMail } from "react-icons/fi";
import api from "../../api/axios";

function SettingsModal({ onClose, currentUser, setCurrentUser }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const backdropClasses =
    "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-200";

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError("");

    try {
      await api.delete(`/users/${currentUser._id || currentUser.id}`);

      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      onClose();
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not delete your account. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return createPortal(
    <div className={backdropClasses} onClick={onClose}>
      <div
        className="w-full max-w-sm bg-white rounded-lg p-6 text-gray-800 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header som ändras dynamiskt */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3
              className={`text-base font-bold tracking-tight text-left ${
                showDeleteConfirm ? "text-red-600" : "text-gray-900"
              }`}
            >
              {showDeleteConfirm ? "Delete Account" : "Account Settings"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 text-left">
              {showDeleteConfirm
                ? "This action is permanent"
                : "Manage your preferences"}
            </p>
          </div>
          
          {/* X-knapp som backar om man står i delete-vyn, annars stänger */}
          <button
            onClick={() => {
              if (showDeleteConfirm) {
                setShowDeleteConfirm(false);
              } else {
                onClose();
              }
            }}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-2xl mb-4 border border-red-100 text-left font-medium">
            {error}
          </div>
        )}

        {!showDeleteConfirm ? (
          /* Huvudmeny */
          <div className="flex flex-col gap-2 my-2">
            {/* Kontakt / Feedback-alternativ */}
            <button
              type="button"
              onClick={() => {
                setShowContactModal(true);
              }}
              className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-xs text-gray-700 group-hover:scale-105 transition-transform">
                  <FiMail size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Contact & Feedback</p>
                  <p className="text-[10px] text-gray-500">
                    Report bugs, share ideas or collaborations
                  </p>
                </div>
              </div>
            </button>

            {/* Rad för att ta bort konto */}
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-between p-3.5 bg-red-50/60 hover:bg-red-50 rounded-2xl transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-xs text-red-500 group-hover:scale-105 transition-transform">
                  <FiTrash2 size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-red-600">Delete Account</p>
                  <p className="text-[10px] text-red-400">
                    Permanently remove your account and data
                  </p>
                </div>
              </div>
            </button>
          </div>
        ) : (
          /* Bekräftelsevy */
          <div className="space-y-4 text-left my-2">
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 p-3.5 rounded-2xl text-amber-800">
              <FiAlertTriangle size={20} className="shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                Are you sure you want to delete your account? This action cannot be undone and all your posts will be permanently removed.
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-xl transition-colors cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors cursor-pointer text-xs shadow-xs disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, delete account"}
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Rendera ContactModal när den är aktiverad */}
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </div>,
    document.body
  );
}

export default SettingsModal;