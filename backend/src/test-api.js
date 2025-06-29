const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";
let authToken = null;

// Test credentials
const testUsers = {
  admin: { email: "admin@military.com", password: "password123" },
  commander: { email: "commander.alpha@military.com", password: "password123" },
  logistics: { email: "logistics.alpha@military.com", password: "password123" },
};

// Helper function to make authenticated requests
const makeRequest = async (
  method,
  endpoint,
  data = null,
  token = authToken
) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(data && { data }),
    };

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status,
    };
  }
};

// Test functions
const testHealthCheck = async () => {
  // console.log('\n🏥 Testing Health Check...');
  const result = await makeRequest("GET", "/health");
  // console.log('Health Check:', result.success ? '✅ PASS' : '❌ FAIL');
  // if (result.success) {
  //   console.log('Response:', result.data);
  // }
};

const testAuthentication = async () => {
  // console.log('\n🔐 Testing Authentication...');

  // Test login
  // console.log('Testing login...');
  const loginResult = await makeRequest("POST", "/auth/login", testUsers.admin);
  if (loginResult.success) {
    authToken = loginResult.data.token;
    // console.log('✅ Login successful');
    // console.log('User:', loginResult.data.user.name, `(${loginResult.data.user.role})`);
  } else {
    // console.log('❌ Login failed:', loginResult.error);
  }

  // Test profile
  // console.log('Testing profile...');
  const profileResult = await makeRequest("GET", "/auth/profile");
  // console.log('Profile:', profileResult.success ? '✅ PASS' : '❌ FAIL');
};

const testDashboard = async () => {
  // console.log('\n📊 Testing Dashboard...');

  // Test metrics
  // console.log('Testing dashboard metrics...');
  const metricsResult = await makeRequest("GET", "/dashboard/metrics");
  // console.log('Metrics:', metricsResult.success ? '✅ PASS' : '❌ FAIL');
  // if (metricsResult.success) {
  //   console.log('Metrics data:', metricsResult.data.metrics);
  // }

  // Test net movement
  // console.log('Testing net movement details...');
  const netMovementResult = await makeRequest("GET", "/dashboard/net-movement");
  // console.log('Net Movement:', netMovementResult.success ? '✅ PASS' : '❌ FAIL');
};

const testPurchases = async () => {
  // console.log('\n🛒 Testing Purchases...');

  // Test get purchases
  // console.log('Testing get purchases...');
  const getPurchasesResult = await makeRequest("GET", "/purchases");
  // console.log('Get Purchases:', getPurchasesResult.success ? '✅ PASS' : '❌ FAIL');

  // Test create purchase
  // console.log('Testing create purchase...');
  const newPurchase = {
    asset_type: "weapon",
    quantity: 5,
    base_id: 1,
    date: new Date().toISOString(),
  };
  const createPurchaseResult = await makeRequest(
    "POST",
    "/purchases",
    newPurchase
  );
  // console.log('Create Purchase:', createPurchaseResult.success ? '✅ PASS' : '❌ FAIL');

  if (createPurchaseResult.success) {
    const purchaseId = createPurchaseResult.data.purchase.id;

    // Test get purchase by ID
    // console.log('Testing get purchase by ID...');
    const getPurchaseResult = await makeRequest(
      "GET",
      `/purchases/${purchaseId}`
    );
    // console.log('Get Purchase by ID:', getPurchaseResult.success ? '✅ PASS' : '❌ FAIL');
  }
};

const testTransfers = async () => {
  // console.log('\n🔄 Testing Transfers...');

  // Test get transfers
  // console.log('Testing get transfers...');
  const getTransfersResult = await makeRequest("GET", "/transfers");
  // console.log('Get Transfers:', getTransfersResult.success ? '✅ PASS' : '❌ FAIL');

  // Test create transfer
  // console.log('Testing create transfer...');
  const newTransfer = {
    asset_id: 1,
    from_base_id: 1,
    to_base_id: 2,
    quantity: 1,
    date: new Date().toISOString(),
  };
  const createTransferResult = await makeRequest(
    "POST",
    "/transfers",
    newTransfer
  );
  // console.log('Create Transfer:', createTransferResult.success ? '✅ PASS' : '❌ FAIL');

  // Test asset transfer history
  // console.log('Testing asset transfer history...');
  const historyResult = await makeRequest("GET", "/transfers/asset/1/history");
  // console.log('Asset Transfer History:', historyResult.success ? '✅ PASS' : '❌ FAIL');
};

const testAssignments = async () => {
  // console.log('\n👥 Testing Assignments...');

  // Test get assignments
  // console.log('Testing get assignments...');
  const getAssignmentsResult = await makeRequest("GET", "/assignments");
  // console.log('Get Assignments:', getAssignmentsResult.success ? '✅ PASS' : '❌ FAIL');

  // Test assign asset
  // console.log('Testing assign asset...');
  const newAssignment = {
    asset_id: 2,
    personnel_id: 6,
    assigned_date: new Date().toISOString(),
  };
  const assignAssetResult = await makeRequest(
    "POST",
    "/assignments",
    newAssignment
  );
  // console.log('Assign Asset:', assignAssetResult.success ? '✅ PASS' : '❌ FAIL');

  if (assignAssetResult.success) {
    const assignmentId = assignAssetResult.data.assignment.id;

    // Test expend asset
    // console.log('Testing expend asset...');
    const expendAssetData = {
      assignment_id: assignmentId,
      expended_date: new Date().toISOString(),
    };
    const expendAssetResult = await makeRequest(
      "POST",
      "/assignments/expend",
      expendAssetData
    );
    // console.log('Expend Asset:', expendAssetResult.success ? '✅ PASS' : '❌ FAIL');
  }

  // Test asset assignments
  // console.log('Testing asset assignments...');
  const assetAssignmentsResult = await makeRequest(
    "GET",
    "/assignments/asset/1"
  );
  // console.log('Asset Assignments:', assetAssignmentsResult.success ? '✅ PASS' : '❌ FAIL');

  // Test personnel assignments
  // console.log('Testing personnel assignments...');
  const personnelAssignmentsResult = await makeRequest(
    "GET",
    "/assignments/personnel/6"
  );
  // console.log('Personnel Assignments:', personnelAssignmentsResult.success ? '✅ PASS' : '❌ FAIL');
};

const testAuditLogs = async () => {
  // console.log('\n📋 Testing Audit Logs...');

  // Test get audit logs (admin only)
  // console.log('Testing get audit logs...');
  const auditLogsResult = await makeRequest("GET", "/audit/logs");
  // console.log('Audit Logs:', auditLogsResult.success ? '✅ PASS' : '❌ FAIL');
};

const testRoleBasedAccess = async () => {
  // console.log('\n🛡️ Testing Role-Based Access...');

  // Test with commander credentials
  // console.log('Testing commander access...');
  const commanderLogin = await makeRequest(
    "POST",
    "/auth/login",
    testUsers.commander
  );
  if (commanderLogin.success) {
    const commanderToken = commanderLogin.data.token;

    // Test commander accessing their base data
    const commanderMetrics = await makeRequest(
      "GET",
      "/dashboard/metrics",
      null,
      commanderToken
    );
    // console.log('Commander Metrics Access:', commanderMetrics.success ? '✅ PASS' : '❌ FAIL');

    // Test commander trying to access audit logs (should fail)
    const commanderAudit = await makeRequest(
      "GET",
      "/audit/logs",
      null,
      commanderToken
    );
    // console.log('Commander Audit Access (should fail):', commanderAudit.success ? '❌ FAIL' : '✅ PASS');
  }

  // Test with logistics officer credentials
  // console.log('Testing logistics officer access...');
  const logisticsLogin = await makeRequest(
    "POST",
    "/auth/login",
    testUsers.logistics
  );
  if (logisticsLogin.success) {
    const logisticsToken = logisticsLogin.data.token;

    // Test logistics officer creating a purchase
    const newPurchase = {
      asset_type: "ammunition",
      quantity: 100,
      base_id: 1,
      date: new Date().toISOString(),
    };
    const logisticsPurchase = await makeRequest(
      "POST",
      "/purchases",
      newPurchase,
      logisticsToken
    );
    // console.log('Logistics Purchase Access:', logisticsPurchase.success ? '✅ PASS' : '❌ FAIL');
  }
};

// Main test function
const runTests = async () => {
  // console.log("🚀 Starting API Tests...");
  // console.log("Base URL:", BASE_URL);

  try {
    await testHealthCheck();
    await testAuthentication();
    await testDashboard();
    await testPurchases();
    await testTransfers();
    await testAssignments();
    await testAuditLogs();
    await testRoleBasedAccess();

    // console.log("\n🎉 All tests completed!");
  } catch (error) {
    console.error("❌ Test execution failed:", error);
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
