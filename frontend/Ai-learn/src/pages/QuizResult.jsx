import { useLocation, useNavigate } from "react-router-dom";

const QuizResult = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    navigate("/dashboard");
    return null;
  }

  const { quiz, answers } = state;

  const score = quiz.questions.reduce((acc, q) => {
    return acc + (answers[q._id] === q.correctAnswer ? 1 : 0);
  }, 0);

  return (
    <div className="max-w-3xl mx-auto py-16 px-4 text-center">
      <h2 className="text-3xl font-semibold mb-4">Quiz Completed 🎉</h2>

      <p className="text-lg text-slate-700 mb-8">
        You scored <span className="font-bold">{score}</span> / {quiz.questions.length}
      </p>

      <div className="space-y-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full h-12 rounded-xl bg-emerald-500 text-white"
        >
          Back to Dashboard
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full h-12 rounded-xl border"
        >
          Retake Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
