🍽️ Bachelor Hostel Meal Management System (BHMMS)

BHMMS · Final Project — Team 62

BHMMS is a web-based hostel meal management system for meal tracking, expense management, payment tracking, automatic meal-rate calculation, member management, balance calculation, reporting, and subscription management. The system is designed so that hostel operations can be managed digitally instead of using notebooks, spreadsheets, and message groups.
Live Website: https://bhmms-project-62.vercel.app/

GitHub Repository:

1. Project Overview
The system digitizes the main activities of a bachelor hostel or shared mess. Users can record meals, view meal history, record expenses and payments, calculate the monthly meal rate, review balances, manage members according to role, generate reports, and access subscription features.
The main workflow is:
Meal Entry → Expense Entry → Payment Entry → Automatic Calculation → Balance & Reports
The application uses role-based access for Hostel Admin / Manager and Member users. Access to pages and actions depends on the logged-in user’s assigned role.


2. Implemented Features
🔐 Authentication and Access Control
- Email and password login
- Secure session handling through Supabase Authentication
- Role-based access control for Admin, Manager, and Member users
- User roles are maintained in the application and used by database access-control logic
- Restricted access for users whose account or subscription state does not allow normal access
🏠 Hostel Admin / Manager
- View dashboard summary
- Manage meal records
- View meal history
- Record hostel expenses
- Record member payments
- View reports
- Manage members (Admin)
- Configure meal-related controls available to the Admin role
- Access the Subscription page (Admin)
👤 Members
- Log in using registered credentials
- Mark lunch and dinner meal counts
- View personal meal information
- View meal history
- View dashboard balance and meal-related summary
- Edit meal information within the configured deadline
- View profile information
📊 Reports and Calculations
- Automatic meal-rate calculation
- Member meal cost calculation
- Payment and balance tracking
- Monthly reports
- Expense summaries
- Member-wise meal, payment, cost, and balance information
- Charts using Recharts

💳 Subscription Integration
- Paddle Sandbox integration
- Monthly subscription plan: $20/month
- Yearly subscription plan: $200/year
- Paddle.js client-side checkout
- Separate Paddle Price IDs for Monthly and Yearly plans
- Subscription checkout can be demonstrated in Paddle Test Mode without charging real money


3. Core Workflow
1. Login — the user signs in using a registered email address and password.
2. Meal Entry — lunch and dinner meal counts are recorded.
3. Expense Entry — hostel expenses are recorded by authorized users.
4. Payment Entry — member payments are recorded.
5. Automatic Calculation — meal rate and member meal costs are calculated from stored data.
6. Balance Calculation — member due or advance balance is determined.
7. Reports — Admin/Manager users can review monthly summaries and charts.
8. Subscription — Admin users can open the subscription page and use Paddle Sandbox checkout.

4. Technology Stack
Layer	Technologies Used
Frontend	React 18, TypeScript, Vite, Tailwind CSS
Routing	React Router
UI Components	shadcn/ui, Radix UI, Lucide React
Forms & Validation	React Hook Form, Zod
Data / State	TanStack React Query
Backend Services	Supabase
Authentication	Supabase Authentication
Database	PostgreSQL through Supabase
Serverless Logic	Supabase Edge Functions
Charts	Recharts
Payments / Subscription	Paddle, Paddle.js, Paddle Sandbox
Testing Setup	Vitest, Playwright, Testing Library


5. Live Website Access
The project is deployed as a live web application.
Live Website: https://bhmms-project-62.vercel.app/
Steps to Access the Website
1. Open a supported web browser.
2. Go to: https://bhmms-project-62.vercel.app/
3. If not already authenticated, the application will show the login page.
4. Enter a registered email address and password.
5. Click Sign In.
6. After successful authentication, the user is redirected to the appropriate dashboard based on role.
An active internet connection is required because the application communicates with Supabase and Paddle services.
6. Browser Compatibility
The project is a modern React/Vite web application and is intended for current JavaScript-enabled browsers.
Recommended Browsers
- Google Chrome — current stable release
- Microsoft Edge — current stable release
- Mozilla Firefox — current stable release
For the project presentation, Google Chrome or Microsoft Edge is recommended.
Browser version note: The project does not define a fixed minimum browser version in its repository configuration. Therefore, the README documents support for current stable browser versions rather than claiming an unverified minimum version number.


7. Local Installation Guide
The project can also be run locally for development or demonstration.
Required Software
- Node.js
- npm
- Git (if cloning from GitHub)
- A modern browser such as Chrome, Edge, or Firefox
Node.js version note: The project’s package.json does not pin a specific Node.js version. Use a current Node.js LTS release for local setup.

Step 1 — Clone the Repository
git clone YOUR_GITHUB_REPOSITORY_LINK
If Git is not used, download the project ZIP from GitHub and extract it.
Step 2 — Open the Project Folder
cd bhmms-fixed
Step 3 — Install Dependencies
npm install
Step 4 — Configure Environment Variables
The project uses environment variables for external services such as Supabase and Paddle.
For Paddle client-side checkout, the project uses:
VITE_PAYMENTS_CLIENT_TOKEN
Use the appropriate Paddle client-side token for the selected environment. For Sandbox testing, the token begins with test_.
Step 5 — Start the Development Server
npm run dev
Vite will display the local URL in the terminal, commonly similar to:
http://localhost:5173
Open the displayed URL in a browser.
Step 6 — Production Build
npm run build
Step 7 — Preview the Production Build
npm run preview

8. Step-by-Step User Manual
8.1 Login
1. Open the website.
2. Enter the registered email address.
3. Enter the password.
4. Click Sign In.
5. The system redirects the user based on the assigned role.

8.2 Dashboard
After login, open Dashboard from the sidebar.
The dashboard displays the available monthly summary, which may include:
- Meal rate
- Total meals
- Meal cost
- Meal payment
- User balance
- Total hostel meals
- Lunch and dinner counts
- Total bazar cost
- Member summary
Displayed information depends on the logged-in user’s role and available data.

8.3 Meal Management
1. Open Meal Management from the sidebar.
2. Select the required date.
3. Set the lunch meal count.
4. Set the dinner meal count.
5. Save the meal entry.
Members can edit meal data only within the allowed meal-editing deadline. Admin/Manager users have additional meal-management permissions.

8.4 Meal History
1. Open Meal History.
2. Select or review the required month/date.
3. Check previous lunch and dinner records.

8.5 Expense Management
Available to authorized Admin/Manager users.
1. Open Expenses.
2. Select the expense category.
3. Enter the amount.
4. Select the appropriate date/month.
5. Save the expense.
Expense data is used in monthly calculations and reports.

8.6 Payment Management
Available to authorized Admin/Manager users.
1. Open Payments.
2. Select the member.
3. Select the payment type.
4. Enter the payment amount.
5. Save the payment.
Recorded payments are used in member balance calculations.

8.7 Member Management
Available to Admin users.
1. Open Members.
2. View existing hostel members.
3. Add or update member information.
4. Assign the required role where permitted.
5. Update member status when necessary.

8.8 Reports

1. Open Reports.
2. Select the required month.
3. Review the generated summary.
The report section may display:
- Total meals
- Meal rate
- Total meal cost
- Total collected amount
- Expenses by category
- Member meals
- Member payments
- Member cost
- Member balance
- Charts and visual summaries

8.9 Subscription
The Subscription page is available to Admin users.
The project uses Paddle Sandbox for subscription testing.
Available plans:
- Monthly: $20/month
- Yearly: $200/year
Subscription Steps
1. Open Subscription.
2. Choose the Monthly or Yearly plan.
3. The application selects the corresponding Paddle Price ID.
4. Paddle.js opens the Paddle Sandbox checkout.
5. Complete the checkout using Paddle Test Mode.
6. Because Sandbox is used, no real payment is charged during the demonstration.
8.10 Profile
1. Open My Profile.
2. Review the logged-in user’s profile information.
8.11 Sign Out
1. Use the Sign Out option in the application.
2. The active session is ended and the user returns to the authentication flow.
9. Paddle Subscription API Integration
The project integrates Paddle for subscription checkout.
How the Integration Works
1. Paddle.js is initialized using a Paddle client-side token.
2. The application keeps separate Paddle Price IDs for Monthly and Yearly plans.
3. When an Admin selects a plan, the selected Price ID is passed to Paddle checkout.
4. Paddle.Checkout.open() opens the real Paddle Sandbox checkout interface.
5. Sandbox mode allows the payment flow to be demonstrated without a real charge.


10. Main Application Routes
The project includes routes such as:
/login
/dashboard
/meals
/meal-history
/payments
/expenses
/members
/reports
/subscription
/profile
Access to individual routes depends on the logged-in user’s role.
11. Project Structure
Important project directories include:
src/
├── components/
├── contexts/
├── hooks/
├── integrations/
├── lib/
├── pages/
├── test/
└── types/

supabase/
├── functions/
└── migrations/
The Paddle integration logic is maintained in the project’s Paddle-related frontend code, including src/lib/paddle.ts in the current project structure.
12. Testing and Verification
The repository contains testing configuration for Vitest and Playwright.
Current documentation should distinguish configured test tooling from manually verified application flows.
Manual Functional Testing Checklist
1. Open the live website.
2. Sign in with a valid account.
3. Verify that Dashboard loads.
4. Open Meal Management and save meal data.
5. Open Meal History and review stored data.
6. Add an expense as an authorized user.
7. Add a payment as an authorized user.
8. Open Reports and review calculated totals.
9. Open Members as Admin and review member management.
10. Open Subscription.
11. Select a Monthly or Yearly plan.
12. Verify that Paddle Sandbox checkout opens.
13. Open My Profile.
14. Sign out.

Testing Tools in the Project
- Vitest — unit-testing setup
- Playwright — end-to-end testing setup
- Testing Library — React component testing support
13. Known Requirements and Limitations
Requirements

- Active internet connection
- Valid user account for protected pages
- Supabase service availability
- Paddle service availability for subscription checkout
- JavaScript-enabled browser
Current Limitations / Future Scope
- Offline-first support is not implemented
- More advanced long-term analytics can be added later
- A native mobile application is not included in the current project
- Additional automated test coverage can be added in future development
14. Team and Submission
Team 62
- Md. Tanvir Ahammed
- Jayedur Rahman
- Nasim Parvez
- Mahbubur Rahman Sakib
- Nousad Ahammed

Project Duration: 25 July – 20 September
Submitted to: [MNAR] Namirah Rasul, Lecturer at Southeast University

15. Important Links
GitHub Repository
PASTE_YOUR_GITHUB_REPOSITORY_LINK_HERE
Live Website
https://bhmms-project-62.vercel.app/
Presentation Requirement
The final page/slide of the presentation should also include:
GitHub Repository: PASTE_YOUR_GITHUB_REPOSITORY_LINK_HERE
