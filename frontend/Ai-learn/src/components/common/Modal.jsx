import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        {/* Header */}
        {title && (
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            {title}
          </h3>
        )}

        {/* Content */}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
