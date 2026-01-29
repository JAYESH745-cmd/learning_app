import { Play, Award } from "lucide-react";
import moment from "moment";

const Quiz = ({ quiz, onStart }) => {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      {/* Score badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
          <Award className="w-4 h-4" />
          Score: {quiz.score ?? 0}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-900">
        {quiz.title || "Quiz"}
      </h3>

      <p className="text-xs text-slate-400 mt-1">
        Created {moment(quiz.createdAt).format("MMM DD, YYYY")}
      </p>

      {/* Question count */}
      <div className="mt-4">
        <span className="inline-block px-4 py-1 text-sm rounded-full border bg-slate-50">
          {quiz.questions.length} Questions
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={() => onStart(quiz)}
        className="
          mt-6 w-full h-12
          flex items-center justify-center gap-2
          rounded-xl
          bg-gradient-to-r from-emerald-500 to-teal-500
          text-white font-medium
          hover:opacity-90 transition
        "
      >
        <Play className="w-5 h-5" />
        Start Quiz
      </button>
    </div>
  );
};

export default Quiz;
