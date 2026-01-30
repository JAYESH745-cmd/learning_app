import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import flashcardService from "../services/flashcardservice";
import Spinner from "../components/common/Spinner";

const FlashcardPage = () => {
  const { id } = useParams(); // documentId
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        const res = await flashcardService.getFlashcardsForDocument(id);
        setCards(res.data); // ✅ ARRAY
      } catch (err) {
        toast.error(err.message || "Failed to load flashcards");
      } finally {
        setLoading(false);
      }
    };

    loadFlashcards();
  }, [id]);

  if (loading) return <Spinner />;
  if (cards.length === 0) return <p>No flashcards found</p>;

  const card = cards[index];

  return (
    <div className="max-w-xl mx-auto py-12 text-center">
      <p className="text-sm text-slate-500 mb-2">
        Card {index + 1} of {cards.length}
      </p>

      {/* Flashcard */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="cursor-pointer p-8 rounded-2xl border bg-white min-h-[220px] flex items-center justify-center text-lg font-medium"
      >
        {flipped ? card.answer : card.question}
      </div>

      {/* Controls */}
      <div className="mt-6 flex justify-between">
        <button
          disabled={index === 0}
          onClick={() => {
            setIndex((i) => i - 1);
            setFlipped(false);
          }}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        <button
          disabled={index === cards.length - 1}
          onClick={() => {
            setIndex((i) => i + 1);
            setFlipped(false);
          }}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FlashcardPage;
