import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Layers } from "lucide-react";
import toast from "react-hot-toast";
import flashcardService from "../services/flashcardservice";
import Spinner from "../components/common/Spinner";

const FlashcardList = () => {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const res = await flashcardService.getAllFlashcardSets();
        setSets(res.data); // ✅ ARRAY
      } catch (err) {
        toast.error(err.message || "Failed to load flashcards");
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, []);

  if (loading) return <Spinner />;

  if (sets.length === 0) {
    return (
      <div className="text-center py-20">
        <Layers className="mx-auto w-12 h-12 text-slate-400 mb-4" />
        <p className="text-slate-500">No flashcard sets yet</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {sets.map((set) => (
        <div
          key={set._id}
          className="p-6 rounded-2xl border bg-white hover:shadow cursor-pointer"
          onClick={() => navigate(`/flashcards/${set.documentId._id}`)}
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{set.title}</h3>
            <Trash2 className="w-4 h-4 text-red-500" />
          </div>

          <p className="text-sm text-slate-500 mt-1">
            {set.cards?.length || 0} cards
          </p>
        </div>
      ))}
    </div>
  );
};

export default FlashcardList;
