import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Client/Home';
import Login from './pages/Admin/Login';
import ProfileEdit from './pages/Admin/ProfileEdit';
import EducationList from './pages/Admin/Education/EducationList';
import ExperiencesList from './pages/Admin/Experiences/ExperiencesList';
import ExperiencesForm from './pages/Admin/Experiences/ExperiencesForm';
import SocialLinksList from './pages/Admin/SocialLinks/SocialLinksList';
import SocialLinksForm from './pages/Admin/SocialLinks/SocialLinksForm';
import LabsList from './pages/Admin/Labs/LabsList';
import LabsForm from './pages/Admin/Labs/LabsForm';
import ContactList from './pages/Admin/Contact/ContactList';
import ProjectList from './pages/Admin/Project/ProjectList';
import ProjectForm from './pages/Admin/Project/ProjectForm';
import PostList from './pages/Admin/Post/PostList';
import PostForm from './pages/Admin/Post/PostForm';
import SkillList from './pages/Admin/Skill/SkillList';
import SkillForm from './pages/Admin/Skill/SkillForm';
import TechnologyList from './pages/Admin/Technology/TechnologyList';
import TechnologyForm from './pages/Admin/Technology/TechnologyForm';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<Home />} />
          </Route>

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/profile" replace />} />
            <Route path="profile" element={<ProfileEdit />} />
            
            <Route path="education" element={<EducationList />} />
            
            <Route path="experiences" element={<ExperiencesList />} />
            
            <Route path="social-links" element={<SocialLinksList />} />
            <Route path="social-links/:id" element={<SocialLinksForm />} />
            
            <Route path="labs" element={<LabsList />} />
            <Route path="labs/:id" element={<LabsForm />} />
            
            <Route path="contacts" element={<ContactList />} />
            
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/:id" element={<ProjectForm />} />
            
            <Route path="posts" element={<PostList />} />
            <Route path="posts/:id" element={<PostForm />} />
            
            <Route path="skills" element={<SkillList />} />
            
            <Route path="technologies" element={<TechnologyList />} />
            <Route path="technologies/:id" element={<TechnologyForm />} />
            
            {/* Add more admin modules here */}
            
            {/* Catch-all for undefined admin routes */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
