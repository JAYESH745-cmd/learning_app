import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Layers } from "lucide-react";
import toast from "react-hot-toast";
import flashcardService from "../services/flashcardservice";
import Spinner from "../components/common/Spinner";
import Modal from "../components/common/Modal";

const FlashcardList = () => {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);

  const fetchSets = async () => {
    setLoading(true);
    try {
      const res = await flashcardService.getAllFlashcardSets();
      setSets(res.data); // <-- array

    } catch (err) {
      toast.error(err.message || "Failed to load flashcards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    <>
      <div className="grid md:grid-cols-2 gap-4">
        {sets.map((set) => (
          <div
            key={set._id}
            className="p-6 rounded-2xl border bg-white"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{set.title}</h3>

              <button
                onClick={() => setToDelete(set)}
                className="text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-500 mt-1">
              {set.cardsCount ?? set.cards?.length ?? 0} cards
            </p>

            <button
              onClick={() =>
                navigate(`/documents/${set.documentId}/flashcard`)
              }
              className="
                mt-4 px-4 py-2 rounded-lg
                bg-emerald-500 text-white
              "
            >
              Study
            </button>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete flashcard set?"
      >
        <p className="text-sm text-slate-600 mb-6">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setToDelete(null)}
            className="px-4 h-10 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              try {
                await flashcardService.deleteFlashcardSet(toDelete._id);
                toast.success("Flashcard set deleted");
                setToDelete(null);
                fetchSets();
              } catch (err) {
                toast.error(err.message);
              }
            }}
            className="px-4 h-10 rounded-lg bg-red-500 text-white"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardList;
