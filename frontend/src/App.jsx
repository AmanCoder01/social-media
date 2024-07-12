import { Spinner } from "./components/Spinner"
import { UserData } from "./context/UserContext"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Reels from "./pages/Reels"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import UserAccount from "./pages/UserAccount"
import PrivateRoute from "./components/PrivateRoute"
import PageNotFound from "./components/PageNotFound"
import ChangePassword from "./pages/ChangePassword"
import Search from "./pages/Search"
import Chats from "./pages/Chats"

function App() {
  const { loading } = UserData();


  if (loading) {
    return <div className="h-screen">
      <Spinner />
    </div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrivateRoute> <Home /></PrivateRoute>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/profile" element={<PrivateRoute> <Profile /></PrivateRoute>} />
        <Route path="/user/:id" element={<PrivateRoute> <UserAccount /></PrivateRoute>} />
        <Route path="/reels" element={<PrivateRoute> <Reels /></PrivateRoute>} />
        <Route path="/change-password" element={<PrivateRoute> <ChangePassword /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute> <Search /></PrivateRoute>} />
        <Route path="/chats" element={<PrivateRoute> <Chats /></PrivateRoute>} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
