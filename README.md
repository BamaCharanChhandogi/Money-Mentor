## Money-Mentor

### Introduction

Money-Mentor is a premium personal finance management ecosystem that empowers users to take full control of their financial journeys through real-time data, collaborative tools, and AI-driven insights.

### 💎 Key Features & Innovations

- **🚀 Real-Time Bank Integration (Plaid):** Securely connect multiple bank accounts to sync balances and transactions instantly. Includes a secure "Disconnect" feature to wipe synced data on demand.
- **📊 Advanced Multi-Period Budgeting:** Smart budgeting with support for **Weekly, Monthly, and Yearly** targets. Includes **Rollover Bonuses** where unspent monthly budgets boost your next month's funds.
- **🏠 Household Hub (Family Groups):** Create financial groups to manage household expenses together. Invite members, assign roles (Admin/Member), and split shared expenses with real-time notifications.
- **🧠 Smart Categorization:** Intelligent expense logging with standardized categories and real-time dropdowns to ensure consistent financial reporting.
- **📈 Comprehensive Investment Tracking:** Monitor stocks, crypto, and ETFs with real-time price updates and performance analytics (Total Return, Annualized Gain).
- **📉 Financial Health Score:** A dynamic 0-100 score that analyzes your savings buffer, investment ratio, and tracking consistency to give you a snapshot of your financial wellness.
- **✨ Premium Glassmorphism UI:** A state-of-the-art interface built with modern typography, smooth gradients, and a responsive design system.

### 🛡️ Detailed Implementation

#### 1. Smart Expense & Budgeting Engine
- **Multi-Period Logic:** Weekly budgets track from Monday; Yearly budgets aggregate 12-month data.
- **Rollover System:** Automatically detects surplus from previous months and updates your "available to spend" pool.
- **Visual Feedback:** Premium Recharts integration with "Danger/Warning" color-coding when approaching budget limits.

#### 2. Banking & Security
- **Plaid Integration:** OAuth-based bank linking with automated transaction fetching.
- **Data Privacy:** One-click account disconnection which cascadingly deletes all cached bank transactions and tokens.
- **Currency Standardization:** Unified `$` formatting across all modules with `.toLocaleString()` precision.

#### 3. Family Hub & Collaboration
- **Dynamic Invitations:** Token-based invite system for joining family groups securely.
- **Expense Splitting:** Shared expenses can be split equally or with custom logic, appearing instantly in the Family Dashboard.
- **Real-Time Sync**: Socket.io integration for instant updates when a family member adds a shared expense or goal.

#### 4. Investment & Asset Management
- **Market Data**: Integration with financial APIs for live price fetching of symbols.
- **Portfolio Analytics**: Automatic calculation of current value against purchase price to show Unrealized Gains.

### 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Real-Time:** Socket.io
- **APIs:** Plaid (Banking), Financial Market APIs
- **Authentication:** JWT with standard-compliant Auth Middleware

### 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/money-mentor.git
   ```

2. **Backend Setup:**
   - `cd server`
   - `npm install`
   - Create a `.env` file with: `PORT`, `MONGO_URI`, `JWT_SECRET`, `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`.
   - `npm run dev` (Runs on `http://localhost:5000`)

3. **Frontend Setup:**
   - `cd client`
   - `npm install`
   - `npm run dev` (Runs on `http://localhost:5173`)

### 🤝 Contribution Guidelines

We welcome contributions!
- Fork the repository and create a feature branch.
- Ensure your code follows the premium glassmorphism design tokens in `index.css`.
- Submit a PR with a detailed description of your changes.

---
**Money-Mentor** — *Smart Finance Management for the Modern World.*
Thank you!
