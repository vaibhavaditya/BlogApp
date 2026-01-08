import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import CreatePost from './pages/CreatePost.jsx'
import EditPost from './pages/EditPost.jsx'

import Home from './pages/Home.jsx'
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Posts from "./pages/Posts.jsx";
 
import Profile from "./pages/Profile.jsx";
import UserProfile  from './pages/UserProfile.jsx'

import Comments from './pages/Comments.jsx'
function App() {
    return (
      <>
        <Navbar/>

          <Routes>

            <Route path="/" element={ <Home/> } />
            <Route path="/login" element={ <Login/> } />
            <Route path="/register" element={<Register/>} />
            <Route 
                path="/posts/:id" 
                element={ 
                <ProtectedRoute>
                  <Posts/> 
                </ProtectedRoute>
            } />
             
            <Route
                path='/profile'
                element={
                  <ProtectedRoute>
                    <Profile/>
                  </ProtectedRoute>
                }
            />
            
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            <Route
                path="/create-post"
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                }
            />

            <Route
                path="/posts/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditPost />
                  </ProtectedRoute>
                }
            />

            <Route
                path="/posts/:id/comments"
                element={
                  <ProtectedRoute>
                    <Comments />
                  </ProtectedRoute>
                }
            />

          </Routes>
      </>
    )
}

export default App
