# Kristalball Frontend

A modern React-based frontend for the Kristalball Asset Management System.

## Features

- **Dashboard**: Overview with statistics and recent activity
- **Assets Management**: CRUD operations for assets
- **Assignments**: Manage asset assignments to users
- **Purchases**: Handle purchase requests and approvals
- **Transfers**: Track asset transfers between locations
- **Audit Log**: View system activity and audit trail
- **Authentication**: Login/logout functionality
- **Responsive Design**: Modern UI with Tailwind CSS

## Tech Stack

- **React 18**: Frontend framework
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **JavaScript**: ES6+ features

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── Login.jsx
│   ├── dashboard/
│   │   └── Dashboard.jsx
│   ├── assets/
│   │   └── Assets.jsx
│   ├── assignments/
│   │   └── Assignments.jsx
│   ├── purchases/
│   │   └── Purchases.jsx
│   ├── transfers/
│   │   └── Transfers.jsx
│   ├── audit/
│   │   └── Audit.jsx
│   └── layout/
│       ├── Header.jsx
│       └── Sidebar.jsx
├── contexts/
│   └── AuthContext.jsx
├── services/
│   └── api.js
├── utils/
├── App.jsx
└── main.jsx
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## API Integration

The frontend is configured to connect to the backend API at `http://localhost:3000/api`. Make sure your backend server is running on this port.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Component Overview

### Authentication

- **Login**: User authentication form

### Layout

- **Header**: Top navigation with user menu
- **Sidebar**: Main navigation menu

### Pages

- **Dashboard**: Overview with stats and activity
- **Assets**: Asset management table
- **Assignments**: Asset assignment tracking
- **Purchases**: Purchase request management
- **Transfers**: Asset transfer tracking
- **Audit**: System activity logs

## Styling

The application uses Tailwind CSS for styling. All components are built with responsive design principles and follow a consistent design system.

## State Management

Currently using React's built-in state management with useState and useContext. The AuthContext provides authentication state across the application.

## Future Enhancements

- Add React Router for better navigation
- Implement form validation
- Add error boundaries
- Implement real-time updates
- Add search and filtering functionality
- Implement pagination for large datasets
- Add export functionality for reports
