import React from "react"
import { BrowserRouter as Router , Routes , Route , Navigate } from "react-router-dom";
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"
import QuizResult from "./pages/QuizResult"
import QuizTake from "./pages/QuizTake"
import DocumentDetail from "./pages/DocumentDetail"
import DocumentList from "./pages/DocumentList"
import FlashcardList from "./pages/FlashcardList"
import FlashcardPage from "./pages/FlashcardPage"
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./context/AuthContext";


function App() {
   const {isAuthenticated,loading}=useAuth();

  if (loading){
    return (
      <div className="flex items-center justify-center h-screen  ">
        loading....
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element ={isAuthenticated? <Navigate to="/dashboard" replace/> : <Navigate to="/login" replace/>} />
         <Route path="/login" element={<Login />}/>
         <Route path="/register" element={<Register/>}/>
         <Route element={<ProtectedRoute/>}>
          
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/documents" element={<DocumentList/>}/>
          <Route path="/documents/:id" element={<DocumentDetail/>}/>
          <Route path="/flashcards" element={<FlashcardList/>}/>
          <Route path="/flashcards/:id" element={<FlashcardPage />}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/quiz/:quizId" element={<QuizTake/>}/>
          <Route path="/quiz/:quizId/results" element={<QuizResult/>}/>
          <Route path="/profile" element={<Profile/>}/>

         </Route>
         
         
      </Routes>
    </Router>
  )
}

export default App
