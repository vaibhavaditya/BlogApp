import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Posts from "./pages/Posts.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
    return (
      <>
        <Navbar/>

          <Routes>

            <Route path="/" element={ <Posts/> } />
            <Route path="/login" element={ <Login/> } />
            <Route path="/register" element={<Register/>} />

            <Route
                path='/profile'
                element={
                  <ProtectedRoute>
                    <Profile/>
                  </ProtectedRoute>
                }
            />
            
            <Route
                path="/posts/:id"
                element={
                  <ProtectedRoute>
                    <PostDetails />
                  </ProtectedRoute>
                }
            />

          </Routes>
      </>
    )
}

export default App
