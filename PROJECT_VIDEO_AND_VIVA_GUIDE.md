# Ravenhall Project Video Guide and Viva Preparation

This document explains the Ravenhall Indoor Cricket Centre frontend in simple language. It is designed for two purposes:

1. A video guide script that explains the major technologies and main flows.
2. Viva question and answers in layman terms.

The project is a Next.js frontend for an indoor cricket lane booking system. Customers can browse lanes, book a time slot, pay online, buy memberships, and view their bookings. Admin users can manage bookings, lanes, slots, users, reports, discounts, and memberships.

---

## 1. Project Summary in Simple Words

Ravenhall is an online booking system for an indoor cricket centre.

The customer side is like a normal booking website:

- A user visits the site.
- They see available cricket lanes.
- They choose a lane, date, time, and duration.
- They review the price.
- They pay securely using Stripe.
- After payment, they receive a booking confirmation and QR code.

The admin side is like a control panel for staff:

- Admin can view dashboard statistics.
- Admin can manage bookings.
- Admin can manage lanes and slots.
- Admin can view users and reports.
- Admin can manage discount codes and memberships.

---

## 2. Major Technologies Used

### Next.js

Next.js is the main framework used in this project. It is built on top of React.

In simple words, React helps us build reusable screen parts, and Next.js gives us the full app structure around React, such as routing, layouts, protected pages, and better performance.

This project uses the Next.js App Router. That means pages are created using folders inside the `app` directory.

Examples:

- `/` comes from the landing home page.
- `/lanes` shows available lanes.
- `/lanes/[id]` shows the booking flow for one lane.
- `/auth` is customer login.
- `/panel` is the customer dashboard.
- `/admin/auth` is admin login.
- `/admin` is the admin dashboard.

### React

React is used to build the user interface using components.

For example, the booking flow is split into small components:

- Step 1: Select date and slot.
- Step 2: Review booking and price.
- Step 3: Payment.

This makes the code easier to understand, reuse, and maintain.

### TypeScript

TypeScript is used instead of plain JavaScript so that data types are clearer.

In simple words, TypeScript helps catch mistakes before running the project. For example, if a booking needs a `laneId`, `slotId`, and `date`, TypeScript helps make sure those values are passed correctly.

### Tailwind CSS

Tailwind CSS is used for styling.

Instead of writing a lot of separate CSS files, Tailwind lets us apply styles directly using utility classes. This helps build pages faster and keeps styling consistent.

### shadcn/ui and Radix UI

These are used for ready-made UI building blocks like buttons, forms, dialogs, sidebars, tables, tabs, inputs, and dropdowns.

In simple words, they save time and help the app look professional.

### TanStack React Query

React Query is used to fetch, cache, and refresh data from the backend.

In simple words, it helps the frontend ask the backend for data and remember the result for a short time. This makes the app faster and avoids unnecessary API calls.

Examples:

- Fetch lanes.
- Fetch bookings.
- Fetch dashboard data.
- Refresh data after creating or cancelling a booking.

### Axios

Axios is used to communicate with the backend API.

In simple words, Axios is the messenger between frontend and backend. When the frontend needs login, lanes, bookings, or payment details, Axios sends the request to the backend.

### Stripe

Stripe is used for online payments.

The project uses Stripe Payment Element. The frontend does not directly handle card details. Stripe safely collects and processes payment information.

### React Hook Form and Zod

React Hook Form is used to manage forms.

Zod is used to validate form data.

In simple words, before sending login or registration data to the backend, the frontend checks whether required fields are filled properly.

### Recharts

Recharts is used for charts in dashboards and reports.

For example, admin can see revenue trends and statistics visually.

### Lucide Icons

Lucide React is used for icons like calendar, users, dashboard, payment lock, and settings.

### Sonner

Sonner is used to show toast messages.

Example:

- "Booking created successfully"
- "Payment failed"
- "Login successful"

---

## 3. Project Folder Structure

The important folders are:

### `app`

This contains pages and routes.

Main route groups:

- `app/(customer)/(landing)` contains public customer pages like home, lanes, about, and membership.
- `app/(customer)/panel` contains the logged-in customer dashboard.
- `app/(customer)/auth` contains customer login, register, forgot password, reset password, and verify email pages.
- `app/admin/auth` contains admin login and auth pages.
- `app/admin/(layout)` contains admin dashboard and management pages.
- `app/payment/success` contains the booking payment success page.

### `components`

This contains reusable UI parts.

Examples:

- Auth screen components.
- Booking card components.
- Landing page sections.
- Modal components.
- Sidebar components.
- UI components like button, input, table, dialog, and tabs.

### `services`

This contains API communication logic.

Important parts:

- `services/api/client.ts`: central Axios setup.
- `services/api/auth.ts`: login, register, logout, password reset, and user profile API calls.
- `services/queries`: data fetching with React Query.
- `services/mutations`: create, update, delete, login, payment, and booking actions.
- `services/auth/token-store.ts`: stores and clears authentication tokens.

### `schemas`

This contains form validation rules using Zod.

### `types`

This contains TypeScript types for API responses and project data.

---

## 4. How Routing Works

This project uses Next.js file-based routing.

In simple words, the folder structure decides the website URL.

Example:

- `app/(customer)/(landing)/(home)/page.tsx` becomes the home page.
- `app/(customer)/(landing)/lanes/page.tsx` becomes `/lanes`.
- `app/(customer)/(landing)/lanes/[id]/page.tsx` becomes `/lanes/some-lane-id`.
- `app/(customer)/panel/bookings/page.tsx` becomes `/panel/bookings`.
- `app/admin/(layout)/bookings/page.tsx` becomes `/admin/bookings`.

The `[id]` folder means dynamic routing. It is used when the page depends on an ID.

Example:

When a user opens `/lanes/123`, Next.js treats `123` as the lane ID. The app then fetches details for that lane.

---

## 5. How Login Works

There are two login areas:

- Customer login: `/auth`
- Admin login: `/admin/auth`

Both use the same reusable auth screen, but the role is different.

### Customer Login Flow

1. Customer enters email and password.
2. Frontend validates the form.
3. Frontend sends login request to `/auth/login`.
4. Backend checks the email and password.
5. If correct, backend returns user data and tokens.
6. Frontend stores the access token and role.
7. Customer is redirected to `/panel`.

### Admin Login Flow

1. Admin enters email and password at `/admin/auth`.
2. Frontend sends login request to the backend.
3. Backend returns the logged-in user.
4. Frontend checks if the role is `admin`.
5. If the user is admin, they go to `/admin`.
6. If the user is not admin, the app shows an error.

### Token Storage

The project stores authentication tokens in local storage and cookies.

Simple explanation:

- Token is like a digital pass.
- After login, the frontend keeps this pass.
- Every protected API request sends this pass to prove the user is logged in.

### Route Protection

The `proxy.ts` file protects admin and customer panel routes.

Simple explanation:

- If there is no token, the user is sent to login.
- If a customer tries to open admin pages, they are sent to the customer panel.
- If an admin tries to open customer panel pages, they are sent to admin dashboard.

---

## 6. User and Admin Features

### Customer Features

Customer can:

- View landing page.
- Browse lanes.
- Select a lane.
- Choose date and time slot.
- Review booking price.
- Apply promo code.
- Pay with Stripe.
- See booking confirmation.
- View booking history in customer panel.
- View upcoming and recent bookings.
- View membership information.
- Update settings/profile.

### Admin Features

Admin can:

- View dashboard statistics.
- See user statistics, booking statistics, revenue chart, lane performance, membership stats, and top customers.
- Manage all bookings.
- Update booking status.
- Manage lanes.
- Manage available slots.
- Manage users.
- View reports.
- Manage discount codes.
- Manage memberships.

---

## 7. Booking Flow Explained

The booking flow is located at:

`/lanes/[id]`

It has three main steps.

### Step 1: Select Date and Slot

The user selects:

- Lane
- Date
- Available time slot
- Duration, such as 1, 2, or 3 hours

The lane data is fetched from the backend using the lane ID.

Simple explanation:

The app first asks, "Which lane do you want and when do you want to play?"

### Step 2: Review Booking

The user reviews:

- Lane name
- Date
- Start time and end time
- Duration
- Price
- Member discount
- Promo discount
- Equipment fee
- Final total

Then the app creates a booking by sending data to the backend.

The booking request includes:

- Lane ID
- Slot ID
- Date
- Start time
- End time
- Duration
- Total amount
- Discount amount
- Final amount
- Promo code, if applied

Simple explanation:

Before payment, the system first reserves the booking in the backend and gets a booking ID.

### Step 3: Payment

After the booking is created, the frontend asks the backend to create a Stripe payment intent using the booking ID.

The backend returns a `clientSecret`.

Simple explanation:

The `clientSecret` is like a secure payment session key from Stripe. The frontend uses it to show the Stripe payment form.

Then:

1. User enters card details into Stripe Payment Element.
2. Stripe securely handles the card information.
3. User confirms payment.
4. Stripe redirects the user to `/payment/success?bookingId=...`.
5. Success page fetches booking details and shows confirmation.

### Payment Success Page

The success page:

- Reads `bookingId` from the URL.
- Fetches booking details.
- Shows booking confirmed message.
- Shows reference number.
- Shows lane, date, and time.
- Shows QR code.
- Shows amount paid if available.

---

## 8. How Payment Works in Simple Words

Payment is handled using Stripe.

The frontend does not directly store or process card numbers.

The process is:

1. Frontend creates a booking.
2. Frontend asks backend to start payment for that booking.
3. Backend talks to Stripe and creates a payment intent.
4. Stripe gives a secure client secret.
5. Frontend uses that client secret to show Stripe payment form.
6. User enters card details directly into Stripe's secure form.
7. Stripe confirms the payment.
8. User is redirected to the success page.

Layman example:

Think of the frontend as a shop counter. The backend prepares the bill. Stripe is the card machine. The frontend never keeps the card number; it only opens the Stripe card machine for the customer.

---

## 9. Membership Payment Flow

Membership checkout is similar to booking payment.

Flow:

1. User selects a membership plan.
2. Frontend opens membership checkout page.
3. Frontend asks backend to create membership payment intent.
4. Backend returns Stripe client secret.
5. Stripe Payment Element is displayed.
6. User pays securely.
7. User is redirected to membership success page.

Membership plans include:

- Monthly Membership
- Annual Membership

---

## 10. API Communication

The project uses Axios through a central API client.

Main API client file:

`services/api/client.ts`

Important behavior:

- Uses `NEXT_PUBLIC_API_BASE_URL` as backend URL.
- Adds JSON headers.
- Adds access token in the `Authorization` header.
- If backend returns `401 Unauthorized`, the user is logged out and redirected to login.

Simple explanation:

All API requests go through one common door. That door automatically attaches the login pass if the user is logged in.

---

## 11. Data Fetching and Updating

The project uses React Query for two main things:

### Queries

Queries fetch data.

Examples:

- Get lanes.
- Get lane by ID.
- Get bookings.
- Get my bookings.
- Get dashboard data.
- Get membership plans.

### Mutations

Mutations change data.

Examples:

- Create booking.
- Cancel booking.
- Update booking status.
- Login.
- Register.
- Create payment intent.
- Confirm membership payment.

Simple explanation:

Query means "get data".

Mutation means "change data".

---

## 12. Video Guide Script

Use this as the spoken script for the project video.

### Opening

"Hello, today I am going to explain my project Ravenhall Indoor Cricket Centre. This is a web-based booking system where customers can book indoor cricket lanes online, make payments, buy memberships, and manage their bookings. The system also has an admin panel where staff can manage lanes, bookings, users, reports, discount codes, slots, and memberships."

### Technology Introduction

"The main technology used in this project is Next.js. Next.js is built on top of React. React helps us build reusable UI components, while Next.js gives us routing, layouts, better performance, and a proper project structure. I used TypeScript to make the code safer and easier to maintain. For styling, I used Tailwind CSS and shadcn UI components. For API communication, I used Axios, and for data fetching and caching, I used TanStack React Query. For payments, I used Stripe."

### Explain Folder Structure

"The project is divided into different folders. The `app` folder contains all the pages and routes. The `components` folder contains reusable UI parts like buttons, sidebars, auth screens, booking cards, and landing page sections. The `services` folder contains API calls, queries, and mutations. The `schemas` folder contains form validation rules, and the `types` folder contains TypeScript response types."

### Explain Routing

"Routing is handled by Next.js App Router. In this project, we do not manually define routes in a router file. Instead, the folder structure creates the routes. For example, the lanes page is inside the lanes folder, so it becomes `/lanes`. The booking page uses `[id]`, which means it is a dynamic route. So when the user opens `/lanes/123`, the app understands that 123 is the lane ID and fetches that lane's details."

### Explain Login

"There are two login flows: customer login and admin login. Customer login is at `/auth`, and admin login is at `/admin/auth`. When a user enters email and password, the frontend sends the data to the backend. If login is successful, the backend returns an access token and user role. The frontend stores the token and role. The token is used like a digital pass for future requests. If the user is a customer, they go to the customer panel. If the user is an admin, they go to the admin dashboard."

### Explain Protected Routes

"The project protects private pages using a proxy file. If a user is not logged in and tries to access `/panel` or `/admin`, they are redirected to the login page. Also, if a customer tries to access admin pages, they are redirected back to the customer panel. This keeps admin and customer areas separate."

### Explain Booking Flow

"The most important flow in this project is the booking flow. The booking flow starts when a customer selects a lane. The booking page is divided into three steps."

"In step one, the user selects a date, available time slot, and duration. The app fetches lane details and slots from the backend."

"In step two, the user reviews the booking details. The app calculates the lane hire price, member discount, promo discount, equipment fee, and final total. When the user clicks proceed to payment, the frontend creates a booking in the backend and receives a booking ID."

"In step three, the app uses that booking ID to start payment. It asks the backend to create a Stripe payment intent. The backend returns a client secret. The frontend uses that client secret to show the Stripe payment form. The user enters card details, Stripe handles the secure payment, and after success the user is redirected to the payment success page."

### Explain Payment

"Payment is done using Stripe. The important thing is that this frontend does not store card details. Stripe provides a secure payment form called Payment Element. The user enters card details inside Stripe's form, and Stripe processes the payment. After successful payment, the user is sent to the success page with the booking ID."

### Explain Success Page

"On the success page, the app reads the booking ID from the URL. It fetches the booking details from the backend and shows the booking confirmation, reference number, lane details, date, time, amount paid, and a QR code. This acts like a digital booking pass."

### Explain Customer Panel

"After login, customers can access their panel. In the customer panel, they can see dashboard statistics, upcoming bookings, recent bookings, membership details, booking history, and settings."

### Explain Admin Panel

"The admin panel is used by staff. Admin can see dashboard statistics such as users, bookings, revenue, lane performance, membership statistics, and top customers. Admin can also manage bookings, lanes, slots, users, reports, discount codes, and memberships."

### Closing

"In summary, this project is a complete frontend booking system using Next.js, React, TypeScript, Tailwind CSS, React Query, Axios, and Stripe. It has separate customer and admin flows, protected routes, online booking, secure payment, and dashboard features."

---

## 13. Viva Questions and Answers

### 1. What is this project about?

This project is an online booking system for Ravenhall Indoor Cricket Centre. Customers can book cricket lanes, pay online, buy memberships, and view their bookings. Admin users can manage the whole system from an admin dashboard.

### 2. What are the main modules of the project?

The main modules are customer landing pages, authentication, booking flow, payment flow, customer dashboard, membership, and admin dashboard.

### 3. What technology did you use for the frontend?

I used Next.js with React and TypeScript. I also used Tailwind CSS for styling, shadcn UI for components, Axios for API calls, React Query for data fetching, and Stripe for payment.

### 4. Why did you use Next.js instead of only React?

React mainly helps build UI components. Next.js gives extra features like file-based routing, layouts, better page structure, performance optimization, and easier project organization. So Next.js is better for building a complete web application.

### 5. Is Next.js different from React?

Yes. React is a UI library, while Next.js is a full framework built on React. This means Next.js uses React but adds more features around it.

### 6. What is TypeScript and why did you use it?

TypeScript is JavaScript with types. It helps catch mistakes early. For example, if a function expects a booking ID as a string, TypeScript warns us if we pass the wrong value.

### 7. Why did you use Tailwind CSS?

Tailwind CSS helps style the website quickly using utility classes. It keeps the design consistent and reduces the need for writing many custom CSS files.

### 8. What is shadcn/ui?

shadcn/ui provides reusable UI components like buttons, forms, dialogs, tables, sidebars, and inputs. It helps make the interface clean and professional.

### 9. What is Axios used for?

Axios is used to send requests from the frontend to the backend. For example, login, fetch lanes, create booking, and start payment all use API requests.

### 10. What is React Query used for?

React Query is used to fetch and manage backend data. It also caches data, refreshes data, and updates the UI after actions like creating or cancelling a booking.

### 11. What is the difference between a query and a mutation?

A query gets data from the backend. A mutation changes data in the backend. For example, fetching lanes is a query, and creating a booking is a mutation.

### 12. How does routing work in this project?

Routing works through the Next.js App Router. The folder structure inside the `app` folder becomes the website routes. For example, the lanes page becomes `/lanes`, and the dynamic lane booking page becomes `/lanes/[id]`.

### 13. What is a dynamic route?

A dynamic route is a route where part of the URL changes. For example, `/lanes/123` means 123 is the lane ID. The app uses that ID to fetch one lane's details.

### 14. How does customer login work?

Customer enters email and password. The frontend sends this to the backend. If correct, the backend returns a token and user details. The frontend stores the token and sends the customer to `/panel`.

### 15. How does admin login work?

Admin login is similar to customer login, but after login the frontend checks if the user role is admin. If the role is admin, the user is sent to `/admin`. If not, an error is shown.

### 16. Why do you store a token?

The token proves that the user is logged in. It is like a digital ID card. The frontend sends it with API requests so the backend knows who is making the request.

### 17. How are protected routes handled?

Protected routes are handled using `proxy.ts`. If there is no token, the user is sent to login. If the wrong role tries to access a page, the user is redirected to the correct area.

### 18. What are customer features?

Customer can browse lanes, book a slot, apply promo codes, pay online, view payment success, see bookings, view dashboard, check membership, and manage settings.

### 19. What are admin features?

Admin can view dashboard statistics, manage bookings, manage lanes, manage slots, view users, view reports, manage discount codes, and manage memberships.

### 20. Explain the booking flow.

The booking flow has three steps. First, the user selects a date, slot, and duration. Second, the user reviews the booking and price. Third, the user pays using Stripe. After payment, the success page shows the confirmed booking.

### 21. What happens in Step 1 of booking?

The user selects the lane date, available time slot, and duration. The app filters slots for the selected date and allows the user to continue only after selecting a slot.

### 22. What happens in Step 2 of booking?

The app shows booking details and calculates the total price. It applies member discount, promo discount, and equipment fee. Then it creates the booking in the backend and gets a booking ID.

### 23. Why create booking before payment?

The booking must exist first so payment can be linked to a specific booking. Without a booking ID, the system would not know which booking the payment belongs to.

### 24. What happens in Step 3 of booking?

The frontend sends the booking ID to the backend and asks for a Stripe payment intent. The backend returns a client secret. The frontend uses it to show the Stripe payment form and confirm payment.

### 25. How is payment done?

Payment is done using Stripe. The frontend creates a secure Stripe payment form using the client secret. The user enters card details into Stripe's form, and Stripe processes the payment securely.

### 26. Does the frontend store card details?

No. The frontend does not store card details. Card details are handled by Stripe, which is safer and more secure.

### 27. What is a Stripe payment intent?

A payment intent is a payment session created by Stripe. It represents the amount that needs to be paid and tracks whether the payment succeeds or fails.

### 28. What is a client secret?

A client secret is a secure key returned by Stripe through the backend. The frontend uses it to show and confirm the payment form.

### 29. What happens after successful payment?

Stripe redirects the user to the success page. The success page reads the booking ID, fetches booking details, and shows booking confirmation with a reference number and QR code.

### 30. Why is there a QR code on the success page?

The QR code acts like a digital pass for the booking. It contains booking information such as reference number, booking ID, lane, date, and time.

### 31. How does membership payment work?

Membership payment also uses Stripe. The user chooses a plan, the frontend asks the backend for a payment intent, Stripe handles the payment, and the user is redirected after payment.

### 32. What is form validation?

Form validation checks whether user input is correct before sending it to the backend. For example, email must be valid and password must not be empty.

### 33. What is Zod used for?

Zod is used to define validation rules. It checks login, register, forgot password, reset password, and verify email forms.

### 34. What is React Hook Form used for?

React Hook Form manages form input, form submission, errors, and validation state.

### 35. What is the use of `services/api/client.ts`?

It is the central Axios client. All API requests use it. It adds the token to requests and handles unauthorized errors.

### 36. What happens if the token is invalid?

If the backend returns a 401 unauthorized error, the app clears the stored tokens and redirects the user to the correct login page.

### 37. What is the purpose of the admin dashboard?

The admin dashboard gives staff an overview of the business. It shows booking stats, user stats, revenue chart, lane stats, membership stats, and top customers.

### 38. What is the purpose of the customer dashboard?

The customer dashboard shows the customer's booking activity, total spending, upcoming bookings, recent bookings, and membership details.

### 39. Why did you use components?

Components make the UI reusable and easier to manage. Instead of writing the same UI again and again, we create one component and use it in different places.

### 40. Give an example of component reuse.

The auth screen is reused for customer login, customer register, admin login, forgot password, reset password, and email verification with different settings.

### 41. What is the role of environment variables?

Environment variables store values that can change between development and production, such as backend API URL and Stripe publishable key.

### 42. What is `NEXT_PUBLIC_API_BASE_URL`?

It is the backend API base URL used by the frontend when sending API requests.

### 43. What is `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`?

It is the public Stripe key used by the frontend to load Stripe payment features.

### 44. What is the difference between frontend and backend in this project?

The frontend is what the user sees and clicks. The backend stores data, checks login, manages bookings, and communicates with Stripe.

### 45. What data comes from the backend?

Lane details, slots, bookings, users, dashboard stats, memberships, discount codes, and payment intent details come from the backend.

### 46. Why is the backend needed for payment?

The backend securely creates Stripe payment intents. Sensitive payment setup should not be done only in the frontend.

### 47. What are discount codes used for?

Discount codes reduce the final booking price. In the booking review step, the user can apply a promo code before payment.

### 48. How is booking price calculated?

The app calculates lane hire based on hourly rate and duration. Then it subtracts member discount and promo discount, adds equipment fee, and shows the final total.

### 49. Why do we invalidate queries after mutation?

After changing data, old cached data may be outdated. Invalidating queries tells React Query to fetch fresh data again.

### 50. What would you improve in the future?

Future improvements could include stronger backend discount validation, email notification tracking, better admin role levels, improved booking conflict checks, and more detailed reports.

---

## 14. Short Viva Answers to Memorize

### Why Next.js?

Because it gives React a full project structure with routing, layouts, performance features, and easier page management.

### Why TypeScript?

Because it catches mistakes early and makes data structures clearer.

### Why React Query?

Because it makes API data fetching, caching, refreshing, and updating easier.

### Why Stripe?

Because it handles card payments securely and the frontend does not need to store card details.

### Why Axios?

Because it makes API requests simpler and lets us set common rules like adding the login token automatically.

### How does booking work?

User selects lane and slot, reviews price, creates booking, pays with Stripe, and receives confirmation.

### How does login work?

User enters email and password, backend verifies it, frontend stores token and role, then redirects user to the correct dashboard.

### How is admin different from customer?

Customer books and manages their own bookings. Admin manages the whole system, including bookings, lanes, users, slots, reports, discounts, and memberships.

---

## 15. Suggested Video Recording Order

1. Show homepage.
2. Explain technology stack.
3. Show folder structure briefly.
4. Show customer login/register.
5. Show lanes page.
6. Open one lane and explain Step 1.
7. Continue to review and explain price calculation.
8. Continue to payment and explain Stripe.
9. Show payment success page.
10. Show customer panel and bookings.
11. Show admin login.
12. Show admin dashboard.
13. Show admin bookings, lanes, users, reports, discounts, and membership pages.
14. End with summary.

---

## 16. One-Minute Project Explanation

"Ravenhall is a Next.js based frontend for an indoor cricket lane booking system. Customers can browse lanes, select a slot, review price, pay using Stripe, and view booking confirmation with a QR code. The system also has customer login and dashboard features. Admin users have a separate login and dashboard where they can manage bookings, lanes, slots, users, reports, discount codes, and memberships. The project uses React components, TypeScript for safer code, Tailwind and shadcn UI for design, Axios for API calls, React Query for data fetching and caching, and Stripe for secure payment."

---

## 17. Two-Minute Booking Flow Explanation

"The booking flow starts from the lanes page. When a customer selects a lane, the app opens a dynamic route like `/lanes/[id]`. The lane ID is taken from the URL, and the frontend fetches lane and slot details from the backend. In step one, the user selects a date, available slot, and duration. In step two, the user reviews all details and the app calculates the final amount by using lane price, duration, member discount, promo discount, and equipment fee. When the user proceeds, the frontend creates a booking in the backend and receives a booking ID. In step three, the frontend sends that booking ID to the backend to create a Stripe payment intent. The backend returns a client secret, and the frontend uses it to display the Stripe payment form. The user pays securely through Stripe. After successful payment, Stripe redirects to the success page with the booking ID, and the app shows confirmation, booking reference, details, amount, and QR code."

---

## 18. Final Tips for Viva

- Do not say "React and Next.js are totally separate." Say "Next.js is built on top of React."
- Do not say "frontend processes payment." Say "Stripe processes payment, frontend only displays Stripe's secure form."
- Do not say "folder is just for organization." Say "in Next.js, folders inside app also create routes."
- Do not say "token is password." Say "token is a temporary digital pass after login."
- If you do not know backend details, say "from the frontend side, we call this API endpoint, and the backend handles the actual database or Stripe operation."

