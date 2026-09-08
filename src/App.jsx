import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home.jsx'
import Gallery from './pages/Gallery.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Login from './admin/Login.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import ProtectedRoute from './admin/ProtectedRoute.jsx'
import Dashboard from './admin/Dashboard.jsx'
import ProjectsList from './admin/ProjectsList.jsx'
import ProjectForm from './admin/ProjectForm.jsx'
import Messages from './admin/Messages.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/:id" element={<ProjectForm />} />
          <Route path="messages" element={<Messages />} />
        </Route>
      </Routes>
    </>
  )
}
