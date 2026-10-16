import dns from 'dns';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://bama:XwBYXCAzmjbUnFz2@cluster0.ksbnq.mongodb.net/test?retryWrites=true&w=majority';
const TARGET_EMAIL = 'rrpb2580@gmail.com';

const seed = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;

    // 1. Find or initialize target user
    let user = await db.collection('users').findOne({ email: TARGET_EMAIL });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    if (!user) {
      console.log('Creating user:', TARGET_EMAIL);
      const insertResult = await db.collection('users').insertOne({
        name: 'Bama Charan',
        email: TARGET_EMAIL,
        password: hashedPassword,
        phone: '+919876543210',
        dateOfBirth: new Date('1996-05-15'),
        occupation: 'Lead Full-Stack Engineer',
        annualIncome: 1800000,
        maritalStatus: 'Married',
        dependents: 2,
        ownHome: true,
        ownCar: true,
        healthConditions: ['Mild Asthma'],
        isVerified: true,
        createdAt: new Date('2024-01-01')
      });
      user = await db.collection('users').findOne({ _id: insertResult.insertedId });
    } else {
      console.log('Updating user profile for:', TARGET_EMAIL);
      await db.collection('users').updateOne(
        { _id: user._id },
        {
          $set: {
            password: hashedPassword,
            name: 'Bama Charan',
            phone: '+919876543210',
            dateOfBirth: new Date('1996-05-15'),
            occupation: 'Lead Full-Stack Engineer',
            annualIncome: 1800000,
            maritalStatus: 'Married',
            dependents: 2,
            ownHome: true,
            ownCar: true,
            healthConditions: ['Mild Asthma'],
            isVerified: true
          }
        }
      );
    }

    const userId = user._id;
    console.log('User ID:', userId.toString());

    // Clean existing seed data for this user to ensure idempotency
    await db.collection('accounts').deleteMany({ userId });
    await db.collection('budgets').deleteMany({ user: userId });
    await db.collection('expenses').deleteMany({ user: userId });
    await db.collection('transactions').deleteMany({ userId });
    await db.collection('investments').deleteMany({ user: userId });
    await db.collection('insurancepolicies').deleteMany({ user: userId });
    await db.collection('familygroups').deleteMany({ owner: userId });
    await db.collection('goals').deleteMany({ $or: [{ 'contributions.user': userId }, { familyGroup: { $exists: true } }] });
    await db.collection('sharedexpenses').deleteMany({ paidBy: userId });

    console.log('Cleaned previous records for clean dataset generation.');

    // 2. Bank Accounts (Depository, Credit, Brokerage)
    const accountsData = [
      {
        userId,
        plaidAccountId: `acc_salary_${Date.now()}_1`,
        accessToken: 'access-sandbox-hdfc-live',
        itemId: 'item-sandbox-hdfc-01',
        institutionId: 'ins_hdfc_01',
        institutionName: 'HDFC Bank',
        accountName: 'HDFC Premium Salary Account',
        accountType: 'depository',
        accountSubtype: 'checking',
        balance: { available: 94500, current: 94500, limit: null },
        lastUpdated: new Date()
      },
      {
        userId,
        plaidAccountId: `acc_savings_${Date.now()}_2`,
        accessToken: 'access-sandbox-icici-live',
        itemId: 'item-sandbox-icici-02',
        institutionId: 'ins_icici_02',
        institutionName: 'ICICI Bank',
        accountName: 'ICICI High-Yield Savings Account',
        accountType: 'depository',
        accountSubtype: 'savings',
        balance: { available: 420000, current: 420000, limit: null },
        lastUpdated: new Date()
      },
      {
        userId,
        plaidAccountId: `acc_credit_healthy_${Date.now()}_3`,
        accessToken: 'access-sandbox-hdfc-cc',
        itemId: 'item-sandbox-hdfc-cc-03',
        institutionId: 'ins_hdfc_01',
        institutionName: 'HDFC Bank',
        accountName: 'HDFC Regalia Gold Credit Card',
        accountType: 'credit',
        accountSubtype: 'credit card',
        balance: { available: 272000, current: 28000, limit: 300000 },
        lastUpdated: new Date()
      },
      {
        userId,
        plaidAccountId: `acc_credit_high_util_${Date.now()}_4`,
        accessToken: 'access-sandbox-axis-cc',
        itemId: 'item-sandbox-axis-cc-04',
        institutionId: 'ins_axis_03',
        institutionName: 'Axis Bank',
        accountName: 'Axis Bank Magnus Rewards Card (High Utilization Edge Case)',
        accountType: 'credit',
        accountSubtype: 'credit card',
        balance: { available: 16500, current: 183500, limit: 200000 },
        lastUpdated: new Date()
      },
      {
        userId,
        plaidAccountId: `acc_zerodha_${Date.now()}_5`,
        accessToken: 'access-sandbox-zerodha',
        itemId: 'item-sandbox-zerodha-05',
        institutionId: 'ins_zerodha_04',
        institutionName: 'Zerodha Broking',
        accountName: 'Zerodha Demat Trading Account',
        accountType: 'investment',
        accountSubtype: 'brokerage',
        balance: { available: 35000, current: 580000, limit: null },
        lastUpdated: new Date()
      }
    ];

    const insertedAccounts = await db.collection('accounts').insertMany(accountsData);
    console.log(`✅ Bank Accounts created: ${insertedAccounts.insertedCount}`);
    const checkingAccId = insertedAccounts.insertedIds[0];

    // 3. Budgets (Monthly & Yearly, Varied Categories)
    const startDateThisMonth = new Date(2026, 9, 1); // Oct 1, 2026
    const budgetsData = [
      { user: userId, category: 'Housing & Rent', amount: 35000, period: 'monthly', startDate: startDateThisMonth },
      { user: userId, category: 'Groceries & Household', amount: 18000, period: 'monthly', startDate: startDateThisMonth },
      { user: userId, category: 'Utilities & Bills', amount: 8000, period: 'monthly', startDate: startDateThisMonth },
      { user: userId, category: 'Transportation & Fuel', amount: 10000, period: 'monthly', startDate: startDateThisMonth },
      { user: userId, category: 'Dining Out & Food Delivery', amount: 9000, period: 'monthly', startDate: startDateThisMonth },
      { user: userId, category: 'Entertainment & Subscriptions', amount: 6000, period: 'monthly', startDate: startDateThisMonth },
      { user: userId, category: 'Shopping & Electronics', amount: 15000, period: 'monthly', startDate: startDateThisMonth },
      { user: userId, category: 'Healthcare & Fitness', amount: 6000, period: 'monthly', startDate: startDateThisMonth },
      { user: userId, category: 'Investments & Savings', amount: 40000, period: 'monthly', startDate: startDateThisMonth },
      { user: userId, category: 'Annual Travel & Vacation', amount: 150000, period: 'yearly', startDate: new Date('2026-01-01') }
    ];

    const insertedBudgets = await db.collection('budgets').insertMany(budgetsData);
    console.log(`✅ Budgets created: ${insertedBudgets.insertedCount}`);

    // 4. Expenses (Spanning past 90 days for robust AI Shadow volatility & forecast detection)
    const expensesList = [];
    const today = new Date('2026-10-16T12:00:00.000Z');

    // Helper to generate dates in past
    const daysAgo = (n) => {
      const d = new Date(today);
      d.setDate(d.getDate() - n);
      return d;
    };

    // Stable Recurring expenses (Low volatility -> triggers isRecurring in AI Shadow)
    for (let m = 0; m < 3; m++) {
      const baseDays = m * 30;
      expensesList.push(
        { user: userId, amount: 35000, category: 'Housing & Rent', date: daysAgo(baseDays + 5), description: 'Monthly Apartment Rent' },
        { user: userId, amount: 2499, category: 'Utilities & Bills', date: daysAgo(baseDays + 7), description: 'Airtel Xstream Fiber Broadband' },
        { user: userId, amount: 3800, category: 'Utilities & Bills', date: daysAgo(baseDays + 10), description: 'Electricity Bill - State Power' },
        { user: userId, amount: 649, category: 'Entertainment & Subscriptions', date: daysAgo(baseDays + 12), description: 'Netflix Premium 4K' },
        { user: userId, amount: 119, category: 'Entertainment & Subscriptions', date: daysAgo(baseDays + 14), description: 'Spotify Individual Premium' },
        { user: userId, amount: 1999, category: 'Healthcare & Fitness', date: daysAgo(baseDays + 15), description: 'Cult.Fit Gym Membership' },
        { user: userId, amount: 25000, category: 'Investments & Savings', date: daysAgo(baseDays + 2), description: 'Nifty 50 Mutual Fund SIP' }
      );
    }

    // Varied daily/weekly living expenses
    const randomExpenses = [
      { d: 1, a: 1850, c: 'Groceries & Household', desc: 'Blinkit Instant Groceries' },
      { d: 2, a: 820, c: 'Dining Out & Food Delivery', desc: 'Swiggy Gourmet Dinner' },
      { d: 3, a: 3400, c: 'Transportation & Fuel', desc: 'HPCL Petrol Full Tank' },
      { d: 4, a: 650, c: 'Dining Out & Food Delivery', desc: 'Starbucks Coffee & Snacks' },
      { d: 6, a: 4200, c: 'Groceries & Household', desc: 'Nature Basket Organic Store' },
      { d: 7, a: 1200, c: 'Dining Out & Food Delivery', desc: 'Zomato Biryani Night' },
      { d: 9, a: 450, c: 'Transportation & Fuel', desc: 'Uber Ride City Center' },
      { d: 11, a: 2200, c: 'Healthcare & Fitness', desc: 'Apollo Pharmacy Medicines' },
      { d: 13, a: 5400, c: 'Groceries & Household', desc: 'DMart Monthly Supermarket Stock' },
      { d: 16, a: 890, c: 'Dining Out & Food Delivery', desc: 'McDonalds Weekend Order' },
      { d: 18, a: 1550, c: 'Groceries & Household', desc: 'Zepto Daily Essentials' },
      { d: 21, a: 3500, c: 'Transportation & Fuel', desc: 'Bharat Petroleum Fuel Refill' },
      { d: 24, a: 3200, c: 'Dining Out & Food Delivery', desc: 'Family Dinner at Barbeque Nation' },
      { d: 27, a: 1450, c: 'Groceries & Household', desc: 'Fresh Fruits & Vegetables Market' },
      { d: 32, a: 6200, c: 'Groceries & Household', desc: 'BigBasket Monthly Pantry' },
      { d: 35, a: 1800, c: 'Transportation & Fuel', desc: 'Ola Outstation Taxi' },
      { d: 42, a: 4800, c: 'Groceries & Household', desc: 'DMart Staples Grocery' },
      { d: 48, a: 950, c: 'Dining Out & Food Delivery', desc: 'Dominos Pizza Party' },
      { d: 55, a: 3600, c: 'Transportation & Fuel', desc: 'Indian Oil Petrol' },
      { d: 62, a: 5100, c: 'Groceries & Household', desc: 'Reliance Smart Supermarket' },
      { d: 75, a: 4300, c: 'Groceries & Household', desc: 'Blinkit Bulk Household Essentials' },
      { d: 82, a: 3300, c: 'Transportation & Fuel', desc: 'HPCL Fuel Refill' }
    ];

    randomExpenses.forEach(e => {
      expensesList.push({
        user: userId,
        amount: e.a,
        category: e.c,
        date: daysAgo(e.d),
        description: e.desc
      });
    });

    // High Volatility & Over-budget Edge Case (Triggers AI Shortfall & Overspending Alert)
    expensesList.push(
      { user: userId, amount: 28500, category: 'Shopping & Electronics', date: daysAgo(4), description: 'Sony WH-1000XM5 Headphones & Mechanical Keyboard (Overbudget)' },
      { user: userId, amount: 14200, category: 'Dining Out & Food Delivery', date: daysAgo(8), description: 'Team Fine-Dining Treat & Cocktail Bar' },
      { user: userId, amount: 18500, category: 'Transportation & Fuel', date: daysAgo(22), description: 'Major Car Service & Brake Pad Replacement' }
    );

    const insertedExpenses = await db.collection('expenses').insertMany(expensesList);
    console.log(`✅ Expenses created: ${insertedExpenses.insertedCount} (spanning 90 days with low & high volatility edge cases)`);

    // 5. Transactions (Comprehensive Ledger with Incomes, Charges, Categories, & Pending)
    const transactionsList = [
      // Incomes
      {
        accountId: checkingAccId,
        userId,
        plaidTransactionId: `tx_sal_oct_${Date.now()}`,
        amount: -145000, // Inflow (Negative in standard accounting / Plaid credit)
        date: daysAgo(15),
        name: 'Salary Credit - Oct 2026',
        merchantName: 'TechCorp International Services',
        category: ['Income', 'Payroll'],
        pending: false,
        paymentChannel: 'ACH'
      },
      {
        accountId: checkingAccId,
        userId,
        plaidTransactionId: `tx_sal_sep_${Date.now()}`,
        amount: -145000,
        date: daysAgo(45),
        name: 'Salary Credit - Sep 2026',
        merchantName: 'TechCorp International Services',
        category: ['Income', 'Payroll'],
        pending: false,
        paymentChannel: 'ACH'
      },
      {
        accountId: checkingAccId,
        userId,
        plaidTransactionId: `tx_sal_aug_${Date.now()}`,
        amount: -145000,
        date: daysAgo(75),
        name: 'Salary Credit - Aug 2026',
        merchantName: 'TechCorp International Services',
        category: ['Income', 'Payroll'],
        pending: false,
        paymentChannel: 'ACH'
      },
      {
        accountId: checkingAccId,
        userId,
        plaidTransactionId: `tx_freelance_${Date.now()}`,
        amount: -32000,
        date: daysAgo(10),
        name: 'Consulting Honorarium Payment',
        merchantName: 'Global FinTech Advisory',
        category: ['Income', 'Consulting & Freelance'],
        pending: false,
        paymentChannel: 'Wire Transfer'
      },
      {
        accountId: checkingAccId,
        userId,
        plaidTransactionId: `tx_div_${Date.now()}`,
        amount: -4500,
        date: daysAgo(20),
        name: 'Quarterly Stock Dividend Credit',
        merchantName: 'TCS Share Dividend',
        category: ['Income', 'Dividends'],
        pending: false,
        paymentChannel: 'Direct Deposit'
      },
      // Outflows & Purchases
      {
        accountId: checkingAccId,
        userId,
        plaidTransactionId: `tx_rent_${Date.now()}`,
        amount: 35000,
        date: daysAgo(11),
        name: 'Apartment Monthly Rent Transfer',
        merchantName: 'Godrej City Living',
        category: ['Housing', 'Rent'],
        pending: false,
        paymentChannel: 'UPI'
      },
      {
        accountId: checkingAccId,
        userId,
        plaidTransactionId: `tx_pending_gadget_${Date.now()}`,
        amount: 28500,
        date: daysAgo(1),
        name: 'Croma Electronics - Noise Cancelling Headphones',
        merchantName: 'Croma Megastore',
        category: ['Shopping', 'Electronics'],
        pending: true, // Edge case: Pending transaction
        paymentChannel: 'Credit Card'
      },
      {
        accountId: checkingAccId,
        userId,
        plaidTransactionId: `tx_blinkit_${Date.now()}`,
        amount: 1850,
        date: daysAgo(1),
        name: 'Blinkit Instant Delivery',
        merchantName: 'Blinkit Commerce',
        category: ['Food & Drink', 'Groceries'],
        pending: false,
        paymentChannel: 'UPI'
      },
      {
        accountId: checkingAccId,
        userId,
        plaidTransactionId: `tx_swiggy_${Date.now()}`,
        amount: 820,
        date: daysAgo(2),
        name: 'Swiggy Gourmet Order',
        merchantName: 'Swiggy Online',
        category: ['Food & Drink', 'Restaurants'],
        pending: false,
        paymentChannel: 'UPI'
      },
      {
        accountId: checkingAccId,
        userId,
        plaidTransactionId: `tx_fuel_${Date.now()}`,
        amount: 3400,
        date: daysAgo(3),
        name: 'HPCL Auto Fuel Pump',
        merchantName: 'Hindustan Petroleum',
        category: ['Travel', 'Gasoline'],
        pending: false,
        paymentChannel: 'POS'
      },
      {
        accountId: checkingAccId,
        userId,
        plaidTransactionId: `tx_netflix_${Date.now()}`,
        amount: 649,
        date: daysAgo(12),
        name: 'Netflix Subscription Recurring',
        merchantName: 'Netflix India',
        category: ['Service', 'Entertainment'],
        pending: false,
        paymentChannel: 'Auto Debit'
      },
      {
        accountId: checkingAccId,
        userId,
        plaidTransactionId: `tx_apple_foreign_${Date.now()}`,
        amount: 1899,
        date: daysAgo(18),
        name: 'Apple Services & iCloud+ 2TB Family',
        merchantName: 'Apple Distribution International',
        category: ['Service', 'Cloud Services'],
        pending: false,
        paymentChannel: 'Online Credit'
      },
      {
        accountId: checkingAccId,
        userId,
        plaidTransactionId: `tx_sip_${Date.now()}`,
        amount: 25000,
        date: daysAgo(14),
        name: 'SIP Autopay - Mutual Fund Direct',
        merchantName: 'Nippon India Mutual Fund',
        category: ['Financial', 'Investments'],
        pending: false,
        paymentChannel: 'NACH Mandate'
      }
    ];

    const insertedTransactions = await db.collection('transactions').insertMany(transactionsList);
    console.log(`✅ Transactions created: ${insertedTransactions.insertedCount}`);

    // 6. Investments (Diverse Portfolio with Profits, Losses, Crypto, & Real Estate)
    const investmentsList = [
      {
        user: userId,
        symbol: 'TCS.NS',
        name: 'Tata Consultancy Services Ltd',
        type: 'stock',
        quantity: 50,
        purchasePrice: 3250,
        purchaseDate: new Date('2023-08-15'),
        currentPrice: 4120, // Huge gain (+26.7%)
        lastUpdated: new Date(),
        marketData: { marketCap: 1480000, peRatio: 30.5, dividendYield: 1.8, fiftyTwoWeekHigh: 4585, fiftyTwoWeekLow: 3312 },
        notes: ['Long-term blue chip tech anchor holding']
      },
      {
        user: userId,
        symbol: 'PAYTM.NS',
        name: 'One97 Communications Ltd (Loss Edge Case)',
        type: 'stock',
        quantity: 120,
        purchasePrice: 840,
        purchaseDate: new Date('2023-11-20'),
        currentPrice: 415, // Severe drop (-50.6% edge case)
        lastUpdated: new Date(),
        marketData: { marketCap: 26000, peRatio: null, dividendYield: 0, fiftyTwoWeekHigh: 998, fiftyTwoWeekLow: 310 },
        notes: ['Tracking recovery or tax-loss harvesting candidate']
      },
      {
        user: userId,
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        type: 'stock',
        quantity: 25,
        purchasePrice: 105,
        purchaseDate: new Date('2024-03-10'),
        currentPrice: 138, // High growth (+31.4%)
        lastUpdated: new Date(),
        marketData: { marketCap: 3400000, peRatio: 64.2, dividendYield: 0.03, fiftyTwoWeekHigh: 140.76, fiftyTwoWeekLow: 39.23 },
        notes: ['AI semiconductor leadership play']
      },
      {
        user: userId,
        symbol: 'NIFTYBEES.NS',
        name: 'Nippon India ETF Nifty 50 BeES',
        type: 'etf',
        quantity: 500,
        purchasePrice: 228,
        purchaseDate: new Date('2023-05-12'),
        currentPrice: 284,
        lastUpdated: new Date(),
        marketData: { marketCap: 22500, peRatio: 23.4, dividendYield: 1.2, fiftyTwoWeekHigh: 295, fiftyTwoWeekLow: 215 },
        notes: ['Core index passive compounding']
      },
      {
        user: userId,
        symbol: 'BTC-USD',
        name: 'Bitcoin (High Volatility Crypto Edge Case)',
        type: 'crypto',
        quantity: 0.35,
        purchasePrice: 48500,
        purchaseDate: new Date('2024-01-22'),
        currentPrice: 67800, // High return +39.8%
        lastUpdated: new Date(),
        marketData: { marketCap: 1340000, peRatio: null, dividendYield: 0, fiftyTwoWeekHigh: 73750, fiftyTwoWeekLow: 26500 },
        notes: ['Digital store of value allocation (<5% total portfolio)']
      },
      {
        user: userId,
        symbol: 'EMBASSY.REIT',
        name: 'Embassy Office Parks REIT',
        type: 'real_estate',
        quantity: 400,
        purchasePrice: 320,
        purchaseDate: new Date('2023-09-01'),
        currentPrice: 375,
        lastUpdated: new Date(),
        marketData: { marketCap: 35500, peRatio: 18.2, dividendYield: 6.8, fiftyTwoWeekHigh: 392, fiftyTwoWeekLow: 298 },
        notes: ['Quarterly cash distribution commercial real estate asset']
      }
    ];

    const insertedInvestments = await db.collection('investments').insertMany(investmentsList);
    console.log(`✅ Investments created: ${insertedInvestments.insertedCount} (Stocks, ETF, REIT, Crypto, Gainers & Losers)`);

    // 7. Insurance Policies (Health, Term, Auto, & Expiring Soon Edge Case)
    const insuranceList = [
      {
        user: userId,
        type: 'health',
        provider: 'HDFC ERGO Health Insurance',
        policyNumber: 'POL-HDFC-HLTH-882910',
        coverageAmount: 1500000,
        premium: 19400,
        startDate: new Date('2026-01-15'),
        endDate: new Date('2027-01-14'), // Active
        beneficiaries: [{ name: 'Spouse & Dependents', relationship: 'Family Floater' }]
      },
      {
        user: userId,
        type: 'life',
        provider: 'Tata AIA Life Insurance',
        policyNumber: 'POL-TATA-TERM-440219',
        coverageAmount: 20000000, // 2 Crore term cover
        premium: 24500,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2054-05-31'), // 30 year cover
        beneficiaries: [{ name: 'Primary Nominee', relationship: 'Spouse' }]
      },
      {
        user: userId,
        type: 'auto',
        provider: 'Bajaj Allianz General Insurance',
        policyNumber: 'POL-BAJAJ-CAR-771890',
        coverageAmount: 950000,
        premium: 14200,
        startDate: new Date('2026-03-10'),
        endDate: new Date('2027-03-09'),
        beneficiaries: [{ name: 'Self', relationship: 'Owner Driver' }]
      },
      {
        user: userId,
        type: 'property',
        provider: 'Acko Gadget & Appliance Cover (Expiring Soon Edge Case)',
        policyNumber: 'POL-ACKO-EXP-110294',
        coverageAmount: 150000,
        premium: 2200,
        startDate: new Date('2025-10-25'),
        endDate: new Date('2026-10-25'), // Expiring in ~9 days! Triggers renewal warning
        beneficiaries: [{ name: 'Self', relationship: 'Policyholder' }]
      }
    ];

    const insertedInsurance = await db.collection('insurancepolicies').insertMany(insuranceList);
    console.log(`✅ Insurance Policies created: ${insertedInsurance.insertedCount} (including an expiring renewal alert edge case)`);

    // 8. Family Group, Shared Goals & Split Expenses
    const familyGroup = {
      name: 'Chhandogi Household',
      owner: userId,
      members: [
        { user: userId, role: 'owner', status: 'active', joinedAt: new Date('2024-01-01') }
      ],
      invitations: [
        {
          email: 'bamachhandogi@gmail.com',
          token: 'inv_token_bama_demo_secure_2026',
          status: 'pending',
          expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const insertedFamily = await db.collection('familygroups').insertOne(familyGroup);
    const familyGroupId = insertedFamily.insertedId;
    console.log(`✅ Family Group created: ${familyGroup.name} (ID: ${familyGroupId.toString()})`);

    // Financial Goals linked to Household
    const goalsList = [
      {
        name: 'Emergency Reserve Fund (6 Months Expenses)',
        targetAmount: 500000,
        currentAmount: 375000, // 75% completed
        familyGroup: familyGroupId,
        deadline: new Date('2026-12-31'),
        status: 'in_progress',
        icon: 'Shield',
        contributions: [
          { user: userId, amount: 250000, date: daysAgo(60) },
          { user: userId, amount: 75000, date: daysAgo(30) },
          { user: userId, amount: 50000, date: daysAgo(5) }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Annual Family Vacation to Japan',
        targetAmount: 280000,
        currentAmount: 260000, // 92.8% completed (almost done)
        familyGroup: familyGroupId,
        deadline: new Date('2026-11-20'),
        status: 'in_progress',
        icon: 'Plane',
        contributions: [
          { user: userId, amount: 160000, date: daysAgo(50) },
          { user: userId, amount: 100000, date: daysAgo(15) }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Home Office Standing Desk & Ergonomic Setup',
        targetAmount: 65000,
        currentAmount: 65000, // 100% completed edge case
        familyGroup: familyGroupId,
        deadline: new Date('2026-09-30'),
        status: 'completed',
        icon: 'CheckCircle',
        contributions: [
          { user: userId, amount: 65000, date: daysAgo(25) }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Electric SUV Down Payment (Zero Progress Edge Case)',
        targetAmount: 600000,
        currentAmount: 0, // 0% progress edge case
        familyGroup: familyGroupId,
        deadline: new Date('2027-08-31'),
        status: 'in_progress',
        icon: 'Car',
        contributions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const insertedGoals = await db.collection('goals').insertMany(goalsList);
    console.log(`✅ Financial Goals created: ${insertedGoals.insertedCount} (in-progress, almost-done, completed, & zero-progress edge cases)`);

    // Shared Family Expenses
    const sharedExpensesList = [
      {
        familyGroup: familyGroupId,
        paidBy: userId,
        description: 'Society Monthly Maintenance & Club Charges',
        amount: 8500,
        date: daysAgo(6),
        category: 'Housing',
        splitMethod: 'equal',
        shares: [
          { user: userId, amount: 4250, settled: true },
          { user: null, email: 'bamachhandogi@gmail.com', amount: 4250, settled: false }
        ],
        createdAt: new Date()
      },
      {
        familyGroup: familyGroupId,
        paidBy: userId,
        description: 'Nature Basket Organic Bulk Household Groceries',
        amount: 11400,
        date: daysAgo(14),
        category: 'Groceries',
        splitMethod: 'equal',
        shares: [
          { user: userId, amount: 5700, settled: true },
          { user: null, email: 'bamachhandogi@gmail.com', amount: 5700, settled: true }
        ],
        createdAt: new Date()
      }
    ];

    const insertedShared = await db.collection('sharedexpenses').insertMany(sharedExpensesList);
    console.log(`✅ Shared Family Expenses created: ${insertedShared.insertedCount}`);

    console.log('\n======================================================');
    console.log('🎉 FULL DATASET SEEDED SUCCESSFULLY FOR:', TARGET_EMAIL);
    console.log('======================================================\n');

    await mongoose.disconnect();
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seed();
