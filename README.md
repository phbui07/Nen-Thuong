# Getting Started

## Cloning the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/phbui07/Nen-Thuong
cd Nen-Thuong
```

## Prerequisites

- Node.js 24 or later (also used for Vercel deployments via `engines` in `package.json`)
- A [Clerk](https://clerk.com) application for authentication
- The store admin API (`NEXT_PUBLIC_API_URL`) that serves products, categories, sizes and orders

## Configuring Environment Variables

Copy the example file and fill in your Clerk secret key:

```bash
cp .env.example .env.local
```

`.env.local` is gitignored and is loaded by `next dev`, `next build` and `next start`. Never commit real keys.

## Running the Development Server

Install the dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To create an optimized production build:

```bash
npm run build
```

## Running Production Server

After building the project, you can start the production server:

```bash
npm run start
```

## Linting

```bash
npm run lint
```

## Features

### 1. Cart Functionality

Manage items in the shopping cart, including adding, removing, and updating quantities.

### 2. Checkout Process

Handle the checkout process, including payment and order confirmation.

### 3. Product Menu

Browse and search through the product catalog.

### 4. Admin Product Management

Admin interface for managing product listings, including adding, editing, and deleting products.

### 5. Filtered Product Listings

View and filter products based on various criteria.

### 6. Product Details

View detailed information about individual products.

## Technologies Used

- **Next.js (next)**: A React framework for building server-side rendered and static web applications.
- **React (react, react-dom)**: A JavaScript library for building user interfaces.
- **TypeScript (typescript)**: A superset of JavaScript that adds static types.
- **Tailwind CSS (tailwindcss, tailwind-merge, tailwindcss-animate)**: A utility-first CSS framework for styling.
- **Zustand (zustand)**: A small, fast, and scalable state management solution.
- **Axios (axios)**: A promise-based HTTP client for making requests.
- **ESLint (eslint, eslint-config-next)**: A tool for identifying and fixing problems in JavaScript code.
- **PostCSS (postcss)**: A tool for transforming CSS with JavaScript plugins.
- **Clerk (@clerk/nextjs)**: A library for authentication and user management.
- **Radix UI (@radix-ui/react-separator, @radix-ui/react-slot, @radix-ui/react-tabs)**: A set of accessible and unstyled components for building user interfaces.
- **Lucide React (lucide-react)**: A collection of icons for React.
- **React Hot Toast (react-hot-toast)**: A library for showing notifications.
- **Class Variance Authority (class-variance-authority)**: A utility for managing class names in React components.
- **clsx (clsx)**: A utility for constructing className strings conditionally.
- **Query String (query-string)**: A library for parsing and stringifying URL query strings.
