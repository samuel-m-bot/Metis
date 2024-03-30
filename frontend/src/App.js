import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './features/auth/Login'
import SignUp from './features/users/SignUp.js'
import Home from './features/users/Home.js'
import NotFound from './components/NotFound'
import ProjectDashboard from './features/projects/ProjectDashboard'
import ProductList from './features/products/ProductList.js'
import DesignManagement from './features/designs/DesignManagement'
import ChangeRequests from './features/changes/ChangeRequests.js'
import DocumentLibrary from './features/documents/DocumentLibrary'
import UserManagement from './features/users/UserManagement'
import MetisLayout from './components/MetisLayout.js'
import Project from './features/projects/Project.js'
import ProjectList from './features/projects/ProjectList.js'
import Documents from './features/documents/Documents.js'
import ChangeRequestTabs from './features/changes/ChangeRequestsTabs.js'
import ChangeRequestReview from './features/changes/ChangeRequestReview.js'
import TaskDetails from './features/Tasks/TaskDetail.js'
import Product from './features/products/Product.js'
import Design from './features/designs/Design.js'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Login/>}/>
        <Route path='signUp' element={<SignUp/>}/>

        // Nested MetisLayout as the layout component for specific routes
        <Route path="/" element={<MetisLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="projects" element={<ProjectList />}/>
          <Route path="projects/project" element={<Project />}/>
          <Route path="projects/:projectId" element={<ProjectDashboard />} />#
          <Route path="tasks/:taskId" element={<TaskDetails />} />
          <Route path="documents/:documentId" element={<Documents />} />
          <Route path="change-requests/:changeRequestID" element={<ChangeRequestTabs />} />
          <Route path="change-requests/review/:changeRequestID" element={<ChangeRequestReview />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:productId" element={<Product />} />
          <Route path="designs" element={<DesignManagement />} />
          <Route path="designs/:designId" element={<Design />} />
          <Route path="change-requests" element={<ChangeRequests />} />
          <Route path="documents" element={<DocumentLibrary />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
