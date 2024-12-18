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
import PlaidIntegration from "./components/BankAccount/Plaid";
import Chatbot from "./components/ChatBot/Gemini";
import FinancialAdvice from "./components/FinancialAdvice";
import ExpenseAnalysis from "./components/ExpenseAnalysis";
import BudgetAdherence from "./components/BudgetAdherence";
import Dashboard from "./pages/FinanceAdvise";
import InvestmentTracker from "./components/Investment/InvestmentTracker";
import TransactionsPage from "./pages/TransactionsPage";
import FamilyDashboard from "./components/Family/FamilyDashboard";
import FamilyLanding from "./components/Family/FamilyLanding";
import CreateFamily from "./components/Family/CreateFamily";
import SharedExpensesList from "./components/Family/SharedExpenseForm";

function App() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "60px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Service />} />
          <Route path="/services/expenses" element={<ExpenseDashboard />} />
          <Route path="/services/budgets" element={<BudgetDashboard />} />
          <Route
            path="/services/bank-accounts"
            element={<PlaidIntegration />}
          />
          {/* investment */}
          <Route path="/service" element={<Service />} />
          <Route path="/services/investments" element={<InvestmentTracker />} />
          {/* Add routes for other feature pages */}
          <Route path="/service" element={<Service />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/family" element={<FamilyLanding />} />
          <Route path="/family/create" element={<CreateFamily />} />
          <Route path="/family/manage" element={<FamilyDashboard />} />
          <Route path="/family/expenses" element={<SharedExpensesList />} />
          <Route
            path="/family/expenses/:familyId"
            element={<SharedExpensesList />}
          />
          <Route path="/ai-dashboard" element={<Dashboard />} />
          <Route path="/financial-advice" element={<FinancialAdvice />} />
          <Route path="/expense-analysis" element={<ExpenseAnalysis />} />
          <Route path="/budget-adherence" element={<BudgetAdherence />} />
        </Routes>
      </div>
      <Chatbot />
      <Footer />
    </>
  );
}

export default App;
