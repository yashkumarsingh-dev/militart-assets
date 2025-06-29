// Demo data for testing the application

export const demoUsers = [
  {
    id: 1,
    email: "admin@kristalball.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    name: "Admin User",
  },
  {
    id: 2,
    email: "manager@kristalball.com",
    password: "manager123",
    firstName: "Manager",
    lastName: "User",
    role: "manager",
    name: "Manager User",
  },
  {
    id: 3,
    email: "user@kristalball.com",
    password: "user123",
    firstName: "Regular",
    lastName: "User",
    role: "user",
    name: "Regular User",
  },
];

export const demoAssets = [
  {
    id: 1,
    name: "Laptop Dell XPS 13",
    category: "Electronics",
    status: "Assigned",
    assignedTo: "John Doe",
    purchaseDate: "2024-01-15",
    value: "$1,299",
    serialNumber: "DLXPS13-001",
  },
  {
    id: 2,
    name: "Office Chair",
    category: "Furniture",
    status: "Available",
    assignedTo: "-",
    purchaseDate: "2024-02-20",
    value: "$299",
    serialNumber: "FURN-001",
  },
  {
    id: 3,
    name: "Projector Epson",
    category: "Electronics",
    status: "Maintenance",
    assignedTo: "IT Department",
    purchaseDate: "2023-11-10",
    value: "$899",
    serialNumber: "PROJ-001",
  },
];

export const demoAssignments = [
  {
    id: 1,
    assetName: "Laptop Dell XPS 13",
    assignedTo: "John Doe",
    assignedBy: "Admin User",
    assignedDate: "2024-01-15",
    status: "Active",
    returnDate: "2024-12-31",
  },
  {
    id: 2,
    assetName: "Office Chair",
    assignedTo: "Jane Smith",
    assignedBy: "HR Manager",
    assignedDate: "2024-02-20",
    status: "Active",
    returnDate: "2024-12-31",
  },
];

export const demoPurchases = [
  {
    id: 1,
    itemName: "Laptop Dell XPS 13",
    requestedBy: "John Doe",
    requestedDate: "2024-01-15",
    status: "Approved",
    amount: "$1,299",
    approvedBy: "Manager",
  },
  {
    id: 2,
    itemName: "Office Chair",
    requestedBy: "Jane Smith",
    requestedDate: "2024-02-20",
    status: "Pending",
    amount: "$299",
    approvedBy: "-",
  },
];

export const demoTransfers = [
  {
    id: 1,
    assetName: "Laptop Dell XPS 13",
    fromLocation: "IT Department",
    toLocation: "Marketing Department",
    transferredBy: "Admin User",
    transferDate: "2024-01-15",
    status: "Completed",
    reason: "Department reorganization",
  },
  {
    id: 2,
    assetName: "Office Chair",
    fromLocation: "Warehouse",
    toLocation: "Sales Department",
    transferredBy: "HR Manager",
    transferDate: "2024-02-20",
    status: "In Progress",
    reason: "New employee onboarding",
  },
];

export const demoAuditLogs = [
  {
    id: 1,
    action: "Asset Assigned",
    user: "Admin User",
    timestamp: "2024-01-15 10:30:00",
    details: "Laptop Dell XPS 13 assigned to John Doe",
    ipAddress: "192.168.1.100",
  },
  {
    id: 2,
    action: "Purchase Approved",
    user: "Manager",
    timestamp: "2024-01-15 09:15:00",
    details: "Purchase request for Office Chair approved",
    ipAddress: "192.168.1.101",
  },
  {
    id: 3,
    action: "Asset Transferred",
    user: "Facilities Manager",
    timestamp: "2024-01-14 16:45:00",
    details: "Projector moved from Conference Room A to B",
    ipAddress: "192.168.1.102",
  },
];

// Helper function to validate login credentials
export const validateLogin = (email, password) => {
  const user = demoUsers.find(
    (u) => u.email === email && u.password === password
  );
  return user ? { ...user, password: undefined } : null;
};

// Helper function to check if email already exists
export const isEmailTaken = (email) => {
  return demoUsers.some((u) => u.email === email);
};

export default {
  demoUsers,
  demoAssets,
  demoAssignments,
  demoPurchases,
  demoTransfers,
  demoAuditLogs,
  validateLogin,
  isEmailTaken,
};
