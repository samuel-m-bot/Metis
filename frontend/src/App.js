import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './features/auth/Login'
import Home from './features/accounts/Home'
import NotFound from './components/NotFound'
import ProjectDashboard from './features/projects/ProjectDashboard'
import ProductList from './features/products/ProductList.js'
import DesignManagement from './features/designs/DesignManagement'
import ChangeRequests from './features/changes/ChangeRequests'
import DocumentLibrary from './features/documents/DocumentLibrary'
import UserManagement from './features/users/UserManagement'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Login/>}/>
        <Route path='signUp' element={<SignUp/>}/>
        
        <Route path="home" element={<Home />} />
        <Route path="projects" element={<ProjectDashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="designs" element={<DesignManagement />} />
        <Route path="change-requests" element={<ChangeRequests />} />
        <Route path="documents" element={<DocumentLibrary />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
