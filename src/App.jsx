import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import Layout from '@/components/Layout';
import AdminLayout from '@/components/admin/AdminLayout';
import Home from '@/pages/Home';
import Experts from '@/pages/Experts';
import ExpertProfile from '@/pages/ExpertProfile';
import About from '@/pages/About';
import ExpertsAdmin from '@/pages/admin/ExpertsAdmin';
import BookingsAdmin from '@/pages/admin/BookingsAdmin';
import CohortsAdmin from '@/pages/admin/CohortsAdmin';
import NominationsAdmin from '@/pages/admin/NominationsAdmin';
import TestimonialsAdmin from '@/pages/admin/TestimonialsAdmin';
import StatsAdmin from '@/pages/admin/StatsAdmin';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/expert/:id" element={<ExpertProfile />} />
        <Route path="/about" element={<About />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<ExpertsAdmin />} />
        <Route path="/admin/bookings" element={<BookingsAdmin />} />
        <Route path="/admin/cohorts" element={<CohortsAdmin />} />
        <Route path="/admin/nominations" element={<NominationsAdmin />} />
        <Route path="/admin/testimonials" element={<TestimonialsAdmin />} />
        <Route path="/admin/stats" element={<StatsAdmin />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App