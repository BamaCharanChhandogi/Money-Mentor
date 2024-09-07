import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Service from "./pages/Service";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BudgetDashboard from "./components/Budgets/Budget";
import ExpenseDashboard from "./components/Expenses/Expenses";
import Register from "./pages/Register";
import Verify from "./components/Verify";
import Profile from "./pages/profile";

function App() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '60px', paddingBottom: '60px' }}>
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Service />} />
        <Route path="/services/expenses" element={<ExpenseDashboard />} />
        <Route path="/services/budgets" element={<BudgetDashboard />} />
        {/* Add routes for other feature pages */}
        <Route path="/service" element={<Service />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
