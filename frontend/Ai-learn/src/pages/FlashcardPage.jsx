import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import flashcardService from "../services/flashcardservice";
import Spinner from "../components/common/Spinner";

const FlashcardPage = () => {
  const { id: documentId } = useParams();

  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await flashcardService.getFlashcardsForDocument(documentId);
        setCards(data.cards || data);
      } catch (err) {
        toast.error(err.message || "Failed to load flashcards");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [documentId]);

  if (loading) return <Spinner />;
  if (!cards.length) return null;

  const card = cards[index];

  const handleNext = async () => {
    try {
      await flashcardService.reviewFlashcard(card._id, index);
    } catch {
      // silent fail — review is optional
    }

    setIndex((prev) => (prev + 1) % cards.length);
    setFlipped(false);
  };

  const handlePrev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
    setFlipped(false);
  };

  const handleStar = async () => {
    try {
      const updated = await flashcardService.toggleStar(card._id);
      setCards((prev) =>
        prev.map((c) => (c._id === card._id ? updated : c))
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16 text-center px-4">
      <p className="text-sm text-slate-500 mb-3">
        Card {index + 1} of {cards.length}
      </p>

      {/* Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="
          cursor-pointer
          p-8 rounded-2xl border bg-white
          min-h-[220px]
          flex items-center justify-center
          text-lg font-medium
        "
      >
        {flipped ? card.answer : card.question}
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={handleStar}
          className={`p-2 rounded-full border ${
            card.starred ? "text-yellow-500" : "text-slate-400"
          }`}
        >
          <Star
            className="w-5 h-5"
            fill={card.starred ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Controls */}
      <div className="mt-8 flex justify-between">
        <button
          disabled={index === 0}
          onClick={handlePrev}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FlashcardPage;
