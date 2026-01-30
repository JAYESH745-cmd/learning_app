import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

import flashcardService from "../services/flashcardservice";
import Spinner from "../components/common/Spinner";
import Flashcard from "../components/flashcards/Flashcard";

const FlashcardPage = () => {
  const { id: documentId } = useParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ---------------- Load flashcards ---------------- */
  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        const res = await flashcardService.getFlashcardsForDocument(documentId);
        setCards(res.data);
      } catch (err) {
        toast.error("Failed to load flashcards");
      } finally {
        setLoading(false);
      }
    };

    loadFlashcards();
  }, [documentId]);

  if (loading) return <Spinner />;
  if (cards.length === 0) {
    return <p className="text-center text-slate-500">No flashcards found</p>;
  }

  const card = cards[currentIndex];

  /* ---------------- Handlers ---------------- */
  const handleNext = () => {
    setCurrentIndex((i) => (i + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((i) =>
      (i - 1 + cards.length) % cards.length
    );
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      setCards((prev) =>
        prev.map((c) =>
          c._id === cardId ? { ...c, starred: !c.starred } : c
        )
      );
    } catch {
      toast.error("Failed to update star");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/flashcards")}
        className="flex items-center gap-2 text-sm text-slate-600"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to flashcards
      </button>

      <Flashcard
        flashcard={card}
        onToggleStar={handleToggleStar}
      />

      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="p-3 rounded-lg border hover:bg-slate-50"
        >
          <ChevronLeft />
        </button>

        <span className="text-sm text-slate-500">
          {currentIndex + 1} / {cards.length}
        </span>

        <button
          onClick={handleNext}
          className="p-3 rounded-lg border hover:bg-slate-50"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default FlashcardPage;
