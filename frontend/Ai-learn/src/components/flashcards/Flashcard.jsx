import { useState } from "react";
import { Star } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const difficultyColors = {
  easy: "bg-green-600",
  medium: "bg-yellow-500",
  hard: "bg-red-600",
};
const difficult =
  flashcard.difficult?.toLowerCase() || "medium";

  return (
    <div style={{ perspective: "1000px" }} className="relative h-56 w-full">
      <div
        className="relative h-full w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-2xl bg-white border border-slate-200 shadow-sm"
          style={{
            backfaceVisibility: "hidden",
            zIndex: isFlipped ? 0 : 1,
            pointerEvents: isFlipped ? "none" : "auto",
          }}
          onClick={() => setIsFlipped(true)}
        >
          {/* STAR — WORKS */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar?.(flashcard._id);
            }}
            className="absolute top-4 right-4 z-20"
          >
            <Star
              className={`w-5 h-5 ${
                flashcard.starred
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-400"
              }`}
            />
          </button>
         <span
  className={`
    absolute top-4 left-4
    px-5 py-2
    rounded-xl
    text-sm font-bold uppercase
    tracking-wide
    text-white
    shadow-lg
    ${difficultyColors[difficult] || "bg-slate-700"}
  `}
>
  {difficult}
</span>

          {/* QUESTION */}
          <div className="h-full flex items-center justify-center text-center p-6">
            <h3 className="text-lg font-semibold max-w-[90%]">
              {flashcard.question}
            </h3>
          </div>

          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-slate-500">
            Click to reveal answer
          </span>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            zIndex: isFlipped ? 1 : 0,
            pointerEvents: isFlipped ? "auto" : "none",
          }}
          onClick={() => setIsFlipped(false)}
        >
          {/* DIFFICULTY — NOW VISIBLE */}
          <span
          className={`
          absolute top-4 left-4
          px-5 py-2
          rounded-xl
          text-sm font-bold uppercase
          tracking-wide
          text-white
          shadow-lg
          ${difficultyColors[difficult] || "bg-slate-700"}
        `}
      >
        {difficult}
      </span>

          {/* ANSWER */}
          <div className="h-full flex items-center justify-center text-center p-6">
            <p className="text-base max-w-[90%]">
              {flashcard.answer}
            </p>
          </div>

          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-slate-500">
            Click to flip back
          </span>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
