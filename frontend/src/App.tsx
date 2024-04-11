import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Leaderboard from "./pages/user/Leaderboard";
import Login from "./pages/auth/Login";
import Profile from "./pages/user/Profile";
import Signup from "./pages/auth/Signup";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLogin from "./pages/auth/AdminLogin";
import Subjects from "./pages/Subjects";
import Topics from "./pages/Topics";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NewQuiz from "./pages/admin/NewQuiz";
import GenerateQuiz from "./pages/admin/GenerateQuiz";
import Quizzes from "./pages/Quizzes";
import Quiz from "./pages/Quiz";
import CreateQuiz from "./pages/CreateQuiz";
import UserQuizzes from "./pages/user/UserQuizzes";

export default function App() {
  const { state } = useAuthContext();
  console.log(state);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={state.user ? <Navigate to="/" /> : <Login />}
        />

        <Route
          path="/signup"
          element={state.user ? <Navigate to="/" /> : <Signup />}
        />

        <Route path="/leaderboard" element={<Leaderboard token={state?.user?.token || null} />} />

        <Route
          path="/admin-login"
          element={state.user ? <Navigate to="/" /> : <AdminLogin />}
        />

        <Route
          path="/admin"
          element={
            state?.user?.isAdmin ? (
              <AdminDashboard token={state?.user?.token} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin/new-quiz"
          element={
            state?.user?.isAdmin ? (
              <NewQuiz token={state?.user?.token} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin/new-quiz/generate"
          element={
            state?.user?.isAdmin ? (
              <GenerateQuiz token={state?.user?.token} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/categories"
          element={
              <Categories token={state?.user?.token || null} />
          }
        />

        <Route
          path="/categories/:categoryId"
          element={
            state?.user ? (
              <Subjects token={state?.user?.token} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/categories/:categoryId/subjects/:subjectId"
          element={
            state?.user ? (
              <Topics token={state?.user?.token} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

<Route
  path="/categories/:categoryId/subjects/:subjectId/topics/:topicId"
  element={
    state?.user?.isAdmin ? (
      <Quizzes token={state?.user?.token} />
    ) : (
      state?.user?.token ? (
        <UserQuizzes token={state?.user?.token} />
      ) : (
        <Navigate to="/" />
      )
    )
  }
/>


        <Route path="/categories/:categoryId/subjects/:subjectId/topics/:topicId/quizzes/:quizId" element={state?.user ? <Quiz token={state?.user?.token} /> :   <Navigate to="/" />} />  

          <Route path="/admin/new-quiz/create"  element={state?.user?.isAdmin? <CreateQuiz token={state?.user?.token} /> :   <Navigate to="/" />} />

        <Route
          path="/profile"
          element={state?.user && !state?.user?.isAdmin ? <Profile token={state?.user?.token} /> : <Navigate to="/" />}
        />

      </Routes>
      <ToastContainer position="top-right" />
    </BrowserRouter>
  );
}
