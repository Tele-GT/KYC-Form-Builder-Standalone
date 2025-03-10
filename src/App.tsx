import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import FormBuilder from './pages/FormBuilder';
import UserForms from './pages/UserForms';
import Submissions from './pages/Submissions';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/editor/:type" element={<FormBuilder />} />
          <Route path="/forms" element={<UserForms />} />
          <Route path="/submissions/:formId" element={<Submissions />} />
        </Routes>
      </Layout>
    </Router>
  );
}
