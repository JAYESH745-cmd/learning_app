import { useEffect, useState } from "react";
import {
  Plus,
  Brain,
  Trash2,
  Play,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Spinner from "../common/Spinner";
import Modal from "../common/Modal";
import quizService from "../../services/quizservice";
import aiService from "../../services/aiservice";

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ---------------- Fetch Quizzes ---------------- */
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await quizService.getQuizzesForDocument(documentId);
      console.log(res);
      setQuizzes(res.data);
    } catch (err) {
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchQuizzes();
  }, [documentId]);

  /* ---------------- Generate Quiz ---------------- */
  const handleGenerateQuiz = async () => {
    setGenerating(true);
    try {
      await aiService.generateQuiz(documentId);
      toast.success("Quiz generated!");
      fetchQuizzes();
    } catch (err) {
      toast.error(err.message || "Failed to generate quiz");
    } finally {
      setGenerating(false);
    }
  };

  /* ---------------- Delete Quiz ---------------- */
  const handleDeleteRequest = (e, quiz) => {
    e.stopPropagation();
    setQuizToDelete(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!quizToDelete) return;
    setDeleting(true);

    try {
      await quizService.deleteQuiz(quizToDelete._id);
      toast.success("Quiz deleted");
      fetchQuizzes();
    } catch (err) {
      toast.error("Failed to delete quiz");
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setQuizToDelete(null);
    }
  };

  /* ---------------- Start Quiz ---------------- */
  const handleStartQuiz = (quiz) => {
    console.log("START QUIZ:", quiz);
    navigate(`/quiz/${quiz._id}`);
  };

  /* ---------------- Render Quiz List ---------------- */
  const renderQuizList = () => {
    if (loading) return <Spinner />;

    if (quizzes.length === 0) {
      return (
        <div className="text-center py-20">
          <Brain className="mx-auto w-12 h-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium">No Quizzes Yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2 mb-6">
            Generate a quiz from your document to test your understanding.
          </p>

          <button
            onClick={handleGenerateQuiz}
            disabled={generating}
            className="
              inline-flex items-center gap-2
              px-6 h-12 rounded-xl
              bg-gradient-to-r from-emerald-500 to-teal-500
              text-white font-medium
            "
          >
            {generating ? "Generating..." : (
              <>
                <Plus className="w-5 h-5" />
                Generate Quiz
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="grid md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="rounded-2xl border bg-white p-6 hover:shadow-md transition"
          >
            {/* Top row */}
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700">
                Score: {quiz.score ?? 0}
              </span>

              <button
                onClick={(e) => handleDeleteRequest(e, quiz)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Title */}
            <h3 className="mt-4 text-lg font-semibold">
              {quiz.title || "Quiz"}
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Created {moment(quiz.createdAt).format("MMM DD, YYYY")}
            </p>

            {/* Questions */}
            <div className="mt-4">
              <span className="inline-block px-4 py-1 text-sm rounded-full border bg-slate-50">
                {quiz.questions.length} Questions
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => handleStartQuiz(quiz)}
              className="
                mt-6 w-full h-12
                flex items-center justify-center gap-2
                rounded-xl
                bg-gradient-to-r from-emerald-500 to-teal-500
                text-white font-medium
              "
            >
              <Play className="w-5 h-5" />
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Your Quizzes</h2>

        <button
          onClick={handleGenerateQuiz}
          disabled={generating}
          className="
            inline-flex items-center gap-2
            px-5 h-11 rounded-xl
            bg-emerald-500 text-white font-medium
          "
        >
          <Plus className="w-5 h-5" />
          {generating ? "Generating..." : "Generate Quiz"}
        </button>
      </div>

      {renderQuizList()}

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Quiz"
      >
        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to delete this quiz? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 h-10 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmDelete}
            disabled={deleting}
            className="px-4 h-10 rounded-lg bg-red-500 text-white"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default QuizManager;
