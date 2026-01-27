import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";
import aiService from "../../services/aiservice";
import MarkdownRenderer from "../common/MarkdownRender";

const AIActions = () => {
  const { id: documentId } = useParams();

  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [concept, setConcept] = useState("");
  const [conceptResult, setConceptResult] = useState("");
  const [conceptLoading, setConceptLoading] = useState(false);

  /* ------------------ Generate Summary ------------------ */
  const handleGenerateSummary = async () => {
    try {
      setSummaryLoading(true);
      setSummary("");
      const res = await aiService.generateSummary(documentId);
      setSummary(res.summary);
    } catch (error) {
      toast.error("Failed to generate summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  /* ------------------ Explain Concept ------------------ */
  const handleExplainConcept = async () => {
    if (!concept.trim()) {
      toast.error("Please enter a concept");
      return;
    }

    try {
      setConceptLoading(true);
      setConceptResult("");
      const res = await aiService.explainConcept(documentId, concept);
      setConceptResult(res.explanation);
    } catch (err) {
      toast.error("Failed to explain concept");
    } finally {
      setConceptLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">AI Assistant</h2>
          <p className="text-sm text-slate-500">
            Powered by advanced AI
          </p>
        </div>
      </div>

      {/* ---------------- Generate Summary ---------------- */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900">
                Generate Summary
              </h3>
              <p className="text-sm text-slate-500">
                Get a concise summary of the entire document.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateSummary}
            disabled={summaryLoading}
            className={`px-4 h-10 rounded-lg text-sm font-medium transition
              ${
                summaryLoading
                  ? "bg-emerald-200 text-white cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
          >
            {summaryLoading ? "Loading..." : "Generate"}
          </button>
        </div>

        {summary && (
          <div className="mt-4 border-t pt-4">
            <MarkdownRenderer content={summary} />
          </div>
        )}
      </div>

      {/* ---------------- Explain Concept ---------------- */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900">
              Explain a Concept
            </h3>
            <p className="text-sm text-slate-500">
              Enter a topic from the document to get a detailed explanation.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="e.g. React Hooks"
            className="flex-1 h-11 px-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleExplainConcept}
            disabled={conceptLoading}
            className={`px-5 h-11 rounded-lg text-sm font-medium transition
              ${
                conceptLoading
                  ? "bg-emerald-200 text-white cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
          >
            {conceptLoading ? "Loading..." : "Explain"}
          </button>
        </div>

        {conceptResult && (
          <div className="mt-4 border-t pt-4">
            <MarkdownRenderer content={conceptResult} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AIActions;
