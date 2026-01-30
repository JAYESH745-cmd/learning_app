import React, { useEffect, useState } from "react";
import Spinner from "../components/common/Spinner";
import progressService from "../services/progressService";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Clock
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await progressService.getDashboardData();
      setDashboardData(res.data); // 👈 IMPORTANT
    } catch (error) {
      toast.error("Failed to load dashboard");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!dashboardData) {
    return (
      <div className="p-6 text-center text-slate-500">
        No dashboard data available
      </div>
    );
  }

  const { overview, recentActivity } = dashboardData;

  const documents = recentActivity?.documents ?? [];
  const quizzes = recentActivity?.quizzes ?? [];


  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">
          Track your learning progress and activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Documents"
          value={overview.totalDocuments}
          icon={<FileText />}
        />
        <StatCard
          title="Total Flashcards"
          value={overview.totalFlashcards}
          icon={<BookOpen />}
        />
        <StatCard
          title="Total Quizzes"
          value={overview.totalQuizzes}
          icon={<BrainCircuit />}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-emerald-500" />
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>

        {/* Documents */}
        <div className="space-y-3">
          {documents.length === 0 && quizzes.length === 0 && (
            <p className="text-sm text-slate-500">
              No recent activity found
            </p>
          )}

          {documents.map((doc) => (
            <ActivityItem
              key={doc._id}
              title={`Accessed Document: ${doc.title || doc.fileName}`}
              date={doc.lastAccessed || doc.createdAt}
              onClick={()=>{navigate(`/documents/${doc._id}`)} }
              className="cursor-pointer"
            />
           
          ))}
          {quizzes.map((quiz) => (
            <ActivityItem
              key={quiz._id}
              title={`Attempted Quiz: ${quiz.title}`}
              rightText={`${quiz.score}%`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------- Components ---------- */

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl shadow-sm border p-5 flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
    <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
      {icon}
    </div>
  </div>
);

const ActivityItem = ({ title, date, rightText,onClick }) => (
  <div  onClick={onClick} className="flex cursor-pointer justify-between items-center bg-slate-50 rounded-lg px-4 py-3">
    <div>
      
      <p className="text-sm font-medium text-slate-800">{title}</p>
      <p className="text-xs text-slate-400">
        {date ? new Date(date).toLocaleString() : "Invalid date"}
      </p>
    </div>
    {rightText && (
      <span className="text-sm text-emerald-600 font-semibold">
        {rightText}
      </span>
    )}
  </div>
);

export default DashboardPage;
