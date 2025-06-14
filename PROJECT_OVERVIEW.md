
# UniShop Project Overview

**UniShop** is an e-commerce platform designed for purchasing uniforms. It caters to various sectors including schools, colleges, corporate entities, and healthcare professionals. The primary goal is to offer a seamless, user-friendly, and secure online shopping experience.

## Core Features:

1.  **Product Catalog:** Intuitive browsing of uniforms, filterable by category (school, college, etc.), size, price, and color.
2.  **Search Functionality:** Allows users to search for specific products.
3.  **Shopping Cart:** Standard e-commerce cart to add, remove, and modify uniform quantities.
4.  **User Accounts & Roles:**
    *   **Student:** Can browse, purchase uniforms, and view their order history.
    *   **Institution:** Can view analytics related to their students' purchases and manage a list of registered students.
    *   **Dealer:** Can manage orders assigned to them (accept/reject), view inventory, and see sales analytics.
    *   **Admin:** Has full control over the platform, including managing products, all orders, all users, viewing comprehensive analytics, and managing donation submissions.
5.  **Checkout Process:** Includes shipping information, payment method selection (with a mock Razorpay integration flow).
6.  **Donation System:** A feature allowing users to submit information about old uniforms they wish to donate (can be toggled by Admin).
7.  **Role-Based Dashboards:** Tailored dashboards for Admin, Institution, and Dealer roles.

## Technology Stack

*   **Framework:** **Next.js 15.x** (using the App Router)
*   **Language:** **TypeScript**
*   **UI Library:** **React 18.x**
*   **Styling:** **Tailwind CSS**
*   **UI Components:** **ShadCN/UI** (built on Radix UI primitives and styled with Tailwind CSS)
*   **Icons:** **Lucide React**
*   **Database:** **MongoDB** (interacted with via the official `mongodb` driver)
*   **Authentication:** Custom JWT (JSON Web Tokens) based authentication with passwords hashed using `bcryptjs`.
*   **API Layer:** Next.js API Routes
*   **Form Handling (Implicit):** Some ShadCN components internally use React Hook Form.
*   **Charting/Analytics:** **Recharts** (integrated via ShadCN Charts)
*   **Date Management:** `date-fns`
*   **Carousel:** `embla-carousel-react`
*   **AI (Potential):** **Genkit** (setup for future AI features)

## Key Libraries & Packages

*   `next`, `react`, `react-dom`: Core building blocks.
*   `tailwindcss`, `tailwindcss-animate`, `clsx`, `tailwind-merge`: For styling and class name management.
*   `@radix-ui/*`: Underlying primitive components for ShadCN/UI.
*   `lucide-react`: SVG icon library.
*   `mongodb`: Official MongoDB Node.js driver for database interaction.
*   `bcryptjs`: For securely hashing passwords.
*   `jsonwebtoken`: For creating and verifying JWTs.
*   `genkit`, `@genkit-ai/googleai`, `@genkit-ai/next`: For Google AI integration via Genkit.
*   `zod`: Schema declaration and validation.
*   `recharts`: Library for creating charts.
*   `embla-carousel-react`, `embla-carousel-autoplay`: For creating image carousels.
*   `date-fns`: Modern JavaScript date utility library.
*   `dotenv`: For managing environment variables.

## Folder Structure & File Explanations

```
.
├── .vscode/                      # VS Code editor settings
│   └── settings.json
├── public/                       # Static assets (images, favicons if not handled by Next/Image)
├── src/
│   ├── ai/                       # Genkit AI integration files
│   │   ├── genkit.ts             # Genkit global instance and configuration
│   │   └── dev.ts                # Genkit development server entry point
│   ├── app/                      # Next.js App Router: routing, pages, layouts
│   │   ├── layout.tsx            # Root layout for the entire application
│   │   ├── globals.css           # Global styles, Tailwind base, ShadCN theme variables
│   │   ├── page.tsx              # Homepage (renders at '/')
│   │   ├── (main_routes)/        # Page routes (e.g., about, products, cart, login, etc.)
│   │   │   ├── about/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── donate/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── privacy/page.tsx
│   │   │   ├── products/
│   │   │   │   ├── [id]/page.tsx # Product detail page
│   │   │   │   └── page.tsx      # Product listing page
│   │   │   ├── profile/page.tsx  # User profile page
│   │   │   ├── register/
│   │   │   │   ├── dealer/page.tsx
│   │   │   │   ├── institution/page.tsx
│   │   │   │   └── student/page.tsx
│   │   │   └── terms/page.tsx
│   │   ├── admin/                # Admin panel routes and layout
│   │   │   ├── layout.tsx        # Layout specific to admin section
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── products/...      # Product management pages (new, edit, list)
│   │   │   ├── orders/page.tsx
│   │   │   ├── customers/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── donations/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── login/page.tsx    # Admin login page
│   │   ├── dealer/               # Dealer portal routes and layout
│   │   │   ├── layout.tsx        # Layout specific to dealer section
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── inventory/page.tsx
│   │   │   └── orders/page.tsx
│   │   ├── institution/          # Institution portal routes and layout
│   │   │   ├── layout.tsx        # Layout specific to institution section
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── registered-students/page.tsx
│   │   │   └── student-purchases/page.tsx
│   │   └── api/                  # Backend API routes
│   │       ├── auth/             # Authentication (login, register, logout)
│   │       │   ├── login/route.ts
│   │       │   ├── register/route.ts
│   │       │   └── logout/route.ts
│   │       ├── orders/           # Order management
│   │       │   ├── route.ts                   # Create order (POST)
│   │       │   ├── [orderId]/route.ts         # Get/Update specific order (GET, PATCH)
│   │       │   └── user/[userId]/route.ts     # Get orders for a specific user (GET)
│   │       ├── payment/          # Mock payment gateway routes
│   │       │   ├── create-order/route.ts      # Simulates creating a Razorpay order
│   │       │   └── verify-signature/route.ts  # Simulates verifying a Razorpay payment
│   │       └── user/             # User profile management
│   │           ├── [id]/route.ts            # Get/Update user by ID (GET, PUT)
│   │           └── [id]/avatar/route.ts     # Update user avatar (POST)
│   ├── components/               # Reusable UI components
│   │   ├── AppProviders.tsx      # Context providers (CartProvider)
│   │   ├── CategoryCard.tsx      # Card display for product categories
│   │   ├── ProductCard.tsx       # Card display for individual products
│   │   ├── admin/
│   │   │   └── AdminSidebar.tsx  # Sidebar for admin panel
│   │   ├── dealer/
│   │   │   └── DealerSidebar.tsx # Sidebar for dealer portal
│   │   ├── institution/
│   │   │   └── InstitutionSidebar.tsx # Sidebar for institution portal
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx
│   │   ├── shared/
│   │   │   ├── Logo.tsx
│   │   │   └── LogoMarquee.tsx   # Scrolling logo display
│   │   └── ui/                   # ShadCN/UI components (button, card, input etc.)
│   ├── contexts/                 # React Context files
│   │   ├── AuthContext.tsx       # (Currently placeholder) Manages auth state
│   │   └── CartContext.tsx       # Manages shopping cart state (user-specific and guest)
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-toast.ts          # For displaying toast notifications
│   │   └── use-mobile.tsx        # Detects if viewport is mobile-sized
│   ├── lib/                      # Utility functions, library configs, data
│   │   ├── mockData.ts           # Mock data for products, users, orders, etc.
│   │   ├── mongodb.ts            # MongoDB connection helper
│   │   └── utils.ts              # General utilities (e.g., `cn` for classnames)
│   └── types/                    # TypeScript type definitions
│       └── index.ts              # Centralized type definitions for the project
├── .gitignore
├── apphosting.yaml               # Firebase App Hosting configuration
├── components.json               # ShadCN/UI configuration
├── next-env.d.ts
├── next.config.ts                # Next.js configuration
├── package.json                  # Project dependencies and scripts
├── PROJECT_OVERVIEW.md           # This file: detailed project information
├── README.md
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Core Feature Implementation Highlights

*   **Authentication:**
    *   Handled via API routes in `src/app/api/auth/`.
    *   Uses JWTs stored in HTTPOnly cookies.
    *   `bcryptjs` for password hashing.
    *   Client-side auth state managed in `Header` and pages via `localStorage` and an `authChange` custom event.
*   **Product Display & Filtering:**
    *   Mock data from `src/lib/mockData.ts`.
    *   `/app/products/page.tsx` for listing and client-side filtering.
    *   `/app/products/[id]/page.tsx` for product details and advanced reviews.
*   **Shopping Cart & Checkout:**
    *   `CartContext` (`src/contexts/CartContext.tsx`) manages cart:
        *   User-specific carts are persisted to the backend via `/api/user/[id]`.
        *   Guest carts use `localStorage`.
    *   `/app/cart/page.tsx` for cart management.
    *   `/app/checkout/page.tsx` for shipping and mock Razorpay payment flow.
    *   Order creation via `POST /api/orders`.
*   **Role-Based Access & Dashboards:**
    *   **Admin (`/app/admin/*`):** Full control, `AdminSidebar`.
    *   **Dealer (`/app/dealer/*`):** Order accept/reject (via `PATCH /api/orders/[orderId]`), inventory, `DealerSidebar`.
    *   **Institution (`/app/institution/*`):** Student data, analytics, `InstitutionSidebar`.
*   **Database Interaction:**
    *   `src/lib/mongodb.ts` for MongoDB connection.
    *   API routes perform CRUD on `users` and `orders` collections.
*   **Styling & UI:**
    *   Tailwind CSS utility-first.
    *   ShadCN/UI components.
    *   Global styles & theme in `src/app/globals.css`.
    *   Responsive design via Tailwind and `use-mobile` hook.
*   **Donation Feature Toggle:**
    *   Admin setting in `/app/admin/settings/page.tsx` controls visibility.
    *   State stored in `localStorage`, Header/Footer react to changes.

This document should serve as a good reference for the UniShop project.
    