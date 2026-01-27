import { useState } from "react";
import { Star } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      className="relative h-56 w-full perspective cursor-pointer"
      onClick={handleFlip}
    >
      {/* Card */}
      <div
        className={`relative h-full w-full rounded-2xl transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              {flashcard.question}
            </h3>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className="shrink-0"
            >
              <Star
                className={`w-5 h-5 ${
                  flashcard.starred
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-slate-400"
                }`}
              />
            </button>
          </div>

          <p className="text-sm text-slate-500">
            Click to reveal answer
          </p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <p className="text-base text-slate-800">
            {flashcard.answer}
          </p>

          <div className="flex items-center justify-between text-sm">
            <span className="capitalize px-3 py-1 rounded-full bg-white border border-emerald-200 text-emerald-700">
              {flashcard.difficulty}
            </span>

            <span className="text-slate-500">
              Click to flip back
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
