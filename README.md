🍽️ Bachelor Hostel Meal Management System (BHMMS)

BHMMS · Final Project — Team 62

BHMMS is a web-based hostel meal management system for meal tracking, expense management, payment tracking, automatic meal-rate calculation, member management, balance calculation, reporting, and subscription management. The system is designed so that hostel operations can be managed digitally instead of using notebooks, spreadsheets, and message groups.


## 🌐 Live Website

**Live Website:**  
https://bhmms-project-62.vercel.app/

**GitHub Repository:**  
https://github.com/jayedurrahman/Software-project-62

---

## 1. Main Features

- Email and password login
- Role-based access for Admin, Manager, and Member
- Meal Management and Meal History
- Expense Management
- Payment Management
- Member Management
- Automatic meal-rate calculation
- Member balance calculation
- Monthly Reports
- Paddle Sandbox subscription
- Monthly and Yearly plans
- Profile management

---

## 2. Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Routing:** React Router
- **Backend:** Supabase
- **Database:** PostgreSQL
- **Authentication:** Supabase Authentication
- **Serverless Logic:** Supabase Edge Functions
- **Forms:** React Hook Form, Zod
- **Charts:** Recharts
- **Subscription:** Paddle / Paddle.js
- **Deployment:** Vercel

---

## 3. How to Access the Live Website

1. Open a modern web browser.
2. Go to:  
   https://bhmms-project-62.vercel.app/
3. Enter a registered email and password.
4. Click **Sign In**.
5. After login, the dashboard will open according to the user's role.

An active internet connection is required.

---

## 4. Supported Browsers

The application is intended for current stable versions of:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

Google Chrome or Microsoft Edge is recommended for the project demonstration.

---

## 5. Step-by-Step User Manual

### Login
1. Open the website.
2. Enter email and password.
3. Click **Sign In**.

### Dashboard
Shows monthly information such as:
- Meal rate
- Total meals
- Meal cost
- Payments
- Balance
- Total bazar cost

### Meal Management
1. Open **Meal Management**.
2. Select a date.
3. Set lunch and dinner meal counts.
4. Save the entry.

### Meal History
Open **Meal History** to review previous meal records.

### Expenses
Admin/Manager users can:
1. Open **Expenses**.
2. Select a category.
3. Enter the amount.
4. Save the expense.

### Payments
Admin/Manager users can:
1. Open **Payments**.
2. Select a member.
3. Enter the payment amount.
4. Save the payment.

### Members
Admin users can:
- View members
- Add or update member information
- Assign roles
- Update member status

### Reports
Open **Reports** to view:
- Total meals
- Meal rate
- Meal cost
- Collected amount
- Expenses
- Member payments
- Member balances

---

## 6. Meal Rate Calculation

```text
Meal Rate = Total Bazar Cost / Total Number of Meals

Member Meal Cost = Member Total Meals × Meal Rate

7. Subscription
The project uses Paddle Sandbox for subscription testing.
Available plans:
- Monthly: $20/month
- Yearly: $200/year
Subscription Flow
1. Open Subscription.
2. Select Monthly or Yearly.
3. The application uses the corresponding Paddle Price ID.
4. Paddle.js opens the Sandbox checkout.
5. Test checkout can be completed without charging real money.
The Paddle client-side token is referenced through:
VITE_PAYMENTS_CLIENT_TOKEN

8. Local Installation
Required Software
- Node.js
- npm
- Git
- Modern web browser
Steps
git clone https://github.com/jayedurrahman/Software-project-62

cd Software-project-62

npm install

Configure the required environment variables, including:
VITE_PAYMENTS_CLIENT_TOKEN

Start the project:
npm run dev

Production build:
npm run build

Preview build:
npm run preview

9. Testing
The project contains configuration for:
- Vitest
- Playwright
- Testing Library
Manual Testing Checklist
1. Login
2. Check Dashboard
3. Add/update meal data
4. Check Meal History
5. Add Expense
6. Add Payment
7. Check Reports
8. Check Member Management
9. Open Subscription
10. Verify Paddle Sandbox checkout
11. Open Profile
12. Sign Out


10. Team Members
Team 62
- Md. Tanvir Ahammed
- Jayedur Rahman
- Nasim Parvez
- Mahbubur Rahman Sakib
- Nousad Ahammed
Submitted to:
[MNAR] Namirah Rasul
Lecturer, Southeast University


11. Important Links
GitHub Repository:
https://github.com/jayedurrahman/Software-project-62
Live Website:
https://bhmms-project-62.vercel.app/