# Project title
Money-Mentor

# Team members with roll numbers
- Karandeep Kaur - 2210991750
- Bama Charan Chandogi - 2210991436
- Aryan Kaushal - 2210991382
- Himanshu Joshi - 2210991660

# Software/platform used
- **Frontend Platform:** Vite
- **Backend Platform:** Node.js
- **Database:** MongoDB
- **Operating System:** Windows/macOS/Linux

# Programming language used
- JavaScript (React.js for frontend, Node.js for backend)

# Steps to run the code
1. **Clone the repository:**
   ```bash
   git clone  https://github.com/BamaCharanChhandogi/Money-Mentor
   ```
2. **Environment Setup:**
   - Navigate to the backend server folder: `cd source_code/server`
   - Create a `.env` file with necessary environment variables (`PORT`, `CLIENT_URL`, `MONGO_URI`, `JWT_SECRET`, `EMAIL`, `EMAIL_PASSWORD`, `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`, `PLAID_PRODUCTS`, `PLAID_COUNTRY_CODE`, `GEMINI_API_KEY`).
3. **Run the Application:**

   **Using the provided scripts (Recommended):**
   - **Windows:** Double-click or run `run.bat` in the root directory.
   - **macOS/Linux:** Run the shell script by executing `bash run.sh` in the terminal.

   **Manual Setup (Alternative):**
   - **Backend:**
     - Navigate to the server folder: `cd source_code/server`
     - Install dependencies: `npm install`
     - Run the server: `npm start` (Runs on `http://localhost:5000`)
   - **Frontend:**
     - Navigate to the client folder: `cd source_code/client`
     - Install dependencies: `npm install`
     - Run the client: `npm run dev` (Runs on `http://localhost:5173`)
4. **Access the application:** Open `http://localhost:5173` in your web browser.

# Required libraries/tools
- **Frontend Libraries:** React.js, Tailwind CSS, Recharts, React Router DOM, React-Redux, Socket.io-client, Axios, Flowbite-React, Lucide-React.
- **Backend Libraries:** Express.js, Mongoose (MongoDB), JSONWebToken (JWT), Bcrypt, Socket.io, Plaid API, Google Generative AI (Gemini).
- **Tools:** npm, Node.js, Git.

# Input and expected output
- **Input:** User financial details such as income, daily expenses, budget limits, linking external bank accounts via Plaid API, and setting financial goals.
- **Expected Output:** An interactive and personalized financial dashboard featuring real-time budget tracking, dynamic financial health scoring, detailed categorized expense reports, investment portfolio updates, and calculated shared family expenses.
