# Military Asset Management System

## 1. Project Overview

Military is a modern asset management system designed for organizations requiring robust tracking of assets, assignments, purchases, transfers, and audit logs. The system features a responsive React (Vite) frontend, a secure Node.js/Express.js backend, and a PostgreSQL database.

**Main Features:**

- User authentication and role-based access control
- Asset CRUD operations
- Assignment and transfer management
- Purchase tracking
- Audit logging with IP tracking
- Responsive, mobile-friendly UI

---

## 2. Technical Requirements

- **Vite**: ^4.x
- **Node.js**: ^18.x
- **Express.js**: ^4.x
- **PostgreSQL**: ^14.x or later
- **Other dependencies**: See `frontend/package.json` and `backend/package.json`

---

## 3. Setup and Installation

### Prerequisites

- Node.js and npm installed
- PostgreSQL server running

### Clone the Repository

```bash
git clone https://github.com/yashkumarsingh-dev/militart-assets.git
cd kristalball
```

### Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory with the following:

```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/kristalball
JWT_SECRET=your-secret-key
```

---

## 4. Database Configuration

- Ensure PostgreSQL is running and create a database named `kristalball`:
  ```sql
  CREATE DATABASE kristalball;
  ```
- Run migration scripts or use an ORM (e.g., Sequelize) to set up the schema. Example:
  ```bash
  npm run migrate
  # or use provided SQL scripts in backend/migrations/
  ```
- (Optional) Seed the database:
  ```bash
  npm run seed
  ```

---

## 5. Running the Application

### Start the Backend

```bash
cd backend
npm start
# or: node src/app.js
```

### Start the Frontend

```bash
cd frontend
npm run dev
```

- The frontend will be available at `http://localhost:5173`
- The backend API will be available at `http://localhost:5000/api`

---

## 6. API Documentation

### Authentication

- `POST /api/auth/login` — User login
- `POST /api/auth/register` — User registration
- `POST /api/auth/logout` — Logout

### Assets

- `GET /api/assets` — List all assets
- `POST /api/assets` — Create asset
- `PUT /api/assets/:id` — Update asset
- `DELETE /api/assets/:id` — Delete asset

### Assignments

- `GET /api/assignments` — List assignments
- `POST /api/assignments` — Create assignment
- `PUT /api/assignments/:id` — Update assignment
- `DELETE /api/assignments/:id` — Delete assignment

### Purchases

- `GET /api/purchases` — List purchases
- `POST /api/purchases` — Create purchase
- `PUT /api/purchases/:id` — Update purchase
- `DELETE /api/purchases/:id` — Delete purchase

### Transfers

- `GET /api/transfers` — List transfers
- `POST /api/transfers` — Create transfer
- `PUT /api/transfers/:id` — Update transfer
- `DELETE /api/transfers/:id` — Delete transfer

### Audit

- `GET /api/audit/logs` — List audit logs

#### Request/Response Format

- All endpoints accept and return JSON.
- Most endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.

#### Authentication/Authorization

- Register and login endpoints are public.
- All other endpoints require authentication and role-based authorization.

---

## 7. Usage Examples

### Example: Creating an Asset (API)

```http
POST /api/assets
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Rifle A1",
  "type": "Weapon",
  "serialNumber": "SN123456",
  "status": "available"
}
```

### Example: Fetching Assignments (API)

```http
GET /api/assignments?status=active
Authorization: Bearer <token>
```

---

## 8. Contributing and Testing

### Contributing

- Fork the repository and create a feature branch.
- Submit pull requests with clear descriptions.
- Follow code style and commit message guidelines.

### Testing

- Backend: Jest, Supertest (see `backend/tests/`)
- Frontend: React Testing Library, Jest (see `frontend/tests/`)
- Run tests:
  ```bash
  cd backend && npm test
  cd ../frontend && npm test
  ```

---

## 9. License and Acknowledgments

### License

This project is licensed under the MIT License.

### Acknowledgments

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Sequelize](https://sequelize.org/) 
- All contributors and open-source libraries used in this project.

---

> _For questions, issues, or feature requests, please open an issue or contact the maintainer._
