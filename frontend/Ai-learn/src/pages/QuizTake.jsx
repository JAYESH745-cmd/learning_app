import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import quizService from "../services/quizservice";
import Spinner from "../components/common/Spinner";

const QuizTake = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizService.getQuizById(quizId);
        setQuiz(res.data);
      } catch {
        toast.error("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading) return <Spinner />;
  if (!quiz) return null;

  const question = quiz.questions[currentIndex];

  const handleSelect = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [question._id]: option,
    }));
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // optional backend submission
      // await quizService.submitQuiz(quizId, answers);

      navigate(`/quiz/${quizId}/results`, {
        state: {
          quiz,
          answers,
        },
      });
    } catch {
      toast.error("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Progress */}
      <p className="text-sm text-slate-500 mb-2">
        Question {currentIndex + 1} of {quiz.questions.length}
      </p>

      {/* Question */}
      <h2 className="text-xl font-semibold mb-6">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            className={`
              w-full text-left px-5 py-3 rounded-xl border transition
              ${
                answers[question._id] === opt
                  ? "border-emerald-500 bg-emerald-50"
                  : "hover:bg-slate-50"
              }
            `}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={handleNext}
        disabled={!answers[question._id] || submitting}
        className="
          mt-8 w-full h-12 rounded-xl
          bg-emerald-500 text-white font-medium
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {currentIndex === quiz.questions.length - 1
          ? submitting ? "Submitting..." : "Finish Quiz"
          : "Next"}
      </button>
    </div>
  );
};

export default QuizTake;
