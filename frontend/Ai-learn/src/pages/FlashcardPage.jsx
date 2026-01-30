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
  const { id: setId } = useParams();
  const navigate = useNavigate();

  const [set, setSet] = useState(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  console.log(setId);
  /* -------- Load ONE flashcard set -------- */
  useEffect(() => {
    const loadSet = async () => {
      try {
        // backend returns ALL sets → find by id
        const res = await flashcardService.getAllFlashcardSets();
        const found = res.data.find((s) => s.documentId === setId);
        if (!found) {
          toast.error("Flashcard set not found");
          navigate("/flashcards");
          return;
        }

        setSet(found);
      } catch {
        toast.error("Failed to load flashcards");
      } finally {
        setLoading(false);
      }
    };

    loadSet();
  }, [setId, navigate]);

  if (loading) return <Spinner />;
  if (!set) return null;

  const card = set.cards[index];

  /* -------- Actions -------- */
  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      setSet((prev) => ({
        ...prev,
        cards: prev.cards.map((c) =>
          c._id === cardId
            ? { ...c, starred: !c.starred }
            : c
        ),
      }));
    } catch {
      toast.error("Failed to update star");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-6 py-6">
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

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            setIndex((i) => (i - 1 + set.cards.length) % set.cards.length)
          }
          className="p-3 rounded-lg border hover:bg-slate-50"
        >
          <ChevronLeft />
        </button>

        <span className="text-sm text-slate-500">
          {index + 1} / {set.cards.length}
        </span>

        <button
          onClick={() =>
            setIndex((i) => (i + 1) % set.cards.length)
          }
          className="p-3 rounded-lg border hover:bg-slate-50"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default FlashcardPage;
